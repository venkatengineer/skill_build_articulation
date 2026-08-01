import re
from typing import Dict, List, Tuple
import numpy as np

from app.models.domain import PhonemeError, RecognizedWord
from app.utils.logger import get_logger

logger = get_logger(__name__)

# Basic Grapheme-to-Phoneme dictionary for common articulation training words
G2P_DICT: Dict[str, List[str]] = {
    "the": ["ð", "ə"],
    "quick": ["k", "w", "ɪ", "k"],
    "brown": ["b", "ɹ", "aʊ", "n"],
    "fox": ["f", "ɑ", "k", "s"],
    "jumps": ["dʒ", "ʌ", "m", "p", "s"],
    "over": ["oʊ", "v", "ɚ"],
    "lazy": ["l", "eɪ", "z", "i"],
    "dog": ["d", "ɔ", "ɡ"],
    "cat": ["k", "æ", "t"],
    "bat": ["b", "æ", "t"],
    "apple": ["æ", "p", "əl"],
    "think": ["θ", "ɪ", "ŋ", "k"],
    "speech": ["s", "p", "i", "tʃ"],
    "articulation": ["ɑ", "ɹ", "t", "ɪ", "k", "j", "ə", "l", "eɪ", "ʃ", "ə", "n"],
    "example": ["ɪ", "ɡ", "z", "æ", "m", "p", "əl"],
}


class PhonemeAnalyzer:
    """Module 4: Performs phonetic G2P conversion, acoustic feature extraction, and phoneme error detection."""

    def word_to_phonemes(self, word: str) -> List[str]:
        """Converts a word into a sequence of phonemes (IPA/ARPAbet)."""
        clean_word = re.sub(r"[^\w]", "", word.lower())
        if clean_word in G2P_DICT:
            return G2P_DICT[clean_word]

        # Simple rule-based grapheme-to-phoneme fallback algorithm
        phonemes = []
        i = 0
        while i < len(clean_word):
            char = clean_word[i]
            if char in ["a", "e", "i", "o", "u"]:
                phonemes.append(char)
            elif i + 1 < len(clean_word) and clean_word[i:i+2] in ["th", "sh", "ch", "ph"]:
                phonemes.append(clean_word[i:i+2])
                i += 1
            else:
                phonemes.append(char)
            i += 1

        return phonemes if phonemes else [clean_word]

    def analyze_phoneme_errors(
        self,
        aligned_pairs: List[Tuple[str, RecognizedWord | None]]
    ) -> Tuple[List[PhonemeError], List[str]]:
        """Detects phoneme-level errors (substitution, deletion, insertion, distortion) and weak phonemes."""
        logger.info("Analyzing phoneme errors across aligned speech...")
        phoneme_errors: List[PhonemeError] = []
        weak_phonemes_set = set()

        for expected_word, rec_obj in aligned_pairs:
            exp_phonemes = self.word_to_phonemes(expected_word)

            if rec_obj is None:
                # Word deletion error -> missing all expected phonemes
                for ph in exp_phonemes:
                    phoneme_errors.append(
                        PhonemeError(
                            phoneme=ph,
                            expected=ph,
                            detected="SILENCE",
                            error_type="deletion",
                            word=expected_word,
                            position_ms=(0.0, 0.0)
                        )
                    )
                    weak_phonemes_set.add(ph)
            else:
                rec_phonemes = self.word_to_phonemes(rec_obj.word)

                # Sequence match between expected phonemes and recognized phonemes
                for idx, exp_ph in enumerate(exp_phonemes):
                    if idx < len(rec_phonemes):
                        det_ph = rec_phonemes[idx]
                        if exp_ph != det_ph:
                            phoneme_errors.append(
                                PhonemeError(
                                    phoneme=exp_ph,
                                    expected=exp_ph,
                                    detected=det_ph,
                                    error_type="substitution",
                                    word=expected_word,
                                    position_ms=(rec_obj.start_ms, rec_obj.end_ms)
                                )
                            )
                            weak_phonemes_set.add(exp_ph)
                    else:
                        phoneme_errors.append(
                            PhonemeError(
                                phoneme=exp_ph,
                                expected=exp_ph,
                                detected="SILENCE",
                                error_type="deletion",
                                word=expected_word,
                                position_ms=(rec_obj.start_ms, rec_obj.end_ms)
                            )
                        )
                        weak_phonemes_set.add(exp_ph)

        weak_phonemes = sorted(list(weak_phonemes_set))
        logger.info(f"Phoneme analysis finished. Total errors: {len(phoneme_errors)}, Weak phonemes: {weak_phonemes}")
        return phoneme_errors, weak_phonemes
