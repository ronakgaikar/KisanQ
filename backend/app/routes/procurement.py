import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Booking, Procurement, Payment, Queue
from app.schemas import ProcurementCreate, ProcurementResponse
from app.services.auth import get_current_user, require_role
from app.services.notification_service import NotificationService
from app.services.queue_service import QueueService

router = APIRouter(prefix="/api/procurement", tags=["Procurement"])

@router.post("", response_model=ProcurementResponse)
def record_procurement(
    data: ProcurementCreate,
    current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])),
    db: Session = Depends(get_db)
):
    booking = db.query(Booking).filter(Booking.id == data.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found.")

    total_amt = data.actual_quantity * data.rate

    procurement = db.query(Procurement).filter(Procurement.booking_id == data.booking_id).first()
    if not procurement:
        procurement = Procurement(
            booking_id=data.booking_id,
            expected_quantity=booking.expected_quantity,
            actual_quantity=data.actual_quantity,
            rate=data.rate,
            total_amount=total_amt,
            quality_grade=data.quality_grade or "Grade A",
            status="COMPLETED",
            remarks=data.remarks,
            completed_at=datetime.datetime.utcnow()
        )
        db.add(procurement)
    else:
        procurement.actual_quantity = data.actual_quantity
        procurement.rate = data.rate
        procurement.total_amount = total_amt
        procurement.quality_grade = data.quality_grade or procurement.quality_grade
        procurement.status = "COMPLETED"
        procurement.remarks = data.remarks
        procurement.completed_at = datetime.datetime.utcnow()

    booking.status = "COMPLETED"
    if booking.queue_entry:
        booking.queue_entry.status = "COMPLETED"
        booking.queue_entry.completion_time = datetime.datetime.utcnow()

    db.commit()
    db.refresh(procurement)

    # Auto generate payment record
    timestamp_str = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")
    tx_id = f"PAY-2026-{procurement.id}{timestamp_str[-6:]}"

    payment = db.query(Payment).filter(Payment.procurement_id == procurement.id).first()
    if not payment:
        payment = Payment(
            procurement_id=procurement.id,
            amount=total_amt,
            status="PROCESSING",
            transaction_id=tx_id,
            payment_date=datetime.datetime.utcnow()
        )
        db.add(payment)
    else:
        payment.amount = total_amt
        if payment.status == "PENDING":
            payment.status = "PROCESSING"

    db.commit()

    # Recalculate centre queue
    QueueService.recalculate_centre_queue(db, booking.centre_id)

    # Notify farmer
    NotificationService.send_in_app_notification(
        db=db,
        farmer_id=booking.farmer_id,
        notification_type="PROCUREMENT_COMPLETED",
        message=f"✓ Procurement completed for token {booking.token}. Actual Quantity: {data.actual_quantity} Qtl. Total Amount: ₹{total_amt:,.2f}."
    )

    return {
        "id": procurement.id,
        "booking_id": booking.id,
        "booking_code": booking.booking_id,
        "farmer_name": booking.farmer.user.name if booking.farmer and booking.farmer.user else "",
        "crop_name": booking.crop.name if booking.crop else "",
        "expected_quantity": procurement.expected_quantity,
        "actual_quantity": procurement.actual_quantity,
        "rate": procurement.rate,
        "total_amount": procurement.total_amount,
        "quality_grade": procurement.quality_grade,
        "status": procurement.status,
        "remarks": procurement.remarks,
        "completed_at": procurement.completed_at,
        "payment_status": payment.status if payment else "PROCESSING",
        "transaction_id": payment.transaction_id if payment else tx_id
    }

@router.get("/{id}", response_model=ProcurementResponse)
def get_procurement_details(id: int, db: Session = Depends(get_db)):
    p = db.query(Procurement).filter(Procurement.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Procurement record not found.")

    b = p.booking
    payment = p.payment

    return {
        "id": p.id,
        "booking_id": b.id if b else 0,
        "booking_code": b.booking_id if b else "",
        "farmer_name": b.farmer.user.name if b and b.farmer and b.farmer.user else "",
        "crop_name": b.crop.name if b and b.crop else "",
        "expected_quantity": p.expected_quantity,
        "actual_quantity": p.actual_quantity,
        "rate": p.rate,
        "total_amount": p.total_amount,
        "quality_grade": p.quality_grade,
        "status": p.status,
        "remarks": p.remarks,
        "completed_at": p.completed_at,
        "payment_status": payment.status if payment else "PENDING",
        "transaction_id": payment.transaction_id if payment else None
    }
