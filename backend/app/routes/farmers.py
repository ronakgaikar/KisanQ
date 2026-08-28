from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Farmer
from app.schemas import FarmerResponse, FarmerUpdate
from app.services.auth import get_current_user, require_role

router = APIRouter(prefix="/api/farmers", tags=["Farmers"])

@router.get("/me", response_model=FarmerResponse)
def get_farmer_profile(current_user: User = Depends(require_role(["FARMER"])), db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found.")
    
    return {
        "id": farmer.id,
        "user_id": farmer.user_id,
        "name": current_user.name,
        "mobile_number": current_user.mobile_number,
        "farmer_id": farmer.farmer_id,
        "village": farmer.village,
        "district": farmer.district,
        "state": farmer.state,
        "preferred_language": farmer.preferred_language,
        "created_at": farmer.created_at
    }

@router.put("/me", response_model=FarmerResponse)
def update_farmer_profile(
    data: FarmerUpdate,
    current_user: User = Depends(require_role(["FARMER"])),
    db: Session = Depends(get_db)
):
    farmer = db.query(Farmer).filter(Farmer.user_id == current_user.id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer profile not found.")

    if data.name:
        current_user.name = data.name
    if data.village:
        farmer.village = data.village
    if data.district:
        farmer.district = data.district
    if data.state:
        farmer.state = data.state
    if data.preferred_language:
        farmer.preferred_language = data.preferred_language

    db.commit()
    db.refresh(farmer)
    db.refresh(current_user)

    return {
        "id": farmer.id,
        "user_id": farmer.user_id,
        "name": current_user.name,
        "mobile_number": current_user.mobile_number,
        "farmer_id": farmer.farmer_id,
        "village": farmer.village,
        "district": farmer.district,
        "state": farmer.state,
        "preferred_language": farmer.preferred_language,
        "created_at": farmer.created_at
    }
