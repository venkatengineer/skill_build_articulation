import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "app_name" in data


def test_analyze_endpoint(sample_wav_bytes: bytes):
    files = {
        "file": ("test_recording.wav", io.BytesIO(sample_wav_bytes), "audio/wav")
    }
    data = {
        "target_text": "The quick brown fox jumps over the lazy dog",
        "exercise_type": "sentence",
        "language": "en"
    }
    response = client.post("/api/v1/analyze", files=files, data=data)
    assert response.status_code == 200
    res_data = response.json()

    assert "overall_score" in res_data
    assert "clarity" in res_data
    assert "fluency" in res_data
    assert "pronunciation" in res_data
    assert "speech_rate" in res_data
    assert "recognized_text" in res_data
    assert "word_scores" in res_data
    assert "phoneme_errors" in res_data
    assert "weak_phonemes" in res_data
    assert "feedback" in res_data
    assert "recommended_exercises" in res_data
