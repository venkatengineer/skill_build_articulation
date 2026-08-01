from typing import Optional
from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    """Pydantic model for JSON-based articulation analysis requests."""
    
    audio_base64: str = Field(
        ...,
        description="Base64-encoded audio data string (WAV, MP3, M4A, OGG, or WEBM)"
    )
    target_text: Optional[str] = Field(
        None,
        description="Target reference text/sentence that the user was expected to read"
    )
    exercise_type: Optional[str] = Field(
        "word",
        description="Type of exercise: 'word', 'sentence', 'paragraph', or 'free_speech'"
    )
    language: Optional[str] = Field(
        "en",
        description="Language code (e.g., 'en', 'es', 'fr')"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "audio_base64": "UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
                "target_text": "The quick brown fox jumps over the lazy dog",
                "exercise_type": "sentence",
                "language": "en"
            }
        }
    }
