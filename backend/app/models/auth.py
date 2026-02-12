from pydantic import BaseModel, EmailStr
from typing import Optional


# ── Requests ──────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "patient"  # doctor | patient | admin


class LoginRequest(BaseModel):
    email: str
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


# ── Responses ─────────────────────────────────────────
class AuthTokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: Optional[int] = None


class UserProfile(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    created_at: Optional[str] = None


class AuthResponse(BaseModel):
    user: UserProfile
    tokens: AuthTokens


class OAuthURLResponse(BaseModel):
    url: str
