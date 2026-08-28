from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Crop
from app.schemas import CropCreate, CropResponse
from app.services.auth import get_current_user, require_role

router = APIRouter(prefix="/api/crops", tags=["Crops"])

@router.get("", response_model=List[CropResponse])
def get_crops(db: Session = Depends(get_db)):
    return db.query(Crop).filter(Crop.status == "ACTIVE").all()

@router.post("", response_model=CropResponse)
def create_crop(
    data: CropCreate,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    existing = db.query(Crop).filter(Crop.name == data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Crop with this name already exists.")

    crop = Crop(**data.dict())
    db.add(crop)
    db.commit()
    db.refresh(crop)
    return crop

@router.put("/{crop_id}", response_model=CropResponse)
def update_crop(
    crop_id: int,
    data: CropCreate,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()
    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found.")

    for field, val in data.dict(exclude_unset=True).items():
        setattr(crop, field, val)

    db.commit()
    db.refresh(crop)
    return crop
