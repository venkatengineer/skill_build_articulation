import numpy as np
from app.models.domain import AudioMetadata, SpeechSegment
from app.pipeline.speech_metrics import SpeechMetricsAnalyzer


def test_speech_metrics_analyzer(sample_audio_array: np.ndarray):
    analyzer = SpeechMetricsAnalyzer()
    metadata = AudioMetadata(
        duration_seconds=2.0,
        sample_rate=16000,
        num_channels=1,
        num_samples=len(sample_audio_array),
        has_speech=True
    )
    segments = [SpeechSegment(start_ms=0.0, end_ms=1800.0, duration_ms=1800.0)]
    
    result = analyzer.analyze(sample_audio_array, metadata, segments, word_count=5)

    assert result.speech_rate_wpm > 0.0
    assert 0.0 <= result.clarity_score <= 100.0
    assert 0.0 <= result.fluency_score <= 100.0
    assert result.mean_pitch_hz > 0.0
