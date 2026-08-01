from typing import List, Tuple
from app.models.domain import RecognizedWord
from app.utils.logger import get_logger

logger = get_logger(__name__)


class ForcedAligner:
    """Module 3: Performs forced alignment between target reference text and recognized audio words."""

    def align(
        self,
        recognized_words: List[RecognizedWord],
        target_text: str | None = None
    ) -> List[Tuple[str, RecognizedWord | None]]:
        """Aligns target expected words with recognized acoustic words.
        
        Returns a list of tuples: (expected_word, recognized_word_obj_or_None).
        """
        logger.info("Performing forced alignment between reference text and recognized speech...")

        if not target_text:
            # If no target text, 1-to-1 alignment with recognized text
            return [(w.word, w) for w in recognized_words]

        expected_words = [w.strip() for w in target_text.split() if w.strip()]
        if not expected_words:
            return [(w.word, w) for w in recognized_words]

        # Use Levenshtein-based sequence alignment between expected_words and recognized_words
        alignment = self._sequence_align(expected_words, recognized_words)
        logger.info(f"Forced alignment completed for {len(alignment)} word pairs.")
        return alignment

    def _sequence_align(
        self,
        expected: List[str],
        recognized: List[RecognizedWord]
    ) -> List[Tuple[str, RecognizedWord | None]]:
        """Needleman-Wunsch / Levenshtein sequence alignment between target text and recognized words."""
        n, m = len(expected), len(recognized)
        
        # DP table initialization
        dp = [[0] * (m + 1) for _ in range(n + 1)]
        for i in range(n + 1):
            dp[i][0] = i
        for j in range(m + 1):
            dp[0][j] = j

        for i in range(1, n + 1):
            for j in range(1, m + 1):
                exp_w = expected[i - 1].lower().strip(".,!?\"'")
                rec_w = recognized[j - 1].word.lower().strip(".,!?\"'")
                
                cost = 0 if exp_w == rec_w else 1
                dp[i][j] = min(
                    dp[i - 1][j] + 1,       # deletion
                    dp[i][j - 1] + 1,       # insertion
                    dp[i - 1][j - 1] + cost # match/substitution
                )

        # Backtrack to reconstruct alignment
        i, j = n, m
        alignment: List[Tuple[str, RecognizedWord | None]] = []
        
        while i > 0 or j > 0:
            if i > 0 and j > 0:
                exp_w = expected[i - 1].lower().strip(".,!?\"'")
                rec_w = recognized[j - 1].word.lower().strip(".,!?\"'")
                cost = 0 if exp_w == rec_w else 1
                
                if dp[i][j] == dp[i - 1][j - 1] + cost:
                    alignment.append((expected[i - 1], recognized[j - 1]))
                    i -= 1
                    j -= 1
                    continue
            
            if i > 0 and (j == 0 or dp[i][j] == dp[i - 1][j] + 1):
                alignment.append((expected[i - 1], None))
                i -= 1
            else:
                j -= 1

        alignment.reverse()
        return alignment
