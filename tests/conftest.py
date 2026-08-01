import io
import wave
import numpy as np
import pytest
from app.config.settings import settings


@pytest.fixture
def sample_audio_array() -> np.ndarray:
    """Generates 2 seconds of 16kHz mono synthetic audio signal."""
    sr = settings.SAMPLE_RATE
    duration = 2.0
    t = np.linspace(0, duration, int(sr * duration), False)
    # Generate 440 Hz tone with pitch variation
    signal = 0.5 * np.sin(2 * np.pi * 440 * t) + 0.2 * np.sin(2 * np.pi * 880 * t)
    return signal.astype(np.float32)


@pytest.fixture
def sample_wav_bytes(sample_audio_array: np.ndarray) -> bytes:
    """Encodes synthetic audio array into WAV binary bytes."""
    sr = settings.SAMPLE_RATE
    audio_int16 = (sample_audio_array * 32767).astype(np.int16)
    
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(audio_int16.tobytes())
    return buffer.getvalue()
