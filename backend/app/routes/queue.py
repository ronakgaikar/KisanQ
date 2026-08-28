import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Queue, Booking, ProcurementCentre
from app.schemas import QueueStatusResponse, QueueItem
from app.services.auth import get_current_user, require_role
from app.services.queue_service import QueueService
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/queue", tags=["Smart Queue Management"])

@router.get("/{centre_id}", response_model=List[QueueItem])
def get_centre_queue(centre_id: int, db: Session = Depends(get_db)):
    """
    Returns full live queue table for a specific procurement centre.
    """
    queues = db.query(Queue).join(Booking).filter(
        Booking.centre_id == centre_id,
        Queue.status.in_(["ARRIVED", "WAITING", "CALLED", "PROCESSING", "SKIPPED"])
    ).order_by(Queue.id.asc()).all()

    results = []
    for q in queues:
        b = q.booking
        results.append({
            "id": q.id,
            "booking_id": b.id,
            "token": b.token,
            "farmer_name": b.farmer.user.name if b.farmer and b.farmer.user else "Unknown",
            "crop_name": b.crop.name if b.crop else "Crop",
            "expected_quantity": b.expected_quantity,
            "status": q.status,
            "queue_position": q.queue_position,
            "estimated_wait_time": q.estimated_wait_time
        })
    return results

@router.get("/status/{booking_id}", response_model=QueueStatusResponse)
def get_farmer_queue_status(booking_id: int, db: Session = Depends(get_db)):
    """
    Returns live personalized queue status for a farmer's booking.
    """
    status_data = QueueService.get_queue_status_for_booking(db, booking_id)
    if not status_data:
        raise HTTPException(status_code=404, detail="Queue status for booking not found.")
    return status_data

@router.post("/{booking_id}/arrive")
def mark_arrived(booking_id: int, current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])), db: Session = Depends(get_db)):
    q = db.query(Queue).filter(Queue.booking_id == booking_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Queue item not found.")

    q.status = "ARRIVED"
    q.arrival_time = datetime.datetime.utcnow()
    q.booking.status = "ARRIVED"
    db.commit()

    QueueService.recalculate_centre_queue(db, q.booking.centre_id)
    return {"message": f"Farmer with Token {q.booking.token} marked as ARRIVED."}

@router.post("/call-next")
def call_next_farmer(
    centre_id: int = Query(...),
    current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])),
    db: Session = Depends(get_db)
):
    """
    Finds the next eligible farmer (ARRIVED or WAITING) and updates status to CALLED.
    """
    next_q = db.query(Queue).join(Booking).filter(
        Booking.centre_id == centre_id,
        Queue.status.in_(["ARRIVED", "WAITING"])
    ).order_by(Queue.id.asc()).first()

    if not next_q:
        raise HTTPException(status_code=400, detail="No farmers currently waiting in the queue.")

    next_q.status = "CALLED"
    next_q.called_time = datetime.datetime.utcnow()
    next_q.booking.status = "CALLED"
    db.commit()

    QueueService.recalculate_centre_queue(db, centre_id)

    # In-app notification to farmer
    NotificationService.send_in_app_notification(
        db=db,
        farmer_id=next_q.booking.farmer_id,
        notification_type="TURN_APPROACHING",
        message=f"🔔 Token {next_q.booking.token}: Your turn is approaching. Please proceed to the procurement counter immediately."
    )

    return {
        "message": f"Token {next_q.booking.token} has been CALLED.",
        "called_token": next_q.booking.token,
        "farmer_name": next_q.booking.farmer.user.name if next_q.booking.farmer and next_q.booking.farmer.user else ""
    }

@router.post("/{booking_id}/start")
def start_procurement(booking_id: int, current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])), db: Session = Depends(get_db)):
    q = db.query(Queue).filter(Queue.booking_id == booking_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Queue item not found.")

    q.status = "PROCESSING"
    q.processing_start_time = datetime.datetime.utcnow()
    q.booking.status = "PROCESSING"
    db.commit()

    NotificationService.send_in_app_notification(
        db=db,
        farmer_id=q.booking.farmer_id,
        notification_type="PROCUREMENT_STARTED",
        message=f"✓ Procurement for booking {q.booking.booking_id} (Token {q.booking.token}) is now in progress."
    )
    return {"message": f"Procurement started for Token {q.booking.token}."}

@router.post("/{booking_id}/complete")
def complete_procurement_queue(booking_id: int, current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])), db: Session = Depends(get_db)):
    q = db.query(Queue).filter(Queue.booking_id == booking_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Queue item not found.")

    q.status = "COMPLETED"
    q.completion_time = datetime.datetime.utcnow()
    q.booking.status = "COMPLETED"
    db.commit()

    QueueService.recalculate_centre_queue(db, q.booking.centre_id)
    return {"message": f"Queue status completed for Token {q.booking.token}."}

@router.post("/{booking_id}/skip")
def skip_farmer(booking_id: int, current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])), db: Session = Depends(get_db)):
    q = db.query(Queue).filter(Queue.booking_id == booking_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Queue item not found.")

    q.status = "SKIPPED"
    q.booking.status = "SKIPPED"
    db.commit()

    QueueService.recalculate_centre_queue(db, q.booking.centre_id)
    return {"message": f"Token {q.booking.token} marked as SKIPPED."}
