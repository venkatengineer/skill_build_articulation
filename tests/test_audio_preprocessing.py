import numpy as np
from app.pipeline.audio_preprocessing import AudioPreprocessor


def test_audio_preprocessor(sample_wav_bytes: bytes):
    preprocessor = AudioPreprocessor(target_sr=16000)
    audio, metadata, segments = preprocessor.process(sample_wav_bytes)

    assert isinstance(audio, np.ndarray)
    assert audio.ndim == 1
    assert metadata.sample_rate == 16000
    assert metadata.duration_seconds > 0.0
    assert isinstance(segments, list)
