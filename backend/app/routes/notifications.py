from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Farmer, Notification
from app.schemas import NotificationResponse
from app.services.auth import get_current_user, require_role

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("", response_model=List[NotificationResponse])
def get_farmer_notifications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "FARMER":
        return []

    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        return []

    return db.query(Notification).filter(Notification.farmer_id == farmer.id).order_by(Notification.id.desc()).all()

@router.put("/{id}/read")
def mark_notification_as_read(
    id: int,
    current_user: User = Depends(require_role(["FARMER"])),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found.")

    notif = db.query(Notification).filter(
        Notification.id == id,
        Notification.farmer_id == farmer.id
    ).first()

    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found.")

    notif.is_read = True
    db.commit()
    return {"message": "Notification marked as read."}
