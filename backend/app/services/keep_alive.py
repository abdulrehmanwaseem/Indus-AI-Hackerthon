import asyncio
import httpx
import logging
from app.config import get_settings

logger = logging.getLogger(__name__)

async def start_keep_alive():
    """
    Periodically pings the health route of this server to prevent Render from sleeping.
    Render free tier sleeps after 15 minutes of inactivity. We ping every 9 minutes.
    """
    settings = get_settings()
    url = settings.RENDER_EXTERNAL_URL
    
    if not url or "localhost" in url:
        logger.info("Keep-alive service skipped (no RENDER_EXTERNAL_URL or running on localhost).")
        return

    health_url = f"{url.strip().rstrip('/')}/api/health"
    logger.info(f"Keep-alive service starting. Target: {health_url} (every 9 mins)")

    # Initial delay to let the server start up
    await asyncio.sleep(60)

    while True:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(health_url)
                if response.status_code == 200:
                    logger.info(f"Self-ping OK ({response.status_code})")
                else:
                    logger.warning(f"Self-ping failed ({response.status_code})")
        except Exception as e:
            logger.error(f"Keep-alive ping error: {str(e)}")
        
        # Wait 9 minutes before next ping
        await asyncio.sleep(9 * 60)
