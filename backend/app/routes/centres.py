from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, ProcurementCentre
from app.schemas import CentreCreate, CentreResponse
from app.services.auth import get_current_user, require_role

router = APIRouter(prefix="/api/centres", tags=["Procurement Centres"])

@router.get("", response_model=List[CentreResponse])
def get_centres(db: Session = Depends(get_db)):
    return db.query(ProcurementCentre).all()

@router.get("/{centre_id}", response_model=CentreResponse)
def get_centre_by_id(centre_id: int, db: Session = Depends(get_db)):
    centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == centre_id).first()
    if not centre:
        raise HTTPException(status_code=404, detail="Procurement centre not found.")
    return centre

@router.post("", response_model=CentreResponse)
def create_centre(
    data: CentreCreate,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    centre = ProcurementCentre(**data.dict())
    db.add(centre)
    db.commit()
    db.refresh(centre)
    return centre

@router.put("/{centre_id}", response_model=CentreResponse)
def update_centre(
    centre_id: int,
    data: CentreCreate,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == centre_id).first()
    if not centre:
        raise HTTPException(status_code=404, detail="Procurement centre not found.")

    for field, val in data.dict(exclude_unset=True).items():
        setattr(centre, field, val)

    db.commit()
    db.refresh(centre)
    return centre

@router.delete("/{centre_id}")
def delete_centre(
    centre_id: int,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    centre = db.query(ProcurementCentre).filter(ProcurementCentre.id == centre_id).first()
    if not centre:
        raise HTTPException(status_code=404, detail="Procurement centre not found.")

    db.delete(centre)
    db.commit()
    return {"message": "Procurement centre deleted successfully."}
