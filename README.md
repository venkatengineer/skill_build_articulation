# AI Smart Articulation Training System - AI Service

An independent, production-grade microservice for real-time speech articulation analysis, pronunciation scoring, fluency measurement, phoneme error detection, and personalized practice recommendations.

---

## Architectural Overview

The AI Service operates as a fully independent REST microservice built with **Python 3.12+**, **FastAPI**, **PyTorch**, **Whisper**, **Librosa**, **Praat Parselmouth**, and **Pydantic**.

It accepts speech audio recordings from the Backend API, executes a 9-stage analysis pipeline, and returns structured JSON responses matching the system contract.

```
Input Audio -> Preprocessing -> STT (Whisper) -> Forced Alignment -> Phoneme Analysis
  -> Pronunciation Scoring -> Speech Metrics -> Feedback -> Exercises -> JSON Response
```

---

## Folder Structure

```
ai-service/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   └── endpoints/
│   │   │       ├── analyze.py        # REST endpoints: /api/v1/analyze & /api/v1/analyze-json
│   │   │       └── health.py         # Service health & status check
│   │   └── router.py                 # Central API routing
│   ├── config/
│   │   └── settings.py               # Application configuration via environment variables
│   ├── models/
│   │   ├── domain.py                 # Core internal dataclasses & domain models
│   │   └── ml_models.py              # ML deep learning model lazy loader (Whisper, Wav2Vec2)
│   ├── pipeline/
│   │   ├── audio_preprocessing.py    # Preprocessing, normalization, VAD silence trimming
│   │   ├── speech_to_text.py         # Speech-to-Text transcribing & timestamp generation
│   │   ├── forced_alignment.py       # Sequence forced alignment (DTW / Levenshtein)
│   │   ├── phoneme_analysis.py       # G2P, acoustic feature comparison & error detection
│   │   ├── pronunciation_scoring.py  # GOP (Goodness of Pronunciation) & word scoring
│   │   ├── speech_metrics.py         # Pitch (F0), tempo (WPM), pauses, clarity & fluency
│   │   ├── feedback_generator.py     # Rule-based personalized feedback generator
│   │   ├── exercise_generator.py     # Targeted practice drill recommendations
│   │   └── response_formatter.py     # Schema formatting matching JSON response contract
│   ├── schemas/
│   │   ├── request.py                # Input Pydantic request models
│   │   └── response.py               # Output Pydantic response models
│   ├── services/
│   │   └── articulation_service.py   # Main pipeline service orchestrator
│   ├── utils/
│   │   ├── audio_utils.py            # Audio file loading, resampling, peak normalization
│   │   └── logger.py                 # Structured logging setup
│   └── main.py                       # FastAPI application entrypoint
├── tests/                            # Pytest automated test suite
├── .env.example                      # Configuration template
├── requirements.txt                  # Python dependencies
└── README.md                         # Service documentation
```

---

## Installation & Setup

### Prerequisites
- Python 3.12 or later
- Virtual environment tool (`venv` or `conda`)

### Installation Steps

1. Navigate to the `ai-service` directory:
   ```bash
   cd ai-service
   ```

2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows (PowerShell):
   .\venv\Scripts\Activate.ps1
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` (optional):
   ```bash
   cp .env.example .env
   ```

---

## Running the Service

Start the FastAPI development server:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Access Interactive OpenAPI Swagger Documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## API Endpoints

### 1. Health Check
`GET /api/v1/health`

Returns operational health status, loaded ML model status, and device allocation.

### 2. Analyze Audio (Multipart File Upload)
`POST /api/v1/analyze`

**Form Parameters:**
- `file`: Audio file upload (WAV, MP3, M4A, WEBM, OGG)
- `target_text`: (Optional) Target sentence/phrase expected to be read
- `exercise_type`: (Optional) Exercise type (`word`, `sentence`, `paragraph`, `free_speech`)
- `language`: (Optional) Language code (default: `en`)

### 3. Analyze Audio (Base64 JSON)
`POST /api/v1/analyze-json`

**JSON Request Body:**
```json
{
  "audio_base64": "<base64_encoded_audio_string>",
  "target_text": "The quick brown fox jumps over the lazy dog",
  "exercise_type": "sentence",
  "language": "en"
}
```

### JSON Response Format
```json
{
  "overall_score": 88.0,
  "clarity": 91.0,
  "fluency": 84.0,
  "pronunciation": 86.0,
  "speech_rate": 122.0,
  "recognized_text": "The quick brown fox jumps over the lazy dog",
  "word_scores": [
    {
      "word": "quick",
      "score": 90.0,
      "phonemes": [
        { "phoneme": "k", "score": 92.0, "error_type": null },
        { "phoneme": "w", "score": 88.0, "error_type": null }
      ]
    }
  ],
  "phoneme_errors": [
    {
      "phoneme": "æ",
      "expected": "æ",
      "detected": "ɛ",
      "error_type": "substitution",
      "word": "example",
      "position_ms": [120.0, 240.0]
    }
  ],
  "weak_phonemes": ["æ", "θ"],
  "feedback": [
    "For the short vowel /æ/ as in 'cat', lower your jaw slightly wider and relax your tongue flat."
  ],
  "recommended_exercises": [
    {
      "title": "Short Vowel /æ/ Clarity Drill",
      "category": "Vowel Clarity",
      "target_phoneme": "æ",
      "target_words": ["cat", "bat", "apple", "flat", "example"],
      "instructions": "Practice saying each word slowly. Focus on opening your mouth wide and lowering your jaw."
    }
  ]
}
```

---

## Testing

Run the automated test suite with pytest:
```bash
pytest tests/ -v
```
