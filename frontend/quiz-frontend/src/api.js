const API_URL = "https://quizapplication-ai.onrender.com/api";

export async function generateQuiz(role, difficulty='medium', length=10) {
    const res = await fetch(`${API_URL}/generate_quiz/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ role, difficulty, length })
    });
    if(!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to generate quiz');
    }
    return res.json();
}

export async function submitQuiz(quizId, answers) {
    const res = await fetch(`${API_URL}/submit_quiz/`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ quiz_id: quizId, answers })
    });
    if(!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to submit quiz');
    }
    return res.json();
}