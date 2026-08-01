import io
import os
import tempfile
from typing import Tuple, Union
import numpy as np
import soundfile as sf
import librosa

from app.config.settings import settings
from app.utils.logger import get_logger

logger = get_logger(__name__)


def load_audio(
    source: Union[str, bytes, io.BytesIO],
    target_sr: int = settings.SAMPLE_RATE
) -> Tuple[np.ndarray, int]:
    """Loads an audio file from bytes or file path into a float32 1D numpy array (mono).
    
    Resamples to target_sr if necessary.
    """
    try:
        if isinstance(source, bytes):
            source = io.BytesIO(source)
            
        if isinstance(source, io.BytesIO):
            audio_data, sr = sf.read(source, dtype="float32")
        elif isinstance(source, str):
            audio_data, sr = sf.read(source, dtype="float32")
        else:
            raise ValueError("Unsupported audio source type.")
            
        # Convert multi-channel (stereo) to mono
        if audio_data.ndim > 1:
            audio_data = np.mean(audio_data, axis=1)
            
        # Resample if sample rate doesn't match target
        if sr != target_sr:
            audio_data = librosa.resample(audio_data, orig_sr=sr, target_sr=target_sr)
            sr = target_sr
            
        return audio_data.astype(np.float32), sr
    except Exception as e:
        logger.error(f"Error loading audio: {str(e)}")
        # If soundfile fails (e.g. format issue), try librosa fallback
        if isinstance(source, str) and os.path.exists(source):
            y, sr = librosa.load(source, sr=target_sr, mono=True)
            return y.astype(np.float32), sr
        raise RuntimeError(f"Failed to process input audio: {str(e)}") from e


def normalize_audio(audio: np.ndarray) -> np.ndarray:
    """Peak normalizes audio array to maximum absolute amplitude of 0.95."""
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        return (audio / max_val) * 0.95
    return audio


def resample_audio(audio: np.ndarray, orig_sr: int, target_sr: int) -> np.ndarray:
    """Resamples audio from orig_sr to target_sr."""
    if orig_sr == target_sr:
        return audio
    return librosa.resample(audio, orig_sr=orig_sr, target_sr=target_sr)


def save_temp_audio(audio: np.ndarray, sr: int = settings.SAMPLE_RATE) -> str:
    """Saves numpy audio array to a temporary WAV file and returns absolute path."""
    temp_file = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    temp_path = temp_file.name
    temp_file.close()
    sf.write(temp_path, audio, sr, format="WAV", subtype="PCM_16")
    return temp_path


def compute_audio_duration(audio: np.ndarray, sr: int = settings.SAMPLE_RATE) -> float:
    """Returns duration of audio array in seconds."""
    if sr <= 0:
        return 0.0
    return len(audio) / float(sr)
