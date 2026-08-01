from typing import List
from app.models.domain import PhonemeError, SpeechMetricsResult, WordScore
from app.schemas.response import (
    AnalysisResponse,
    ExerciseRecommendationSchema,
    PhonemeErrorSchema,
    PhonemeScoreSchema,
    WordScoreSchema,
)
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ResponseFormatter:
    """Module 9: Assembles all pipeline outputs into validated AnalysisResponse schema matching backend JSON contract."""

    def format(
        self,
        recognized_text: str,
        pronunciation_score: float,
        word_scores: List[WordScore],
        phoneme_errors: List[PhonemeError],
        weak_phonemes: List[str],
        metrics: SpeechMetricsResult,
        feedback: List[str],
        recommended_exercises: List[dict]
    ) -> AnalysisResponse:
        """Assembles data into final validated AnalysisResponse model."""
        logger.info("Formatting pipeline results into standard AnalysisResponse JSON payload...")

        # Calculate weighted overall score
        # 50% Pronunciation, 30% Clarity, 20% Fluency
        overall_score = (
            (pronunciation_score * 0.50) +
            (metrics.clarity_score * 0.30) +
            (metrics.fluency_score * 0.20)
        )
        overall_score = max(min(round(overall_score, 1), 100.0), 0.0)

        # Convert internal domain WordScore dataclasses to Pydantic schemas
        word_score_schemas: List[WordScoreSchema] = []
        for ws in word_scores:
            ph_schemas = [
                PhonemeScoreSchema(
                    phoneme=ps.phoneme,
                    score=ps.score,
                    error_type=ps.error_type
                )
                for ps in ws.phonemes
            ]
            word_score_schemas.append(
                WordScoreSchema(
                    word=ws.word,
                    score=ws.score,
                    phonemes=ph_schemas
                )
            )

        # Convert internal domain PhonemeError dataclasses to Pydantic schemas
        phoneme_error_schemas: List[PhonemeErrorSchema] = [
            PhonemeErrorSchema(
                phoneme=pe.phoneme,
                expected=pe.expected,
                detected=pe.detected,
                error_type=pe.error_type,
                word=pe.word,
                position_ms=pe.position_ms
            )
            for pe in phoneme_errors
        ]

        # Convert exercise dicts to Pydantic schemas
        exercise_schemas: List[ExerciseRecommendationSchema] = [
            ExerciseRecommendationSchema(
                title=ex["title"],
                category=ex["category"],
                target_phoneme=ex["target_phoneme"],
                target_words=ex.get("target_words", []),
                instructions=ex["instructions"]
            )
            for ex in recommended_exercises
        ]

        response = AnalysisResponse(
            overall_score=overall_score,
            clarity=metrics.clarity_score,
            fluency=metrics.fluency_score,
            pronunciation=pronunciation_score,
            speech_rate=metrics.speech_rate_wpm,
            recognized_text=recognized_text,
            word_scores=word_score_schemas,
            phoneme_errors=phoneme_error_schemas,
            weak_phonemes=weak_phonemes,
            feedback=feedback,
            recommended_exercises=exercise_schemas
        )

        logger.info("JSON response formatting successfully executed.")
        return response
