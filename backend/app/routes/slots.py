from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Slot, ProcurementCentre
from app.schemas import SlotCreate, SlotResponse
from app.services.auth import get_current_user, require_role

router = APIRouter(prefix="/api/slots", tags=["Slots"])

@router.get("", response_model=List[SlotResponse])
def get_slots(
    centre_id: Optional[int] = None,
    date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Slot)
    if centre_id:
        query = query.filter(Slot.centre_id == centre_id)
    if date:
        query = query.filter(Slot.date == date)
    return query.all()

@router.get("/available", response_model=List[SlotResponse])
def get_available_slots(
    centre_id: int = Query(...),
    date: str = Query(...),
    db: Session = Depends(get_db)
):
    slots = db.query(Slot).filter(
        Slot.centre_id == centre_id,
        Slot.date == date
    ).all()
    
    # Auto update FULL status if booked_count >= capacity
    for slot in slots:
        if slot.booked_count >= slot.capacity and slot.status == "AVAILABLE":
            slot.status = "FULL"
    db.commit()

    return slots

@router.post("", response_model=SlotResponse)
def create_slot(
    data: SlotCreate,
    current_user: User = Depends(require_role(["ADMIN", "OPERATOR"])),
    db: Session = Depends(get_db)
):
    centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == data.centre_id).first()
    if not centre:
        raise HTTPException(status_code=404, detail="Procurement centre not found.")

    slot = Slot(**data.dict(), booked_count=0, status="AVAILABLE")
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot

@router.put("/{slot_id}", response_model=SlotResponse)
def update_slot(
    slot_id: int,
    data: SlotCreate,
    current_user: User = Depends(require_role(["ADMIN", "OPERATOR"])),
    db: Session = Depends(get_db)
):
    slot = db.query(Slot).filter(Slot.id == slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found.")

    for field, val in data.dict(exclude_unset=True).items():
        setattr(slot, field, val)

    if slot.booked_count >= slot.capacity:
        slot.status = "FULL"

    db.commit()
    db.refresh(slot)
    return slot
