import os
from typing import Literal
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """System-wide configuration settings for the AI Service."""
    
    APP_NAME: str = "AI Smart Articulation Training System - AI Service"
    APP_VERSION: str = "1.0.0"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Audio Settings
    SAMPLE_RATE: int = 16000
    CHANNELS: int = 1
    MAX_AUDIO_DURATION_SECONDS: int = 120
    
    # ML Model Settings
    WHISPER_MODEL_SIZE: str = "base"  # tiny, base, small, medium, large-v3
    WAV2VEC2_MODEL_ID: str = "facebook/wav2vec2-ljspeech-gruut"
    DEVICE: str = "cpu"  # cpu, cuda, mps
    MODEL_CACHE_DIR: str = "./model_cache"
    USE_FALLBACK_MODELS: bool = True  # Allows running tests without downloading large models
    
    # Speech Metrics Thresholds
    TARGET_SPEECH_RATE_WPM_MIN: float = 110.0
    TARGET_SPEECH_RATE_WPM_MAX: float = 160.0
    MIN_PAUSE_DURATION_MS: float = 250.0
    LONG_PAUSE_THRESHOLD_MS: float = 1000.0
    
    # Logging
    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
