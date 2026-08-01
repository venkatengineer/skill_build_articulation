from app.models.domain import RecognizedWord
from app.pipeline.forced_alignment import ForcedAligner
from app.pipeline.phoneme_analysis import PhonemeAnalyzer
from app.pipeline.pronunciation_scoring import PronunciationScorer


def test_pronunciation_scoring():
    aligner = ForcedAligner()
    analyzer = PhonemeAnalyzer()
    scorer = PronunciationScorer()

    words = [
        RecognizedWord(word="the", start_ms=0.0, end_ms=300.0, confidence=0.95),
        RecognizedWord(word="cat", start_ms=300.0, end_ms=700.0, confidence=0.85),
    ]
    target = "the cat"
    aligned = aligner.align(words, target)
    errors, weak = analyzer.analyze_phoneme_errors(aligned)
    overall_score, word_scores = scorer.calculate_scores(aligned, errors)

    assert 0.0 <= overall_score <= 100.0
    assert len(word_scores) == 2
    assert word_scores[0].word == "the"
    assert word_scores[1].word == "cat"
