from app.api.v1.endpoints.analyze import router as analyze_router
from app.api.v1.endpoints.health import router as health_router

__all__ = ["analyze_router", "health_router"]
