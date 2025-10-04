from django.db import models
import uuid
from django.contrib.auth import get_user_model
# Create your models here.

User = get_user_model()

class QuizTemplate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=150)
    difficulty = models.CharField(max_length=20, default='medium')
    length = models.IntegerField(default=10)
    generated_at = models.DateTimeField(auto_now_add=True)
    questions = models.JSONField()

    def __str__(self):
        return f"{self.role} - {self.difficulty} - {self.length} questions"

class Attempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    quiz = models.ForeignKey(QuizTemplate, on_delete=models.CASCADE)
    answers = models.JSONField()
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    