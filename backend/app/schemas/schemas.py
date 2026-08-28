from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserLogin(BaseModel):
    mobile_number: str
    password: str

class UserRegister(BaseModel):
    name: str
    mobile_number: str
    farmer_id: str
    village: str
    district: str
    state: str
    preferred_language: Optional[str] = "English"
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    name: str

class TokenData(BaseModel):
    user_id: Optional[int] = None
    role: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    mobile_number: str
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

# --- Farmer Schemas ---
class FarmerResponse(BaseModel):
    id: int
    user_id: int
    name: str
    mobile_number: str
    farmer_id: str
    village: str
    district: str
    state: str
    preferred_language: str
    created_at: datetime
    class Config:
        from_attributes = True

class FarmerUpdate(BaseModel):
    name: Optional[str] = None
    village: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    preferred_language: Optional[str] = None

# --- Centre Schemas ---
class CentreCreate(BaseModel):
    name: str
    address: str
    district: str
    state: str
    capacity: Optional[int] = 50
    average_processing_time: Optional[int] = 10
    status: Optional[str] = "ACTIVE"

class CentreResponse(BaseModel):
    id: int
    name: str
    address: str
    district: str
    state: str
    capacity: int
    average_processing_time: int
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# --- Crop Schemas ---
class CropCreate(BaseModel):
    name: str
    unit: Optional[str] = "Quintal"
    status: Optional[str] = "ACTIVE"

class CropResponse(BaseModel):
    id: int
    name: str
    unit: str
    status: str
    class Config:
        from_attributes = True

# --- Slot Schemas ---
class SlotCreate(BaseModel):
    centre_id: int
    date: str
    start_time: str
    end_time: str
    capacity: Optional[int] = 20

class SlotResponse(BaseModel):
    id: int
    centre_id: int
    date: str
    start_time: str
    end_time: str
    capacity: int
    booked_count: int
    status: str
    class Config:
        from_attributes = True

# --- Booking Schemas ---
class BookingCreate(BaseModel):
    crop_id: int
    expected_quantity: float
    centre_id: int
    slot_id: int

class BookingResponse(BaseModel):
    id: int
    booking_id: str
    farmer_id: int
    farmer_name: Optional[str] = None
    centre_id: int
    centre_name: Optional[str] = None
    crop_id: int
    crop_name: Optional[str] = None
    slot_id: int
    date: Optional[str] = None
    time_slot: Optional[str] = None
    token: str
    expected_quantity: float
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

# --- Queue Schemas ---
class QueueStatusResponse(BaseModel):
    booking_id: int
    token: str
    centre_name: str
    queue_position: int
    farmers_ahead: int
    currently_serving_token: Optional[str] = None
    estimated_wait_time: int # minutes
    status: str
    arrival_time: Optional[datetime] = None
    called_time: Optional[datetime] = None

class QueueItem(BaseModel):
    id: int
    booking_id: int
    token: str
    farmer_name: str
    crop_name: str
    expected_quantity: float
    status: str
    queue_position: int
    estimated_wait_time: int

# --- Procurement Schemas ---
class ProcurementCreate(BaseModel):
    booking_id: int
    actual_quantity: float
    rate: float
    quality_grade: Optional[str] = "Grade A"
    remarks: Optional[str] = None

class ProcurementResponse(BaseModel):
    id: int
    booking_id: int
    booking_code: Optional[str] = None
    farmer_name: Optional[str] = None
    crop_name: Optional[str] = None
    expected_quantity: float
    actual_quantity: Optional[float] = None
    rate: Optional[float] = None
    total_amount: Optional[float] = None
    quality_grade: Optional[str] = None
    status: str
    remarks: Optional[str] = None
    completed_at: Optional[datetime] = None
    payment_status: Optional[str] = None
    transaction_id: Optional[str] = None
    class Config:
        from_attributes = True

# --- Payment Schemas ---
class PaymentUpdate(BaseModel):
    status: str

class PaymentResponse(BaseModel):
    id: int
    procurement_id: int
    farmer_name: Optional[str] = None
    amount: float
    status: str
    transaction_id: Optional[str] = None
    payment_date: Optional[datetime] = None
    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationResponse(BaseModel):
    id: int
    farmer_id: int
    type: str
    message: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True
