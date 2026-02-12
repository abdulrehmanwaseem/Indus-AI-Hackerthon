"""
Auth Router — Supabase Auth endpoints.
Supports email/password registration, login, token refresh, Google OAuth, and profile retrieval.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client

from app.dependencies import get_supabase_admin, get_current_user
from app.models.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshRequest,
    AuthResponse,
    AuthTokens,
    UserProfile,
    OAuthURLResponse,
    ProfileUpdateRequest,
)
from app.config import Settings, get_settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(
    body: RegisterRequest,
    supabase: Client = Depends(get_supabase_admin),
):
    """Register a new user with email, password, name, and role."""
    try:
        # Use admin.create_user to bypass email rate limits and auto-confirm
        # This is especially useful during hackathons/development when many test accounts are created
        admin_result = supabase.auth.admin.create_user({
            "email": body.email,
            "password": body.password,
            "email_confirm": True,
            "user_metadata": {
                "full_name": body.full_name,
                "role": body.role,
            }
        })

        if not admin_result.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration failed. User may already exist.",
            )

        user = admin_result.user

        # Since admin.create_user doesn't return a session, we sign in manually
        # to get the access and refresh tokens for the frontend
        login_result = supabase.auth.sign_in_with_password(
            {"email": body.email, "password": body.password}
        )
        session = login_result.session

        return AuthResponse(
            user=UserProfile(
                id=str(user.id),
                email=user.email or "",
                full_name=body.full_name,
                role=body.role,
                created_at=str(user.created_at) if user.created_at else None,
            ),
            tokens=AuthTokens(
                access_token=session.access_token if session else "",
                refresh_token=session.refresh_token if session else "",
                expires_in=session.expires_in if session else None,
            ),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}",
        )


@router.post("/login", response_model=AuthResponse)
async def login(
    body: LoginRequest,
    supabase: Client = Depends(get_supabase_admin),
):
    """Login with email and password."""
    try:
        result = supabase.auth.sign_in_with_password(
            {"email": body.email, "password": body.password}
        )

        if not result.user or not result.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

        user = result.user
        session = result.session

        # Try to fetch profile for role (may not exist)
        try:
            profile = (
                supabase.table("profiles")
                .select("full_name, role")
                .eq("id", str(user.id))
                .single()
                .execute()
            )
            profile_data = profile.data or {}
        except Exception:
            # Profile table doesn't exist or profile not found - use metadata
            profile_data = {}

        # Get full_name and role with metadata fallbacks
        full_name = profile_data.get("full_name") or ""
        if not full_name and user.user_metadata:
            full_name = user.user_metadata.get("full_name") or user.user_metadata.get("name", "")
        
        role = profile_data.get("role")
        if not role and user.user_metadata:
            role = user.user_metadata.get("role")
        role = role or "patient"

        return AuthResponse(
            user=UserProfile(
                id=str(user.id),
                email=user.email or "",
                full_name=full_name,
                role=role,
                created_at=str(user.created_at) if user.created_at else None,
            ),
            tokens=AuthTokens(
                access_token=session.access_token,
                refresh_token=session.refresh_token,
                expires_in=session.expires_in,
            ),
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Login failed: {str(e)}",
        )


@router.post("/refresh", response_model=AuthTokens)
async def refresh_token(
    body: RefreshRequest,
    supabase: Client = Depends(get_supabase_admin),
):
    """Refresh an expired access token."""
    try:
        result = supabase.auth.refresh_session(body.refresh_token)

        if not result.session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token.",
            )

        session = result.session
        return AuthTokens(
            access_token=session.access_token,
            refresh_token=session.refresh_token,
            expires_in=session.expires_in,
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token refresh failed: {str(e)}",
        )


@router.get("/oauth/google", response_model=OAuthURLResponse)
async def google_oauth(
    supabase: Client = Depends(get_supabase_admin),
    settings: Settings = Depends(get_settings),
):
    """Get the Google OAuth sign-in URL. Frontend should redirect to this URL."""
    try:
        result = supabase.auth.sign_in_with_oauth(
            {
                "provider": "google",
                "options": {
                    "redirect_to": f"{settings.cleaned_frontend_url}/auth/callback",
                },
            }
        )
        return OAuthURLResponse(url=result.url if result.url else "")

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OAuth URL generation failed: {str(e)}",
        )


@router.get("/me", response_model=UserProfile)
async def get_me(
    current_user=Depends(get_current_user),
    supabase: Client = Depends(get_supabase_admin),
):
    """Get the currently authenticated user's profile."""
    try:
        # Try to get profile from profiles table
        try:
            profile = (
                supabase.table("profiles")
                .select("full_name, role, specialization, clinic, created_at")
                .eq("id", str(current_user.id))
                .single()
                .execute()
            )
            data = profile.data or {}
        except Exception:
            # Profile table doesn't exist or profile not found
            # Fall back to user metadata from Supabase auth
            data = {}

        # Get full_name and role with metadata fallbacks
        full_name = data.get("full_name") or ""
        if not full_name and current_user.user_metadata:
            full_name = current_user.user_metadata.get("full_name") or current_user.user_metadata.get("name", "")
        
        role = data.get("role")
        if not role and current_user.user_metadata:
            role = current_user.user_metadata.get("role")
        role = role or "patient"

        return UserProfile(
            id=str(current_user.id),
            email=current_user.email or "",
            full_name=full_name,
            role=role,
            specialization=data.get("specialization") or current_user.user_metadata.get("specialization"),
            clinic=data.get("clinic") or current_user.user_metadata.get("clinic"),
            created_at=str(data.get("created_at", current_user.created_at or "")),
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch profile: {str(e)}",
        )


@router.patch("/me", response_model=UserProfile)
async def update_profile(
    body: ProfileUpdateRequest,
    current_user=Depends(get_current_user),
    supabase: Client = Depends(get_supabase_admin),
):
    """Update the currently authenticated user's profile metadata and record."""
    try:
        update_data = {}
        if body.full_name is not None:
            update_data["full_name"] = body.full_name
        if body.role is not None:
            update_data["role"] = body.role
        if body.specialization is not None:
            update_data["specialization"] = body.specialization
        if body.clinic is not None:
            update_data["clinic"] = body.clinic

        if not update_data:
            return await get_me(current_user, supabase)

        # Update Supabase Auth metadata
        supabase.auth.admin.update_user_by_id(
            str(current_user.id),
            {"user_metadata": update_data}
        )

        # Update profiles table if it exists
        try:
            supabase.table("profiles").upsert({
                "id": str(current_user.id),
                **update_data
            }).execute()
        except Exception:
            # Table might not exist in the simple setup
            pass

        return await get_me(current_user, supabase)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}",
        )
