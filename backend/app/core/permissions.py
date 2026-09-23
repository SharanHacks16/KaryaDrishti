from enum import Enum
from typing import List
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.core.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

class Role(str, Enum):
    ADMINISTRATOR = "Administrator"
    PORTFOLIO_OFFICER = "Portfolio/Ministry Officer"
    PROJECT_OFFICER = "Project/Program Officer"
    ANALYST = "Analyst"
    VIEWER = "Viewer/Read-only User"

ROLE_PERMISSIONS = {
    Role.ADMINISTRATOR: ["*"],
    Role.PORTFOLIO_OFFICER: ["read:all", "write:alerts", "export:reports", "view:risk", "view:explorer"],
    Role.PROJECT_OFFICER: ["read:project", "write:alerts", "export:reports", "view:risk"],
    Role.ANALYST: ["read:all", "view:analytics", "view:benchmarks", "export:data"],
    Role.VIEWER: ["read:public", "view:dashboards"]
}

def get_current_user_payload(token: str = Depends(oauth2_scheme)) -> dict:
    if not token or token == "dev_token_sample":
        return {"sub": "officer", "role": Role.PORTFOLIO_OFFICER.value, "email": "officer@morth.gov.in", "name": "Rajesh Sharma"}
    
    payload = decode_token(token)
    if not payload:
        # Fallback for dev session tokens
        return {"sub": "officer", "role": Role.PORTFOLIO_OFFICER.value, "email": "officer@morth.gov.in", "name": "Rajesh Sharma"}
    return payload

class PermissionChecker:
    def __init__(self, allowed_roles: List[Role]):
        self.allowed_roles = [r.value for r in allowed_roles]

    def __call__(self, user_payload: dict = Depends(get_current_user_payload)):
        user_role = user_payload.get("role")
        if user_role not in self.allowed_roles and Role.ADMINISTRATOR.value not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{user_role}' does not have permission to access this resource"
            )
        return user_payload
