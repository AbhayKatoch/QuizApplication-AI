import json
from dotenv import load_dotenv
from typing import List, Annotated
from pydantic import BaseModel, Field, field_validator
from langchain.output_parsers import PydanticOutputParser
from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
load_dotenv()
model = ChatGroq(
    model = "llama-3.3-70b-versatile",
    temperature = 0.2
)

class Question(BaseModel):
    id: Annotated[str, Field(description="Unique short identifier for the question (e.g., 'q1').")]
    text: Annotated[str, Field(description="The text of the question, <= 250 characters.")]
    options: Annotated[List[str], Field(description="List of exactly 4 possible answers (A-D).", min_length=4, max_length=4)]
    correct_index: Annotated[int, Field(ge=0, le=3, description="Index of the correct answer in options (0-3).")]

    explanation: Annotated[str, Field(description="A brief explanation of the correct answer, <= 100 words.")]
    @field_validator('options')
    def validate_unique_options(cls, v):
        if len(set(v)) != 4:
            raise ValueError("All options must be unique.")
        return v
    

class QuizGenerated(BaseModel):
    role: Annotated[str, Field(description="The role for which the quiz is generated.")]
    difficulty: Annotated[str, Field(description="The difficulty level of the quiz (easy, medium, hard).")]
    questions: Annotated[
        List[Question],
        Field(description="A list of multiple-choice questions for this quiz."),
    ]

    @field_validator("questions")
    def validate_question_count(cls, v):
        if not v:
            raise ValueError("At least one question must be generated.")
        return v

parser = PydanticOutputParser(pydantic_object=QuizGenerated)

prompt = PromptTemplate(
    template=(
        "You are an expert quiz generator.\n\n"
        "Generate a multiple-choice quiz in valid JSON format that strictly matches this schema:\n"
        "{format_instructions}\n\n"
        "Requirements:\n"
        "- Generate {n} multiple-choice questions for the role '{role}'.\n"
        "- Difficulty level: {difficulty}.\n"
        "- Each question must have exactly 4 options.\n"
        "- Each question must include a 'correct_index' (0–3).\n"
        "- About 40% of questions should be scenario-based.\n"
        "- Keep text concise and factual (≤250 chars).\n"
        "- No personal, sensitive, or identifiable data.\n"
        "- Output only valid JSON. No commentary or explanation outside JSON."
    ), 
    input_variables=["role","difficulty","n"],
    partial_variables={"format_instructions": parser.get_format_instructions()}
)

chain = prompt | model | parser

def generate_quiz(role: str, length: int = 10, difficulty: str = "medium"):
    raw_response = chain.invoke({"role": role, "difficulty": difficulty, "n": length})
    return raw_response

