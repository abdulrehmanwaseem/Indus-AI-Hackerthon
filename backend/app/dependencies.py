"""
Shared dependency providers for FastAPI.
- Supabase clients (public + service-role)
- Gemini generative model
- Auth dependency (token verification)
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client, Client
import google.generativeai as genai

from app.config import Settings, get_settings

# ── Security scheme ───────────────────────────────────
security = HTTPBearer()


# ── Supabase clients ─────────────────────────────────
def get_supabase(settings: Settings = Depends(get_settings)) -> Client:
    """Public Supabase client (uses anon key, respects RLS)."""
    url = settings.SUPABASE_URL.strip().rstrip("/")
    return create_client(url, settings.SUPABASE_KEY)


def get_supabase_admin(settings: Settings = Depends(get_settings)) -> Client:
    """Service-role Supabase client (bypasses RLS – use with care)."""
    url = settings.SUPABASE_URL.strip().rstrip("/")
    return create_client(url, settings.SUPABASE_SERVICE_ROLE_KEY)


# ── Gemini model ──────────────────────────────────────
def get_gemini_model(settings: Settings = Depends(get_settings)):
    """Returns a configured Gemini 2.5 Flash model instance."""
    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai.GenerativeModel("gemini-2.5-flash")


# ── Auth dependency ───────────────────────────────────
import time
from typing import Dict, Tuple, List, Any

# Simple TTL cache for user profiles to reduce Supabase auth calls
# token -> (user_obj, expiry_timestamp)
_auth_cache: Dict[str, Tuple[Any, float]] = {}
AUTH_CACHE_TTL = 30  # seconds

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    supabase: Client = Depends(get_supabase_admin),
):
    """
    Verify the Bearer token via Supabase and return the user object.
    Uses a short-lived in-memory cache to deduplicate redundant auth checks.
    """
    token = credentials.credentials
    
    # Check cache first
    now = time.time()
    if token in _auth_cache:
        user, expiry = _auth_cache[token]
        if now < expiry:
            return user
        else:
            del _auth_cache[token]

    try:
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            # Cache the successful result
            _auth_cache[token] = (user_response.user, now + AUTH_CACHE_TTL)
            return user_response.user
            
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    except Exception as e:
        # Don't cache failures
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )


def role_required(allowed_roles: List[str]):
    """
    Dependency to restrict access based on user roles.
    Checks user metadata first, then falls back to the 'profiles' table.
    """
    async def role_checker(
        current_user: Any = Depends(get_current_user),
        supabase: Client = Depends(get_supabase_admin),
    ):
        # Prioritize the "profiles" table as the source of truth for the application
        role = None
        try:
            res = (
                supabase.table("profiles")
                .select("role")
                .eq("id", str(current_user.id))
                .single()
                .execute()
            )
            if res.data:
                role = res.data.get("role")
        except Exception:
            # Table might not exist or user not in it yet
            pass

        # Fallback to Supabase Auth metadata
        if not role and current_user.user_metadata:
            role = current_user.user_metadata.get("role")

        # Default to patient
        role = role or "patient"

        if role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Role '{role}' not in {allowed_roles}",
            )
        return current_user
        
    return role_checker
