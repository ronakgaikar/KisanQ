import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Payment, Procurement, Booking, Farmer
from app.schemas import PaymentResponse, PaymentUpdate
from app.services.auth import get_current_user, require_role
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/api/payments", tags=["Payment Tracking"])

@router.get("/my", response_model=List[PaymentResponse])
def get_my_payments(
    current_user: User = Depends(require_role(["FARMER"])),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return []

    payments = db.query(Payment).join(Procurement).join(Booking).filter(
        Booking.farmer_id == farmer.id
    ).order_by(Payment.id.desc()).all()

    results = []
    for p in payments:
        b = p.procurement.booking if p.procurement else None
        results.append({
            "id": p.id,
            "procurement_id": p.procurement_id,
            "farmer_name": current_user.name,
            "amount": p.amount,
            "status": p.status,
            "transaction_id": p.transaction_id,
            "payment_date": p.payment_date
        })
    return results

@router.get("/{id}", response_model=PaymentResponse)
def get_payment_by_id(id: int, db: Session = Depends(get_db)):
    p = db.query(Payment).filter(Payment.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Payment record not found.")

    b = p.procurement.booking if p.procurement else None
    farmer_name = b.farmer.user.name if b and b.farmer and b.farmer.user else ""

    return {
        "id": p.id,
        "procurement_id": p.procurement_id,
        "farmer_name": farmer_name,
        "amount": p.amount,
        "status": p.status,
        "transaction_id": p.transaction_id,
        "payment_date": p.payment_date
    }

@router.put("/{id}/status", response_model=PaymentResponse)
def update_payment_status(
    id: int,
    data: PaymentUpdate,
    current_user: User = Depends(require_role(["OPERATOR", "ADMIN"])),
    db: Session = Depends(get_db)
):
    p = db.query(Payment).filter(Payment.id == id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Payment record not found.")

    p.status = data.status
    if data.status == "COMPLETED" and not p.payment_date:
        p.payment_date = datetime.datetime.utcnow()

    db.commit()
    db.refresh(p)

    # Notify farmer
    b = p.procurement.booking if p.procurement else None
    if b and b.farmer_id:
        NotificationService.send_in_app_notification(
            db=db,
            farmer_id=b.farmer_id,
            notification_type="PAYMENT_UPDATE",
            message=f"✓ Payment of ₹{p.amount:,.2f} status updated to: {p.status}. Transaction ID: {p.transaction_id}"
        )

    farmer_name = b.farmer.user.name if b and b.farmer and b.farmer.user else ""

    return {
        "id": p.id,
        "procurement_id": p.procurement_id,
        "farmer_name": farmer_name,
        "amount": p.amount,
        "status": p.status,
        "transaction_id": p.transaction_id,
        "payment_date": p.payment_date
    }
