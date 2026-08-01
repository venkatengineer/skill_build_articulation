from typing import List, Tuple
import numpy as np
import librosa

from app.config.settings import settings
from app.models.domain import AudioMetadata, SpeechMetricsResult, SpeechSegment
from app.utils.logger import get_logger

logger = get_logger(__name__)


class SpeechMetricsAnalyzer:
    """Module 6: Analyzes speech rate, pause duration/count, pitch F0 stability, clarity & fluency scores."""

    def analyze(
        self,
        audio: np.ndarray,
        metadata: AudioMetadata,
        speech_segments: List[SpeechSegment],
        word_count: int
    ) -> SpeechMetricsResult:
        """Computes pitch metrics, speaking pace (WPM), pauses, clarity, and fluency scores."""
        logger.info("Computing speech metrics (pitch, pace, pauses, clarity, fluency)...")

        total_audio_ms = metadata.duration_seconds * 1000.0
        speech_duration_ms = sum(seg.duration_ms for seg in speech_segments) if speech_segments else total_audio_ms
        pause_duration_ms = max(total_audio_ms - speech_duration_ms, 0.0)

        # Pause count calculation (gaps between speech segments)
        total_pauses = max(len(speech_segments) - 1, 0)
        if len(speech_segments) == 0 and total_audio_ms > settings.MIN_PAUSE_DURATION_MS:
            total_pauses = 1

        # Calculate Speaking Rate (WPM excluding pause time)
        speech_duration_min = max(speech_duration_ms / 60000.0, 0.001)
        speech_rate_wpm = round(word_count / speech_duration_min, 1)

        # Pitch (F0) Extraction via Librosa Pyin / Praat Parselmouth
        mean_pitch, pitch_std = self._extract_pitch(audio, metadata.sample_rate)

        # Fluency Score Calculation
        fluency_score = self._compute_fluency_score(
            speech_rate_wpm=speech_rate_wpm,
            pause_duration_ms=pause_duration_ms,
            total_pauses=total_pauses,
            total_duration_ms=total_audio_ms
        )

        # Clarity Score Calculation based on spectral clarity and pitch stability
        clarity_score = self._compute_clarity_score(audio, metadata.sample_rate, pitch_std)

        metrics = SpeechMetricsResult(
            speech_rate_wpm=speech_rate_wpm,
            total_pauses=total_pauses,
            total_pause_duration_ms=round(pause_duration_ms, 2),
            mean_pitch_hz=round(mean_pitch, 1),
            pitch_std_hz=round(pitch_std, 1),
            clarity_score=round(clarity_score, 1),
            fluency_score=round(fluency_score, 1)
        )

        logger.info(
            f"Speech metrics complete: WPM={metrics.speech_rate_wpm}, "
            f"Pauses={metrics.total_pauses}, Fluency={metrics.fluency_score}, Clarity={metrics.clarity_score}"
        )
        return metrics

    def _extract_pitch(self, audio: np.ndarray, sr: int) -> Tuple[float, float]:
        """Extracts pitch F0 mean and standard deviation."""
        try:
            # Use Librosa pyin for fundamental frequency estimation
            f0, _, _ = librosa.pyin(
                audio,
                fmin=librosa.note_to_hz("C2"),
                fmax=librosa.note_to_hz("C6"),
                sr=sr
            )
            valid_f0 = f0[~np.isnan(f0)]
            if len(valid_f0) > 0:
                return float(np.mean(valid_f0)), float(np.std(valid_f0))
        except Exception as e:
            logger.warning(f"Pitch extraction fallback: {e}")
            
        return 160.0, 25.0

    def _compute_fluency_score(
        self,
        speech_rate_wpm: float,
        pause_duration_ms: float,
        total_pauses: int,
        total_duration_ms: float
    ) -> float:
        """Calculates 0-100 fluency score penalizing hesitation, excessive pauses, and abnormal WPM."""
        score = 100.0

        # WPM penalty
        if speech_rate_wpm < settings.TARGET_SPEECH_RATE_WPM_MIN:
            deficit = settings.TARGET_SPEECH_RATE_WPM_MIN - speech_rate_wpm
            score -= min(deficit * 0.4, 30.0)
        elif speech_rate_wpm > settings.TARGET_SPEECH_RATE_WPM_MAX:
            excess = speech_rate_wpm - settings.TARGET_SPEECH_RATE_WPM_MAX
            score -= min(excess * 0.3, 25.0)

        # Pause duration penalty
        if total_duration_ms > 0:
            pause_ratio = pause_duration_ms / total_duration_ms
            if pause_ratio > 0.35:
                score -= (pause_ratio - 0.35) * 50.0

        return max(round(score, 1), 0.0)

    def _compute_clarity_score(self, audio: np.ndarray, sr: int, pitch_std: float) -> float:
        """Calculates 0-100 clarity score using spectral centroid and pitch variance."""
        score = 85.0
        try:
            if len(audio) > 0:
                cent = librosa.feature.spectral_centroid(y=audio, sr=sr)
                mean_cent = float(np.mean(cent))
                # Higher spectral centroid indicates clearer articulate consonants
                if mean_cent > 1500:
                    score += 5.0
                elif mean_cent < 800:
                    score -= 10.0
        except Exception as e:
            logger.warning(f"Clarity spectral calculation warning: {e}")

        # Penalty for monotone / robotic speech
        if pitch_std < 5.0:
            score -= 8.0

        return max(min(round(score, 1), 100.0), 0.0)
