import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models import Booking, Queue, Slot, ProcurementCentre, Notification
from app.services.notification_service import NotificationService

class QueueService:
    @staticmethod
    def generate_token(db: Session, centre_id: int, date_str: str) -> str:
        """
        Generates dynamic unique queue tokens per Procurement Centre + Date (e.g., A101, A102, A103).
        """
        prefix = "A"
        # Count existing bookings for this centre and date
        count = db.query(Booking).join(Slot).filter(
            Booking.centre_id == centre_id,
            Slot.date == date_str
        ).count()
        
        token_number = 101 + count
        return f"{prefix}{token_number}"

    @staticmethod
    def recalculate_centre_queue(db: Session, centre_id: int):
        """
        Recalculates queue positions and estimated wait times for all waiting/arrived farmers at a centre.
        Algorithm:
        Estimated Waiting Time = Farmers Ahead * Centre.average_processing_time
        """
        centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == centre_id).first()
        avg_time = centre.average_processing_time if centre else 10

        # Fetch active queue items for centre sorted by booking ID / creation
        active_queues = db.query(Queue).join(Booking).filter(
            Booking.centre_id == centre_id,
            Queue.status.in_(["ARRIVED", "WAITING"])
        ).order_by(Queue.id.asc()).all()

        for index, queue_item in enumerate(active_queues):
            farmers_ahead = index
            queue_item.queue_position = index + 1
            queue_item.estimated_wait_time = farmers_ahead * avg_time
            
            # Send notification if turn is imminent (1 or 2 farmers ahead)
            if farmers_ahead in [1, 2]:
                NotificationService.send_in_app_notification(
                    db=db,
                    farmer_id=queue_item.booking.farmer_id,
                    notification_type="TURN_APPROACHING",
                    message=f"Your turn is approaching! Token {queue_item.booking.token}: {farmers_ahead} farmer(s) ahead. Estimated wait: {queue_item.estimated_wait_time} minutes."
                )

        db.commit()

    @staticmethod
    def get_queue_status_for_booking(db: Session, booking_id: int) -> dict:
        """
        Calculates real-time queue position, currently serving token, farmers ahead, and wait time for a farmer.
        """
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            return None

        queue_item = db.query(Queue).filter(Queue.booking_id == booking_id).first()
        centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == booking.centre_id).first()
        avg_time = centre.average_processing_time if centre else 10

        # Currently serving token (status CALLED or PROCESSING at this centre)
        currently_serving_item = db.query(Queue).join(Booking).filter(
            Booking.centre_id == booking.centre_id,
            Queue.status.in_(["CALLED", "PROCESSING"])
        ).order_by(Queue.id.asc()).first()

        currently_serving_token = currently_serving_item.booking.token if currently_serving_item else "None"

        if queue_item and queue_item.status in ["ARRIVED", "WAITING"]:
            # Count farmers ahead in the same centre queue who arrived or are waiting before this token
            farmers_ahead = db.query(Queue).join(Booking).filter(
                Booking.centre_id == booking.centre_id,
                Queue.status.in_(["ARRIVED", "WAITING"]),
                Queue.id < queue_item.id
            ).count()
            estimated_wait = farmers_ahead * avg_time
            queue_pos = farmers_ahead + 1
        elif queue_item and queue_item.status in ["CALLED", "PROCESSING"]:
            farmers_ahead = 0
            estimated_wait = 0
            queue_pos = 0
        else:
            farmers_ahead = 0
            estimated_wait = 0
            queue_pos = 0

        return {
            "booking_id": booking.id,
            "token": booking.token,
            "centre_name": centre.name if centre else "",
            "queue_position": queue_pos,
            "farmers_ahead": farmers_ahead,
            "currently_serving_token": currently_serving_token,
            "estimated_wait_time": estimated_wait,
            "status": queue_item.status if queue_item else booking.status,
            "arrival_time": queue_item.arrival_time if queue_item else None,
            "called_time": queue_item.called_time if queue_item else None
        }
