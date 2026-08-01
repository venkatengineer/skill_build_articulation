import os
from typing import Any, Optional
from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ModelManager:
    """Singleton manager for ML deep learning model loading and lifecycle management."""

    _instance: Optional["ModelManager"] = None
    _whisper_model: Any = None
    _wav2vec_model: Any = None
    _wav2vec_processor: Any = None

    def __new__(cls) -> "ModelManager":
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
        return cls._instance

    def load_whisper(self) -> Any:
        """Lazy loader for Whisper STT model."""
        if self._whisper_model is not None:
            return self._whisper_model

        try:
            import whisper
            logger.info(f"Loading Whisper model '{settings.WHISPER_MODEL_SIZE}' on {settings.DEVICE}...")
            self._whisper_model = whisper.load_model(
                settings.WHISPER_MODEL_SIZE,
                device=settings.DEVICE,
                download_root=settings.MODEL_CACHE_DIR
            )
            logger.info("Whisper model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load official whisper package: {e}. Fallback mode active.")
            self._whisper_model = None

        return self._whisper_model

    def load_wav2vec2(self) -> Any:
        """Lazy loader for Wav2Vec2 phoneme recognition model."""
        if self._wav2vec_model is not None:
            return self._wav2vec_model, self._wav2vec_processor

        try:
            from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
            logger.info(f"Loading Wav2Vec2 model '{settings.WAV2VEC2_MODEL_ID}'...")
            self._wav2vec_processor = Wav2Vec2Processor.from_pretrained(
                settings.WAV2VEC2_MODEL_ID,
                cache_dir=settings.MODEL_CACHE_DIR
            )
            self._wav2vec_model = Wav2Vec2ForCTC.from_pretrained(
                settings.WAV2VEC2_MODEL_ID,
                cache_dir=settings.MODEL_CACHE_DIR
            ).to(settings.DEVICE)
            logger.info("Wav2Vec2 model loaded successfully.")
        except Exception as e:
            logger.warning(f"Could not load Wav2Vec2 model: {e}. Fallback phoneme analyzer will be used.")
            self._wav2vec_model = None
            self._wav2vec_processor = None

        return self._wav2vec_model, self._wav2vec_processor

    def is_whisper_loaded(self) -> bool:
        return self._whisper_model is not None

    def is_wav2vec2_loaded(self) -> bool:
        return self._wav2vec_model is not None


def get_model_manager() -> ModelManager:
    return ModelManager()
