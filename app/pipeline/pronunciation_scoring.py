from typing import List, Tuple
import numpy as np

from app.models.domain import PhonemeError, PhonemeScore, RecognizedWord, WordScore
from app.pipeline.phoneme_analysis import PhonemeAnalyzer
from app.utils.logger import get_logger

logger = get_logger(__name__)


class PronunciationScorer:
    """Module 5: Calculates GOP scores, word-level scores, and overall pronunciation score."""

    def __init__(self):
        self.phoneme_analyzer = PhonemeAnalyzer()

    def calculate_scores(
        self,
        aligned_pairs: List[Tuple[str, RecognizedWord | None]],
        phoneme_errors: List[PhonemeError]
    ) -> Tuple[float, List[WordScore]]:
        """Calculates overall pronunciation score and detailed word/phoneme scores."""
        logger.info("Computing pronunciation scores...")
        word_scores: List[WordScore] = []
        total_word_score = 0.0

        error_lookup = {err.word: err for err in phoneme_errors}

        for expected_word, rec_obj in aligned_pairs:
            phoneme_list = self.phoneme_analyzer.word_to_phonemes(expected_word)
            phoneme_score_objs: List[PhonemeScore] = []
            
            if rec_obj is None:
                # Word omitted entirely
                word_score_val = 0.0
                for ph in phoneme_list:
                    phoneme_score_objs.append(
                        PhonemeScore(phoneme=ph, score=0.0, error_type="omission")
                    )
            else:
                # Word present, check confidence and acoustic alignment
                base_word_score = rec_obj.confidence * 100.0
                
                for ph in phoneme_list:
                    if expected_word in error_lookup and error_lookup[expected_word].expected == ph:
                        err_type = error_lookup[expected_word].error_type
                        ph_score = max(base_word_score - 30.0, 20.0)
                    else:
                        err_type = None
                        ph_score = min(base_word_score + 5.0, 100.0)
                    
                    phoneme_score_objs.append(
                        PhonemeScore(phoneme=ph, score=round(ph_score, 1), error_type=err_type)
                    )

                word_score_val = np.mean([p.score for p in phoneme_score_objs]) if phoneme_score_objs else 85.0

            word_scores.append(
                WordScore(
                    word=expected_word,
                    score=round(float(word_score_val), 1),
                    phonemes=phoneme_score_objs
                )
            )
            total_word_score += word_score_val

        overall_pronunciation_score = (
            total_word_score / max(len(word_scores), 1) if word_scores else 100.0
        )

        logger.info(f"Pronunciation scoring finished. Overall score: {round(overall_pronunciation_score, 1)}")
        return round(float(overall_pronunciation_score), 1), word_scores
