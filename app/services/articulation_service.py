from typing import Optional
import numpy as np

from app.pipeline.audio_preprocessing import AudioPreprocessor
from app.pipeline.exercise_generator import ExerciseGenerator
from app.pipeline.feedback_generator import FeedbackGenerator
from app.pipeline.forced_alignment import ForcedAligner
from app.pipeline.phoneme_analysis import PhonemeAnalyzer
from app.pipeline.pronunciation_scoring import PronunciationScorer
from app.pipeline.response_formatter import ResponseFormatter
from app.pipeline.speech_metrics import SpeechMetricsAnalyzer
from app.pipeline.speech_to_text import SpeechToTextEngine
from app.schemas.response import AnalysisResponse
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ArticulationAnalysisService:
    """Service Orchestrator: Executes complete speech analysis pipeline across all 9 modules."""

    def __init__(
        self,
        audio_preprocessor: Optional[AudioPreprocessor] = None,
        stt_engine: Optional[SpeechToTextEngine] = None,
        forced_aligner: Optional[ForcedAligner] = None,
        phoneme_analyzer: Optional[PhonemeAnalyzer] = None,
        pronunciation_scorer: Optional[PronunciationScorer] = None,
        speech_metrics_analyzer: Optional[SpeechMetricsAnalyzer] = None,
        feedback_generator: Optional[FeedbackGenerator] = None,
        exercise_generator: Optional[ExerciseGenerator] = None,
        response_formatter: Optional[ResponseFormatter] = None,
    ):
        # Dependency injection with defaults
        self.preprocessor = audio_preprocessor or AudioPreprocessor()
        self.stt_engine = stt_engine or SpeechToTextEngine()
        self.forced_aligner = forced_aligner or ForcedAligner()
        self.phoneme_analyzer = phoneme_analyzer or PhonemeAnalyzer()
        self.pronunciation_scorer = pronunciation_scorer or PronunciationScorer()
        self.speech_metrics_analyzer = speech_metrics_analyzer or SpeechMetricsAnalyzer()
        self.feedback_generator = feedback_generator or FeedbackGenerator()
        self.exercise_generator = exercise_generator or ExerciseGenerator()
        self.response_formatter = response_formatter or ResponseFormatter()

    def analyze_audio(
        self,
        audio_source: bytes | str | np.ndarray,
        target_text: Optional[str] = None
    ) -> AnalysisResponse:
        """Executes the complete end-to-end AI articulation analysis pipeline."""
        logger.info("Starting complete speech articulation analysis pipeline...")

        # Step 1: Audio Preprocessing & VAD
        audio, metadata, speech_segments = self.preprocessor.process(audio_source)

        # Step 2: Speech to Text Conversion
        recognized_text, recognized_words = self.stt_engine.transcribe(audio, target_text)

        # Step 3: Forced Alignment
        ref_text = target_text if target_text else recognized_text
        aligned_pairs = self.forced_aligner.align(recognized_words, ref_text)

        # Step 4: Phoneme Analysis & Error Detection
        phoneme_errors, weak_phonemes = self.phoneme_analyzer.analyze_phoneme_errors(aligned_pairs)

        # Step 5: Pronunciation & GOP Scoring
        pronunciation_score, word_scores = self.pronunciation_scorer.calculate_scores(
            aligned_pairs, phoneme_errors
        )

        # Step 6: Speech Metrics (Pitch, Pace, Pauses, Clarity, Fluency)
        word_count = len(aligned_pairs)
        metrics = self.speech_metrics_analyzer.analyze(
            audio, metadata, speech_segments, word_count
        )

        # Step 7: Feedback Generation
        feedback = self.feedback_generator.generate(
            phoneme_errors, weak_phonemes, metrics, pronunciation_score
        )

        # Step 8: Exercise Recommendation
        recommended_exercises = self.exercise_generator.generate(
            weak_phonemes, metrics.speech_rate_wpm
        )

        # Step 9: Response Assembly & Formatting
        response = self.response_formatter.format(
            recognized_text=recognized_text,
            pronunciation_score=pronunciation_score,
            word_scores=word_scores,
            phoneme_errors=phoneme_errors,
            weak_phonemes=weak_phonemes,
            metrics=metrics,
            feedback=feedback,
            recommended_exercises=recommended_exercises
        )

        logger.info("Articulation analysis pipeline completed successfully.")
        return response
