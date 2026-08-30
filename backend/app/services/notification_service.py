from sqlalchemy.orm import Session
from app.models import Notification, Farmer, User

class NotificationService:
    @staticmethod
    def send_in_app_notification(db: Session, farmer_id: int, notification_type: str, message: str) -> Notification:
        """
        Generates and persists an in-app notification for the farmer.
        """
        notification = Notification(
            farmer_id=farmer_id,
            type=notification_type,
            message=message,
            is_read=False
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)

        # Also trigger SMS hook if enabled in future
        farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
        if farmer and farmer.user:
            NotificationService.send_sms(farmer.user.mobile_number, message)

        return notification

    @staticmethod
    def send_sms(mobile_number: str, message: str) -> bool:
        """
        Modular SMS notification stub.
        Designed for future integration with Telecom APIs / SMS Gateways without modifying core business logic.
        """
        try:
            print(f"[FUTURE SMS STUB] To: {mobile_number} | Message: {message}")
        except Exception:
            clean_msg = message.encode("ascii", "ignore").decode("ascii")
            print(f"[FUTURE SMS STUB] To: {mobile_number} | Message: {clean_msg}")
        return True
