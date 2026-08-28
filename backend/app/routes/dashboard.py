import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, Farmer, Booking, Queue, Procurement, Payment, ProcurementCentre, Crop
from app.services.auth import get_current_user, require_role
from app.services.queue_service import QueueService

router = APIRouter(prefix="/api/dashboard", tags=["Dashboards"])

@router.get("/farmer")
def get_farmer_dashboard(
    current_user: User = Depends(require_role(["FARMER"])),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return {
            "next_booking": None,
            "live_queue": None,
            "procurement": None,
            "payment": None
        }

    # Next / Active Booking
    next_b = db.query(Booking).filter(
        Booking.farmer_id == farmer.id,
        Booking.status.in_(["BOOKED", "ARRIVED", "WAITING", "CALLED", "PROCESSING"])
    ).order_by(Booking.id.asc()).first()

    if not next_b:
        # Latest completed booking if no active
        next_b = db.query(Booking).filter(
            Booking.farmer_id == farmer.id
        ).order_by(Booking.id.desc()).first()

    next_booking_data = None
    live_queue_data = None
    procurement_data = None
    payment_data = None

    if next_b:
        slot = next_b.slot
        next_booking_data = {
            "booking_id": next_b.id,
            "booking_code": next_b.booking_id,
            "token": next_b.token,
            "centre_name": next_b.centre.name if next_b.centre else "",
            "crop_name": next_b.crop.name if next_b.crop else "",
            "date": slot.date if slot else "",
            "time_slot": f"{slot.start_time} - {slot.end_time}" if slot else "",
            "status": next_b.status
        }

        # Queue details
        live_queue_data = QueueService.get_queue_status_for_booking(db, next_b.id)

        # Procurement details
        p = db.query(Procurement).filter(Procurement.booking_id == next_b.id).first()
        if p:
            procurement_data = {
                "expected_quantity": f"{p.expected_quantity} Qtl",
                "actual_quantity": f"{p.actual_quantity} Qtl" if p.actual_quantity else "Pending",
                "rate": f"₹{p.rate}/Qtl" if p.rate else "N/A",
                "total_amount": f"₹{p.total_amount:,.2f}" if p.total_amount else "N/A",
                "status": p.status
            }
            if p.payment:
                payment_data = {
                    "amount": f"₹{p.payment.amount:,.2f}",
                    "status": p.payment.status,
                    "transaction_id": p.payment.transaction_id or "Processing...",
                    "payment_date": p.payment.payment_date
                }

    return {
        "next_booking": next_booking_data,
        "live_queue": live_queue_data,
        "procurement": procurement_data,
        "payment": payment_data
    }

@router.get("/operator")
def get_operator_dashboard(
    centre_id: int = 1,
    current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])),
    db: Session = Depends(get_db)
):
    total_bookings = db.query(Booking).filter(Booking.centre_id == centre_id).count()
    arrived = db.query(Booking).filter(Booking.centre_id == centre_id, Booking.status == "ARRIVED").count()
    waiting = db.query(Booking).filter(Booking.centre_id == centre_id, Booking.status.in_(["WAITING", "BOOKED"])).count()
    processing = db.query(Booking).filter(Booking.centre_id == centre_id, Booking.status.in_(["CALLED", "PROCESSING"])).count()
    completed = db.query(Booking).filter(Booking.centre_id == centre_id, Booking.status == "COMPLETED").count()

    centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == centre_id).first()

    return {
        "centre_name": centre.name if centre else "",
        "total_bookings": total_bookings,
        "arrived": arrived,
        "waiting": waiting,
        "processing": processing,
        "completed": completed
    }

@router.get("/admin")
def get_admin_dashboard(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    total_farmers = db.query(Farmer).count()
    total_centres = db.query(ProcurementCentre).count()
    total_bookings = db.query(Booking).count()
    completed_procurement = db.query(Booking).filter(Booking.status == "COMPLETED").count()
    pending_procurement = db.query(Booking).filter(Booking.status != "COMPLETED").count()

    # Sum totals
    total_quantity = db.query(func.sum(Procurement.actual_quantity)).scalar() or 0.0
    total_value = db.query(func.sum(Procurement.total_amount)).scalar() or 0.0

    return {
        "total_farmers": total_farmers,
        "total_centres": total_centres,
        "total_bookings": total_bookings,
        "completed_procurement": completed_procurement,
        "pending_procurement": pending_procurement,
        "total_quantity_procured": round(total_quantity, 2),
        "total_procurement_value": round(total_value, 2)
    }

@router.get("/analytics")
def get_admin_analytics(
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    # Booking status breakdown
    status_counts = db.query(Booking.status, func.count(Booking.id)).group_by(Booking.status).all()
    booking_status = [{"name": s[0], "value": s[1]} for s in status_counts]

    # Payment status breakdown
    payment_counts = db.query(Payment.status, func.count(Payment.id)).group_by(Payment.status).all()
    payment_status = [{"name": s[0], "value": s[1]} for s in payment_counts]

    # Procurement volume per crop
    crop_volumes = db.query(Crop.name, func.sum(Procurement.actual_quantity)).join(Booking, Booking.crop_id == Crop.id).join(Procurement, Procurement.booking_id == Booking.id).group_by(Crop.name).all()
    volume_by_crop = [{"crop": c[0], "volume": round(c[1] or 0.0, 2)} for c in crop_volumes]

    return {
        "booking_status": booking_status,
        "payment_status": payment_status,
        "volume_by_crop": volume_by_crop
    }
