from django.urls import path
from . import views

urlpatterns = [
    path("generate_quiz/", views.generate_quiz_view),
    path("submit_quiz/", views.submit_quiz_view),
    path("quiz/<uuid:quiz_id>/", views.get_quiz_view),
]
