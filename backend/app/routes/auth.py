from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Farmer
from app.schemas import UserLogin, UserRegister, Token, UserResponse
from app.services.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_farmer(user_data: UserRegister, db: Session = Depends(get_db)):
    mobile = user_data.mobile_number.strip()
    farmer_id_clean = user_data.farmer_id.strip()
    pwd_clean = user_data.password.strip()

    # Check if mobile already exists
    existing_user = db.query(User).filter(User.mobile_number == mobile).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Mobile number is already registered.")

    # Check if farmer ID exists
    existing_farmer = db.query(Farmer).filter(Farmer.farmer_id == farmer_id_clean).first()
    if existing_farmer:
        raise HTTPException(status_code=400, detail="Farmer ID is already registered.")

    # Create User
    new_user = User(
        name=user_data.name.strip(),
        mobile_number=mobile,
        password_hash=get_password_hash(pwd_clean),
        role="FARMER"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create Farmer Profile
    new_farmer = Farmer(
        user_id=new_user.id,
        farmer_id=farmer_id_clean,
        village=user_data.village.strip(),
        district=user_data.district.strip(),
        state=user_data.state.strip(),
        preferred_language=user_data.preferred_language or "English"
    )
    db.add(new_farmer)
    db.commit()

    # Generate Token
    access_token = create_access_token(data={"sub": str(new_user.id), "role": new_user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": new_user.role,
        "user_id": new_user.id,
        "name": new_user.name
    }

from fastapi import Request

@router.post("/login", response_model=Token)
async def login(request: Request, db: Session = Depends(get_db)):
    mobile = None
    pwd = None

    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        try:
            data = await request.json()
            mobile = data.get("mobile_number") or data.get("username")
            pwd = data.get("password")
        except Exception:
            pass
    else:
        try:
            form = await request.form()
            mobile = form.get("username") or form.get("mobile_number")
            pwd = form.get("password")
        except Exception:
            pass

    if not mobile or not pwd:
        raise HTTPException(
            status_code=400,
            detail="Mobile number/username and password are required."
        )

    mobile_str = str(mobile).strip()
    pwd_str = str(pwd).strip()

    user = db.query(User).filter(User.mobile_number == mobile_str).first()
    if not user or not verify_password(pwd_str, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid mobile number or password."
        )

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "user_id": user.id,
        "name": user.name
    }

@router.post("/seed-demo")
def seed_demo_data():
    from seed import seed_database
    try:
        seed_database()
        return {"status": "success", "message": "KisanQ demo dataset successfully seeded!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to seed demo data: {str(e)}")

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
