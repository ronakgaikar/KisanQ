import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Enum
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    mobile_number = Column(String(15), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="FARMER") # FARMER, OPERATOR, ADMIN
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer_profile = relationship("Farmer", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    farmer_id = Column(String(50), unique=True, index=True, nullable=False) # Govt Farmer Registration ID
    village = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    preferred_language = Column(String(20), default="English")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="farmer_profile")
    bookings = relationship("Booking", back_populates="farmer")
    notifications = relationship("Notification", back_populates="farmer")

class ProcurementCentre(Base):
    __tablename__ = "procurement_centres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    address = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    capacity = Column(Integer, default=50) # Max daily capacity
    average_processing_time = Column(Integer, default=10) # Minutes per farmer
    status = Column(String(20), default="ACTIVE") # ACTIVE, INACTIVE
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    slots = relationship("Slot", back_populates="centre", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="centre")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    unit = Column(String(20), default="Quintal")
    status = Column(String(20), default="ACTIVE") # ACTIVE, INACTIVE

    bookings = relationship("Booking", back_populates="crop")

class Slot(Base):
    __tablename__ = "slots"

    id = Column(Integer, primary_key=True, index=True)
    centre_id = Column(Integer, ForeignKey("procurement_centres.id"), nullable=False)
    date = Column(String(20), nullable=False) # YYYY-MM-DD
    start_time = Column(String(10), nullable=False) # e.g. "09:00"
    end_time = Column(String(10), nullable=False) # e.g. "09:30"
    capacity = Column(Integer, default=20)
    booked_count = Column(Integer, default=0)
    status = Column(String(20), default="AVAILABLE") # AVAILABLE, FULL, CLOSED

    centre = relationship("ProcurementCentre", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(String(50), unique=True, index=True, nullable=False) # BK-2026-XXXXX
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    centre_id = Column(Integer, ForeignKey("procurement_centres.id"), nullable=False)
    crop_id = Column(Integer, ForeignKey("crops.id"), nullable=False)
    slot_id = Column(Integer, ForeignKey("slots.id"), nullable=False)
    token = Column(String(20), nullable=False) # e.g., A124
    expected_quantity = Column(Float, nullable=False)
    status = Column(String(20), default="BOOKED") # BOOKED, ARRIVED, WAITING, CALLED, PROCESSING, COMPLETED, SKIPPED, CANCELLED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="bookings")
    centre = relationship("ProcurementCentre", back_populates="bookings")
    crop = relationship("Crop", back_populates="bookings")
    slot = relationship("Slot", back_populates="bookings")
    queue_entry = relationship("Queue", back_populates="booking", uselist=False, cascade="all, delete-orphan")
    procurement_entry = relationship("Procurement", back_populates="booking", uselist=False, cascade="all, delete-orphan")

class Queue(Base):
    __tablename__ = "queue"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    queue_position = Column(Integer, default=0)
    status = Column(String(20), default="WAITING") # ARRIVED, WAITING, CALLED, PROCESSING, COMPLETED, SKIPPED, CANCELLED
    arrival_time = Column(DateTime, nullable=True)
    called_time = Column(DateTime, nullable=True)
    processing_start_time = Column(DateTime, nullable=True)
    completion_time = Column(DateTime, nullable=True)
    estimated_wait_time = Column(Integer, default=0) # Minutes

    booking = relationship("Booking", back_populates="queue_entry")

class Procurement(Base):
    __tablename__ = "procurement"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), unique=True, nullable=False)
    expected_quantity = Column(Float, nullable=False)
    actual_quantity = Column(Float, nullable=True)
    rate = Column(Float, nullable=True) # Price per quintal
    total_amount = Column(Float, nullable=True)
    quality_grade = Column(String(20), default="Grade A")
    status = Column(String(20), default="PENDING") # PENDING, IN_PROGRESS, COMPLETED
    remarks = Column(Text, nullable=True)
    completed_at = Column(DateTime, nullable=True)

    booking = relationship("Booking", back_populates="procurement_entry")
    payment = relationship("Payment", back_populates="procurement", uselist=False, cascade="all, delete-orphan")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    procurement_id = Column(Integer, ForeignKey("procurement.id"), unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(String(20), default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    transaction_id = Column(String(100), unique=True, nullable=True) # PAY-2026-XXXXXX
    payment_date = Column(DateTime, nullable=True)

    procurement = relationship("Procurement", back_populates="payment")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    type = Column(String(50), nullable=False) # BOOKING_CONFIRMED, TURN_APPROACHING, PROCUREMENT_STARTED, PROCUREMENT_COMPLETED, PAYMENT_UPDATE
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farmer = relationship("Farmer", back_populates="notifications")
