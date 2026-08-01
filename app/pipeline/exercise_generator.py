from typing import List
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Repository of targeted articulation drill exercises indexed by phoneme
EXERCISE_CATALOG = {
    "æ": {
        "title": "Short Vowel /æ/ Clarity Drill",
        "category": "Vowel Clarity",
        "target_words": ["cat", "bat", "apple", "flat", "example", "shadow"],
        "instructions": "Practice saying each word slowly. Focus on opening your mouth wide and lowering your jaw."
    },
    "θ": {
        "title": "Voiceless /θ/ Tongue Placement",
        "category": "Consonant Precision",
        "target_words": ["think", "thank", "math", "breath", "path", "thought"],
        "instructions": "Place your tongue gently between your front teeth. Exhale lightly as you form the sound."
    },
    "ð": {
        "title": "Voiced /ð/ Vibration Drill",
        "category": "Consonant Precision",
        "target_words": ["the", "this", "that", "brother", "feather", "smooth"],
        "instructions": "Touch top teeth with your tongue tip and vibrate your vocal cords while saying each word."
    },
    "ɹ": {
        "title": "/r/ Rhotic Control Practice",
        "category": "Rhotic Articulation",
        "target_words": ["red", "run", "brown", "bright", "carry", "arrow"],
        "instructions": "Curl your tongue back toward the roof of your mouth without touching it. Maintain airflow."
    },
    "l": {
        "title": "Lateral /l/ Tongue Ridge Contact",
        "category": "Consonant Precision",
        "target_words": ["light", "play", "clear", "yellow", "bell", "apple"],
        "instructions": "Press the tip of your tongue against the upper gum ridge behind your teeth."
    },
    "s": {
        "title": "Sibilant /s/ Airflow Control",
        "category": "Sibilant Articulation",
        "target_words": ["sun", "speak", "speech", "fast", "class", "stop"],
        "instructions": "Bring teeth close together and direct a steady, narrow stream of air over the tongue."
    }
}

DEFAULT_EXERCISE = {
    "title": "General Articulation & Pace Warmup",
    "category": "Fluency & Pace",
    "target_phoneme": "all",
    "target_words": ["The", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"],
    "instructions": "Read the pangram aloud at a comfortable pace, emphasizing clear consonant endings."
}


class ExerciseGenerator:
    """Module 8: Generates targeted articulation drill exercises based on detected user weak points."""

    def generate(self, weak_phonemes: List[str], speech_rate_wpm: float) -> List[dict]:
        """Generates list of exercise dictionaries customized for the user's weaknesses."""
        logger.info("Generating recommended practice exercises...")
        recommended: List[dict] = []

        for ph in weak_phonemes:
            if ph in EXERCISE_CATALOG:
                ex = EXERCISE_CATALOG[ph].copy()
                ex["target_phoneme"] = ph
                recommended.append(ex)

        # Pace exercise if speech rate is outside ideal bounds
        if speech_rate_wpm < 100.0 or speech_rate_wpm > 170.0:
            recommended.append({
                "title": "Rhythm & Pace Regulation Drill",
                "category": "Pacing & Tempo",
                "target_phoneme": "pace",
                "target_words": ["one", "two", "three", "breathe", "four", "five", "speak"],
                "instructions": "Use a metronome set to 120 BPM. Speak one word per beat to lock in consistent timing."
            })

        # Add fallback default exercise if no weak phonemes triggered specific drills
        if not recommended:
            recommended.append(DEFAULT_EXERCISE)

        logger.info(f"Generated {len(recommended)} recommended exercise drills.")
        return recommended
