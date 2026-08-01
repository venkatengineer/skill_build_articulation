from fastapi import APIRouter
from app.config.settings import settings
from app.models.ml_models import get_model_manager
from app.schemas.response import HealthCheckResponse

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthCheckResponse,
    summary="Check AI Service Health & Model Status",
    description="Returns current status of the service, loaded deep learning models, and system configuration."
)
async def get_health() -> HealthCheckResponse:
    model_mgr = get_model_manager()
    return HealthCheckResponse(
        status="ok",
        app_name=settings.APP_NAME,
        version=settings.APP_VERSION,
        whisper_loaded=model_mgr.is_whisper_loaded(),
        wav2vec2_loaded=model_mgr.is_wav2vec2_loaded(),
        device=settings.DEVICE
    )
