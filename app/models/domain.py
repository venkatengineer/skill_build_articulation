from dataclasses import dataclass, field
from typing import List, Optional, Tuple
import numpy as np


@dataclass
class AudioMetadata:
    duration_seconds: float
    sample_rate: int
    num_channels: int
    num_samples: int
    has_speech: bool = True


@dataclass
class SpeechSegment:
    start_ms: float
    end_ms: float
    duration_ms: float


@dataclass
class RecognizedWord:
    word: str
    start_ms: float
    end_ms: float
    confidence: float
    phonemes: List[str] = field(default_factory=list)


@dataclass
class PhonemeScore:
    phoneme: str
    score: float
    error_type: Optional[str] = None  # None, "distortion", "substitution", "omission"


@dataclass
class PhonemeError:
    phoneme: str
    expected: str
    detected: str
    error_type: str  # "substitution", "deletion", "insertion", "distortion"
    word: str
    position_ms: Tuple[float, float]


@dataclass
class WordScore:
    word: str
    score: float
    phonemes: List[PhonemeScore] = field(default_factory=list)


@dataclass
class SpeechMetricsResult:
    speech_rate_wpm: float
    total_pauses: int
    total_pause_duration_ms: float
    mean_pitch_hz: float
    pitch_std_hz: float
    clarity_score: float
    fluency_score: float


@dataclass
class PipelineResult:
    audio_metadata: AudioMetadata
    recognized_text: str
    overall_score: float
    clarity_score: float
    fluency_score: float
    pronunciation_score: float
    speech_rate_wpm: float
    word_scores: List[WordScore]
    phoneme_errors: List[PhonemeError]
    weak_phonemes: List[str]
    feedback: List[str]
    recommended_exercises: List[dict]
