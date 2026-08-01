import base64
from typing import Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.schemas.request import AnalysisRequest
from app.schemas.response import AnalysisResponse
from app.services.articulation_service import ArticulationAnalysisService
from app.utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter()
service = ArticulationAnalysisService()


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Spoken Audio (Multipart Form)",
    description="Receives binary audio file upload from the backend and returns complete articulation analysis JSON."
)
async def analyze_audio_file(
    file: UploadFile = File(..., description="Audio recording file (WAV, MP3, M4A, WEBM, OGG)"),
    target_text: Optional[str] = Form(None, description="Optional target reference sentence/phrase"),
    exercise_type: Optional[str] = Form("sentence", description="Exercise type: word, sentence, paragraph, free_speech"),
    language: Optional[str] = Form("en", description="Language code")
) -> AnalysisResponse:
    """REST endpoint for multipart file audio analysis."""
    logger.info(f"Received audio analysis request. File: '{file.filename}', Target: '{target_text}'")

    if not file.content_type and not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid audio file uploaded."
        )

    try:
        audio_bytes = await file.read()
        if len(audio_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded audio file is empty."
            )

        response = service.analyze_audio(audio_bytes, target_text=target_text)
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Internal error processing audio request: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process speech analysis: {str(e)}"
        )


@router.post(
    "/analyze-json",
    response_model=AnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Spoken Audio (Base64 JSON Payload)",
    description="Receives base64-encoded audio payload in JSON from the backend and returns articulation analysis JSON."
)
async def analyze_audio_json(request: AnalysisRequest) -> AnalysisResponse:
    """REST endpoint for JSON payload with base64 audio string."""
    logger.info("Received base64 audio analysis request.")

    try:
        try:
            audio_bytes = base64.b64decode(request.audio_base64)
        except Exception as b64_err:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid base64 encoding: {str(b64_err)}"
            )

        if len(audio_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Decoded audio byte payload is empty."
            )

        response = service.analyze_audio(audio_bytes, target_text=request.target_text)
        return response
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Internal error processing JSON audio request: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process speech analysis: {str(e)}"
        )
