import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Timer from "../components/ui/Timer";
import ProgressBar from "../components/ui/ProgressBar";

export default function QuizPage({ questions, onSubmit }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeUp, setTimeUp] = useState(false);

  const handleSelect = (index) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const next = () => setCurrent((c) => Math.min(c + 1, questions.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  const submitNow = () => onSubmit(answers);

  const handleTimeout = () => {
    setTimeUp(true);
    submitNow();
  };

  const currentQ = questions[current];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
      <div className="w-full max-w-2xl">
        <Timer duration={600} onTimeout={handleTimeout} /> {/* ⏱ 2 min */}
        <ProgressBar current={current} total={questions.length} />

        <motion.div
          key={current}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <Card className="p-6 rounded-2xl shadow-lg">
            <CardContent>
              <h2 className="text-lg font-semibold mb-4">
                {current + 1}. {currentQ.text}
              </h2>
              <div className="space-y-2">
                {currentQ.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left px-4 py-3 border rounded-lg transition
                      ${
                        answers[current] === i
                          ? "bg-indigo-100 border-indigo-500"
                          : "hover:bg-gray-100"
                      }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button onClick={prev} disabled={current === 0}>
                  ← Previous
                </Button>
                {current < questions.length - 1 ? (
                  <Button onClick={next}>Next →</Button>
                ) : (
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700"
                    onClick={submitNow}
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
