from typing import List, Optional, Tuple
from pydantic import BaseModel, Field


class PhonemeScoreSchema(BaseModel):
    phoneme: str = Field(..., description="Phoneme symbol (IPA or ARPAbet)")
    score: float = Field(..., ge=0.0, le=100.0, description="Pronunciation score for phoneme")
    error_type: Optional[str] = Field(None, description="Type of error: null, distortion, substitution, omission")


class WordScoreSchema(BaseModel):
    word: str = Field(..., description="Spoken word text")
    score: float = Field(..., ge=0.0, le=100.0, description="Word level pronunciation score")
    phonemes: List[PhonemeScoreSchema] = Field(default_factory=list, description="List of phonemes in word")


class PhonemeErrorSchema(BaseModel):
    phoneme: str = Field(..., description="Target or detected phoneme symbol")
    expected: str = Field(..., description="Expected target phoneme symbol")
    detected: str = Field(..., description="Actual detected phoneme symbol")
    error_type: str = Field(..., description="Error classification: substitution, deletion, insertion, distortion")
    word: str = Field(..., description="Associated word")
    position_ms: Tuple[float, float] = Field(..., description="[start_time_ms, end_time_ms] audio position")


class ExerciseRecommendationSchema(BaseModel):
    title: str = Field(..., description="Title of recommended practice exercise")
    category: str = Field(..., description="Category (e.g. Vowel Clarity, Consonant Articulation, Pace Control)")
    target_phoneme: str = Field(..., description="Target phoneme symbol")
    target_words: List[str] = Field(default_factory=list, description="Words for practice drills")
    instructions: str = Field(..., description="Step-by-step articulation guidance")


class AnalysisResponse(BaseModel):
    """Primary structured JSON output schema matching backend requirement."""

    overall_score: float = Field(..., ge=0.0, le=100.0, description="Overall articulation performance score")
    clarity: float = Field(..., ge=0.0, le=100.0, description="Speech clarity score")
    fluency: float = Field(..., ge=0.0, le=100.0, description="Speech fluency score")
    pronunciation: float = Field(..., ge=0.0, le=100.0, description="Phonetic accuracy pronunciation score")
    speech_rate: float = Field(..., description="Speaking rate in words per minute (WPM)")
    recognized_text: str = Field(..., description="Transcribed speech text")
    word_scores: List[WordScoreSchema] = Field(default_factory=list)
    phoneme_errors: List[PhonemeErrorSchema] = Field(default_factory=list)
    weak_phonemes: List[str] = Field(default_factory=list)
    feedback: List[str] = Field(default_factory=list)
    recommended_exercises: List[ExerciseRecommendationSchema] = Field(default_factory=list)

    model_config = {
        "json_schema_extra": {
            "example": {
                "overall_score": 88,
                "clarity": 91,
                "fluency": 84,
                "pronunciation": 86,
                "speech_rate": 122,
                "recognized_text": "The quick brown fox jumps over the lazy dog",
                "word_scores": [
                    {
                        "word": "quick",
                        "score": 90,
                        "phonemes": [
                            {"phoneme": "k", "score": 92, "error_type": None},
                            {"phoneme": "w", "score": 88, "error_type": None}
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
                    "Work on widening your mouth for the /æ/ sound in 'example'."
                ],
                "recommended_exercises": [
                    {
                        "title": "Short Vowel /æ/ Practice",
                        "category": "Vowel Clarity",
                        "target_phoneme": "æ",
                        "target_words": ["cat", "bat", "apple"],
                        "instructions": "Open mouth wide and lower your tongue..."
                    }
                ]
            }
        }
    }


class HealthCheckResponse(BaseModel):
    status: str = "ok"
    app_name: str
    version: str
    whisper_loaded: bool
    wav2vec2_loaded: bool
    device: str
