from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.permissions import get_current_user_payload
from app.core.audit import log_audit_event
from app.models.domain import User
from app.schemas.domain import Token, LoginRequest, SignupRequest, UserProfile

router = APIRouter()

@router.post("/signup", response_model=Token)
def signup(payload: SignupRequest, response: Response, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == payload.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Username '{payload.username}' is already registered."
        )
    existing_email = db.query(User).filter(User.email == payload.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{payload.email}' is already registered."
        )

    new_user = User(
        username=payload.username,
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=payload.role or "Portfolio/Ministry Officer",
        department=payload.department or "Ministry Office"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = create_access_token(subject=new_user.username, role=new_user.role)
    log_audit_event(new_user.username, "signup_success", "/auth/signup", {"role": new_user.role})

    response.set_cookie(
        key="karyadrishti_session",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        role=new_user.role,
        username=new_user.username,
        email=new_user.email,
        full_name=new_user.full_name,
        department=new_user.department
    )

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    # Support official demo logins easily
    user = db.query(User).filter(User.username == payload.username).first()
    if not user and "@" in payload.username:
        user = db.query(User).filter(User.email == payload.username).first()
    
    if not user or not verify_password(payload.password, user.hashed_password):
        log_audit_event("anonymous", "login_failed", "/auth/login", {"username": payload.username})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password. Please verify credentials."
        )

    access_token = create_access_token(subject=user.username, role=user.role)
    
    log_audit_event(user.username, "login_success", "/auth/login", {"role": user.role})

    # Set secure cookie
    response.set_cookie(
        key="karyadrishti_session",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False # set True in HTTPS production
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        department=user.department
    )

@router.post("/logout")
def logout(response: Response, user_payload: dict = Depends(get_current_user_payload)):
    username = user_payload.get("sub", "user")
    log_audit_event(username, "logout", "/auth/logout")
    response.delete_cookie(key="karyadrishti_session")
    return {"message": "Successfully logged out and session invalidated"}

@router.get("/me")
def get_me(db: Session = Depends(get_db), user_payload: dict = Depends(get_current_user_payload)):
    username = user_payload.get("sub")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        # Fallback payload for demo/token mode
        return {
            "id": 1,
            "username": username or "officer",
            "email": "officer@morth.gov.in",
            "full_name": "Ministry Officer",
            "role": user_payload.get("role", "Portfolio/Ministry Officer"),
            "department": "Ministry of Road Transport and Highways",
            "is_active": True,
            "created_at": "2026-01-01T00:00:00"
        }
    return user
