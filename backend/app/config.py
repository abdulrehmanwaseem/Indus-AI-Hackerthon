from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── Supabase ──
    SUPABASE_URL: str
    SUPABASE_KEY: str  # anon / public key
    SUPABASE_SERVICE_ROLE_KEY: str

    # ── Google Gemini ──
    GEMINI_API_KEY: str

    # ── CORS ──
    FRONTEND_URL: str = "http://localhost:5173"

    # ── App ──
    APP_NAME: str = "Tandarust AI"
    DEBUG: bool = False

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }

    @property
    def cleaned_frontend_url(self) -> str:
        """Strips whitespace and trailing slashes from the frontend URL."""
        return self.FRONTEND_URL.strip().rstrip("/")


@lru_cache()
def get_settings() -> Settings:
    return Settings()
