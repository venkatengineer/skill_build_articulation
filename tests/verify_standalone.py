import os
import sys
import unittest

# Add app directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))


class TestStructuralIntegrity(unittest.TestCase):

    def test_file_structure_exists(self):
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        expected_files = [
            "app/main.py",
            "app/config/settings.py",
            "app/utils/logger.py",
            "app/utils/audio_utils.py",
            "app/models/domain.py",
            "app/models/ml_models.py",
            "app/schemas/request.py",
            "app/schemas/response.py",
            "app/pipeline/audio_preprocessing.py",
            "app/pipeline/speech_to_text.py",
            "app/pipeline/forced_alignment.py",
            "app/pipeline/phoneme_analysis.py",
            "app/pipeline/pronunciation_scoring.py",
            "app/pipeline/speech_metrics.py",
            "app/pipeline/feedback_generator.py",
            "app/pipeline/exercise_generator.py",
            "app/pipeline/response_formatter.py",
            "app/services/articulation_service.py",
            "app/api/router.py",
            "app/api/v1/endpoints/health.py",
            "app/api/v1/endpoints/analyze.py",
            "requirements.txt",
            ".env.example",
            "README.md",
        ]
        for rel_path in expected_files:
            full_path = os.path.join(base_dir, rel_path)
            self.assertTrue(os.path.exists(full_path), f"Missing file: {rel_path}")


if __name__ == "__main__":
    unittest.main()
