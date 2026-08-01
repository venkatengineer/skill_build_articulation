from typing import List
from app.models.domain import PhonemeError, SpeechMetricsResult
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Phonetic articulation advice mappings
PHONEME_ADVICE = {
    "æ": "For the short vowel /æ/ as in 'cat', lower your jaw slightly wider and relax your tongue flat.",
    "θ": "For the voiceless 'th' sound /θ/ as in 'think', gently touch your top teeth with the tip of your tongue.",
    "ð": "For the voiced 'th' sound /ð/ as in 'the', place tongue tip between front teeth and vibrate vocal cords.",
    "ɹ": "For the /r/ sound, curl your tongue tip back towards the roof of your mouth without touching it.",
    "l": "For the /l/ sound, press the tip of your tongue firmly against the alveolar ridge behind top teeth.",
    "s": "For the /s/ sound, keep your teeth close together and blow a steady stream of air over the tongue tip.",
    "z": "For the /z/ sound, maintain the /s/ position while engaging your voice box.",
    "ʃ": "For the 'sh' sound /ʃ/, round your lips slightly and raise the middle of your tongue.",
}


class FeedbackGenerator:
    """Module 7: Generates personalized articulation feedback based on speech analysis results."""

    def generate(
        self,
        phoneme_errors: List[PhonemeError],
        weak_phonemes: List[str],
        metrics: SpeechMetricsResult,
        pronunciation_score: float
    ) -> List[str]:
        """Generates list of human-readable, constructive feedback instructions."""
        logger.info("Generating personalized articulation feedback...")
        feedback: List[str] = []

        # 1. Phoneme Specific Articulation Advice
        for ph in weak_phonemes[:3]:
            if ph in PHONEME_ADVICE:
                feedback.append(PHONEME_ADVICE[ph])

        if not feedback and phoneme_errors:
            err = phoneme_errors[0]
            feedback.append(
                f"Work on pronouncing '{err.word}'. Notice the sound /{err.expected}/ which was read as /{err.detected}/."
            )

        # 2. Speaking Rate / Pace Feedback
        if metrics.speech_rate_wpm < 100.0:
            feedback.append(
                f"Your speaking rate was {metrics.speech_rate_wpm} WPM. Try speaking slightly faster to build natural flow."
            )
        elif metrics.speech_rate_wpm > 170.0:
            feedback.append(
                f"Your speaking rate was {metrics.speech_rate_wpm} WPM. Slowing down slightly will improve consonant clarity."
            )

        # 3. Pauses & Fluency Feedback
        if metrics.total_pauses > 3 and metrics.fluency_score < 80.0:
            feedback.append(
                "You had several noticeable pauses between words. Practicing phrase grouping will improve your overall fluency."
            )

        # 4. General Encouragement / High Score Feedback
        if pronunciation_score >= 90.0 and len(feedback) < 2:
            feedback.append("Excellent articulation! Your speech clarity and phoneme precision are very strong.")
        elif not feedback:
            feedback.append("Good effort! Focus on maintaining steady pacing and clear vowel sounds.")

        logger.info(f"Generated {len(feedback)} feedback items.")
        return feedback
