import numpy as np
from app.pipeline.speech_to_text import SpeechToTextEngine


def test_speech_to_text_transcription(sample_audio_array: np.ndarray):
    stt = SpeechToTextEngine()
    target = "The quick brown fox jumps over the lazy dog"
    recognized_text, words = stt.transcribe(sample_audio_array, target_text=target)

    assert isinstance(recognized_text, str)
    assert len(words) > 0
    assert words[0].word is not None
    assert words[0].start_ms >= 0.0
    assert words[0].end_ms > words[0].start_ms
