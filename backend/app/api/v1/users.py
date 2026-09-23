from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.permissions import get_current_user_payload
from app.models.domain import User

router = APIRouter()

@router.get("/me")
def get_user_me(user_payload: dict = Depends(get_current_user_payload), db: Session = Depends(get_db)):
    username = user_payload.get("sub")
    u = db.query(User).filter(User.username == username).first()
    if u:
        return {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "department": u.department,
            "is_active": u.is_active,
            "created_at": u.created_at
        }
    return {
        "id": 1,
        "username": username or "officer",
        "email": "officer@gov.in",
        "full_name": "Ministry Officer",
        "role": user_payload.get("role", "Portfolio/Ministry Officer"),
        "department": "Ministry of Road Transport and Highways",
        "is_active": True,
        "created_at": "2026-01-01T00:00:00"
    }
