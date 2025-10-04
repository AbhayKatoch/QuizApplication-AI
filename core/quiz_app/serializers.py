from rest_framework import serializers
from .models import QuizTemplate, Attempt

class QuizSerializer(serializers.Serializer):
    id = serializers.CharField()
    text = serializers.CharField()
    options = serializers.ListField(child = serializers.CharField())


class QuizTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizTemplate
        fields = ['id', 'role', 'difficulty', 'length', 'generated_at', 'questions']

class AttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attempt
        fields = '__all__'