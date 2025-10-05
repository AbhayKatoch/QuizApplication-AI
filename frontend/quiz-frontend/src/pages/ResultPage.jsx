import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Card, CardContent } from "@/components/ui/card";

export default function ResultPage({ result, onRestart }) {
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366F1", "#22C55E", "#F59E0B"],
    });
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-50 to-white py-10">
      <Card className="max-w-2xl w-full p-6 text-center shadow-md rounded-2xl">
        <CardContent>
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            🎉 You scored {result.score.toFixed(0)}%
          </h1>
          <p className="text-gray-600 mb-6">
            Great job! Here's how you did on each question 👇
          </p>
          <div className="space-y-4 text-left">
            {result.per_question.map((q, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg ${
                  q.correct ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <p className="font-medium">{i + 1}. {q.text}</p>
                <p className="text-sm text-gray-500">
                  Your Answer: {q.options[q.user_choice]} <br />
                  Correct Answer: {q.options[q.correct_index]}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={onRestart}
            className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Take Another Quiz
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
