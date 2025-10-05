import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartPage from "./pages/StartPage";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";
import { generateQuiz, submitQuiz } from "./api";

export default function App() {
  const [page, setPage] = useState("start");
  const [role, setRole] = useState("");
  const [quizId, setQuizId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async ({ role, difficulty, length }) => {
  setRole(role);
  setLoading(true);
  setError("");
  try {
    const data = await generateQuiz(role, difficulty, length);
    setQuizId(data.quiz_id);
    setQuestions(data.questions);
    setPage("quiz");
  } catch (err) {
    console.error(err);
    setError("Failed to generate quiz. Please try again.");
  } finally {
    setLoading(false);
  }
};


  const handleSubmit = async (answers) => {
    setLoading(true);
    try {
      const res = await submitQuiz(quizId, answers);
      setResult(res);
      setPage("result");
    } catch (err) {
      console.error(err);
      setError("Failed to submit quiz.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setResult(null);
    setRole("");
    setQuizId(null);
    setQuestions([]);
    setPage("start");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center px-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl px-6 py-4 shadow-lg">
            <span className="animate-pulse text-indigo-600 font-medium">
              Loading...
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-100 text-red-600 px-4 py-2 rounded-lg shadow-md">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {page === "start" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <StartPage onStart={handleStart} />
          </motion.div>
        )}

        {page === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <QuizPage questions={questions} onSubmit={handleSubmit} />
          </motion.div>
        )}

        {page === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            <ResultPage result={result} onRestart={handleRestart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
