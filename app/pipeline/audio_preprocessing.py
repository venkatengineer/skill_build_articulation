from typing import List, Tuple
import numpy as np
import librosa

from app.config.settings import settings
from app.models.domain import AudioMetadata, SpeechSegment
from app.utils.audio_utils import load_audio, normalize_audio, resample_audio, compute_audio_duration
from app.utils.logger import get_logger

logger = get_logger(__name__)


class AudioPreprocessor:
    """Module 1: Preprocesses raw audio files, normalizes signal, applies VAD silence trimming."""

    def __init__(self, target_sr: int = settings.SAMPLE_RATE):
        self.target_sr = target_sr

    def process(self, audio_source: bytes | str | np.ndarray) -> Tuple[np.ndarray, AudioMetadata, List[SpeechSegment]]:
        """Preprocesses audio and returns (clean_audio_array, audio_metadata, speech_segments)."""
        logger.info("Starting audio preprocessing pipeline step...")

        if isinstance(audio_source, np.ndarray):
            audio = audio_source
            sr = self.target_sr
        else:
            audio, sr = load_audio(audio_source, target_sr=self.target_sr)

        if sr != self.target_sr:
            audio = resample_audio(audio, sr, self.target_sr)
            sr = self.target_sr

        # Peak normalization
        audio = normalize_audio(audio)

        # Detect Voice Activity
        speech_segments = self._detect_voice_activity(audio, sr)
        has_speech = len(speech_segments) > 0

        duration_sec = compute_audio_duration(audio, sr)
        metadata = AudioMetadata(
            duration_seconds=round(duration_sec, 3),
            sample_rate=sr,
            num_channels=1,
            num_samples=len(audio),
            has_speech=has_speech
        )

        logger.info(
            f"Audio preprocessing complete. Duration: {metadata.duration_seconds}s, "
            f"Speech segments detected: {len(speech_segments)}"
        )
        return audio, metadata, speech_segments

    def _detect_voice_activity(self, audio: np.ndarray, sr: int) -> List[SpeechSegment]:
        """Detects speech regions using energy-based top-dB thresholding and frame analysis."""
        segments: List[SpeechSegment] = []
        if len(audio) == 0:
            return segments

        # Energy-based non-silent interval detection via librosa
        intervals = librosa.effects.split(audio, top_db=25, frame_length=2048, hop_length=512)

        for start_idx, end_idx in intervals:
            start_ms = (start_idx / sr) * 1000.0
            end_ms = (end_idx / sr) * 1000.0
            duration_ms = end_ms - start_ms

            if duration_ms >= settings.MIN_SPEECH_DURATION_MS:
                segments.append(
                    SpeechSegment(
                        start_ms=round(start_ms, 2),
                        end_ms=round(end_ms, 2),
                        duration_ms=round(duration_ms, 2)
                    )
                )

        return segments
