from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import QuizTemplate, Attempt
from .ai_service import generate_quiz
from django.utils import timezone
from django.db.models import Q

@api_view(['POST'])
def generate_quiz_view(request):
    role = request.data.get('role')
    difficulty = request.data.get('difficulty', 'medium')
    length = int(request.data.get('length', 10))
    if not role:
        return Response({"error": "Role is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        data = generate_quiz(role=role, difficulty=difficulty, length=length)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    qs = QuizTemplate.objects.create(
        role=role,
        difficulty=difficulty,
        length=length,
        questions=data['questions'],
    )
    questions_public = [
        {
            "id": q["id"],
            "text": q["text"],
            "options": q["options"]
        } for q in data['questions']
    ]
    return Response({
        "quiz_id": str(qs.id),
        "questions": questions_public
    })


@api_view(['POST'])
def submit_quiz_view(request):
    quiz_id = request.data.get('quiz_id')
    answers = request.data.get('answers', {}) 
    if not quiz_id:
        return Response({"error": "quiz_id is required."}, status=status.HTTP_400_BAD_REQUEST)
    

    try:
        quiz = QuizTemplate.objects.get(id=quiz_id)
    except QuizTemplate.DoesNotExist:
        return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)
    
    correct_count = 0
    per_question = []
    for idx, q in enumerate(quiz.questions):
        correct_index = q.get("correct_index")
        user_choice = answers[idx] if idx < len(answers) else None
        is_correct = (user_choice == correct_index)
        if is_correct:
            correct_count += 1
        per_question.append({
            "question_id": q["id"],
            "text": q["text"],
            "options": q["options"],
            "user_choice": user_choice,
            "correct_index": correct_index,
            "correct": is_correct,
            "explanation": q.get("explanation", "")
        })
    score = (correct_count / len(quiz.questions)) * 100
    Attempt.objects.create(user = request.user if request.user.is_authenticated else None, quiz = quiz, answers = answers, score = score)
    return Response({
        "score": score,
        "per_question": per_question,
    })

@api_view(['GET'])
def get_quiz_view(request, quiz_id):
    try:
        quiz = QuizTemplate.objects.get(id=quiz_id)
    except QuizTemplate.DoesNotExist:
        return Response({"error": "Quiz not found."}, status=status.HTTP_404_NOT_FOUND)
    
    questions_public = [
        {
            "id": q["id"],
            "text": q["text"],
            "options": q["options"]
        } for q in quiz.questions
    ]
    return Response({
        "quiz_id": str(quiz.id),
        "role": quiz.role,
        "questions": questions_public
    })