from django.test import TestCase
from rest_framework.test import APIClient
from .models import QuizTemplate

class QuizScoringTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.quiz = QuizTemplate.objects.create(
            role="Python Developer",
            difficulty="medium",
            length=3,
            questions=[
                {
                    "id": 1,
                    "text": "What is Python?",
                    "options": ["Language", "Animal", "Game", "Framework"],
                    "correct_index": 0,
                },
                {
                    "id": 2,
                    "text": "What is 2 + 2?",
                    "options": ["3", "4", "5", "22"],
                    "correct_index": 1,
                },
                {
                    "id": 3,
                    "text": "Select True statement",
                    "options": ["1 == 2", "2 == 2", "3 == 2", "None"],
                    "correct_index": 1,
                },
            ],
        )

    def test_all_correct_answers(self):
        answers = [0,1,1]
        response = self.client.post(
            "/api/submit_quiz/",
            {"quiz_id": str(self.quiz.id), "answers": answers},
            format="json"
        )
        self.assertEqual(response.status_code,200)
        data = response.json()
        self.assertEqual(round(data["score"], 2), 100.0)
        self.assertTrue(all(q["correct"] for q in data["per_question"]))

    def test_some_wrong_answers(self):
            answers = [1, 0, 1]  # 1 wrong, 2 correct
            response = self.client.post(
                "/api/submit_quiz/",
                {"quiz_id": str(self.quiz.id), "answers": answers},
                format="json",
            )
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertAlmostEqual(data["score"], 33.33, delta=0.1)

    def test_all_wrong_answers(self):
        answers = [3, 3, 3]
        response = self.client.post(
            "/api/submit_quiz/",
            {"quiz_id": str(self.quiz.id), "answers": answers},
            format="json",
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["score"], 0.0)