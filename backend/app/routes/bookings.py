import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Farmer, Booking, Slot, ProcurementCentre, Crop, Queue
from app.schemas import BookingCreate, BookingResponse
from app.services.auth import get_current_user, require_role
from app.services.queue_service import QueueService
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

@router.post("", response_model=BookingResponse)
def create_booking(
    data: BookingCreate,
    current_user: User = Depends(require_role(["FARMER"])),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found.")

    slot = db.query(Slot).filter(Slot.id == data.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Selected slot does not exist.")

    if slot.booked_count >= slot.capacity or slot.status == "FULL":
        raise HTTPException(status_code=400, detail="This slot is no longer available. Please select another slot.")

    centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == data.centre_id).first()
    crop = db.query(Crop).filter(Crop.id == data.crop_id).first()

    # Generate unique booking ID & Token
    timestamp_str = datetime.datetime.utcnow().strftime("%Y%m%d%H%M%S")
    booking_code = f"BK-2026-{farmer.id}{timestamp_str[-5:]}"
    token_str = QueueService.generate_token(db, data.centre_id, slot.date)

    # Increment slot booked count
    slot.booked_count += 1
    if slot.booked_count >= slot.capacity:
        slot.status = "FULL"

    # Create Booking
    booking = Booking(
        booking_id=booking_code,
        farmer_id=farmer.id,
        centre_id=data.centre_id,
        crop_id=data.crop_id,
        slot_id=data.slot_id,
        token=token_str,
        expected_quantity=data.expected_quantity,
        status="BOOKED"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)

    # Create Queue entry
    queue_entry = Queue(
        booking_id=booking.id,
        status="WAITING",
        estimated_wait_time=0
    )
    db.add(queue_entry)
    db.commit()

    # Recalculate centre queue wait times
    QueueService.recalculate_centre_queue(db, data.centre_id)

    # In-app notification
    NotificationService.send_in_app_notification(
        db=db,
        farmer_id=farmer.id,
        notification_type="BOOKING_CONFIRMED",
        message=f"✓ Your booking {booking.booking_id} at {centre.name} has been confirmed. Your token is {token_str}."
    )

    return {
        "id": booking.id,
        "booking_id": booking.booking_id,
        "farmer_id": farmer.id,
        "farmer_name": current_user.name,
        "centre_id": centre.id,
        "centre_name": centre.name,
        "crop_id": crop.id,
        "crop_name": crop.name,
        "slot_id": slot.id,
        "date": slot.date,
        "time_slot": f"{slot.start_time} - {slot.end_time}",
        "token": booking.token,
        "expected_quantity": booking.expected_quantity,
        "status": booking.status,
        "created_at": booking.created_at
    }

@router.get("/my", response_model=List[BookingResponse])
def get_my_bookings(
    current_user: User = Depends(require_role(["FARMER"])),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return []

    bookings = db.query(Booking).filter(Booking.farmer_id == farmer.id).order_by(Booking.id.desc()).all()
    results = []
    for b in bookings:
        slot = b.slot
        results.append({
            "id": b.id,
            "booking_id": b.booking_id,
            "farmer_id": farmer.id,
            "farmer_name": current_user.name,
            "centre_id": b.centre_id,
            "centre_name": b.centre.name if b.centre else "",
            "crop_id": b.crop_id,
            "crop_name": b.crop.name if b.crop else "",
            "slot_id": b.slot_id,
            "date": slot.date if slot else "",
            "time_slot": f"{slot.start_time} - {slot.end_time}" if slot else "",
            "token": b.token,
            "expected_quantity": b.expected_quantity,
            "status": b.status,
            "created_at": b.created_at
        })
    return results

@router.get("/{id}", response_model=BookingResponse)
def get_booking_details(id: int, db: Session = Depends(get_db)):
    b = db.query(Booking).filter(Booking.id == id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found.")
    slot = b.slot
    return {
        "id": b.id,
        "booking_id": b.booking_id,
        "farmer_id": b.farmer_id,
        "farmer_name": b.farmer.user.name if b.farmer and b.farmer.user else "",
        "centre_id": b.centre_id,
        "centre_name": b.centre.name if b.centre else "",
        "crop_id": b.crop_id,
        "crop_name": b.crop.name if b.crop else "",
        "slot_id": b.slot_id,
        "date": slot.date if slot else "",
        "time_slot": f"{slot.start_time} - {slot.end_time}" if slot else "",
        "token": b.token,
        "expected_quantity": b.expected_quantity,
        "status": b.status,
        "created_at": b.created_at
    }

@router.put("/{id}/cancel")
def cancel_booking(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    b = db.query(Booking).filter(Booking.id == id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Booking not found.")

    b.status = "CANCELLED"
    if b.queue_entry:
        b.queue_entry.status = "CANCELLED"

    # Decrement slot count if active
    if b.slot and b.slot.booked_count > 0:
        b.slot.booked_count -= 1
        if b.slot.status == "FULL":
            b.slot.status = "AVAILABLE"

    db.commit()
    QueueService.recalculate_centre_queue(db, b.centre_id)
    return {"message": "Booking cancelled successfully."}
