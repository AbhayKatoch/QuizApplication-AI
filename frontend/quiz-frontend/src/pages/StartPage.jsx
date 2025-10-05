import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StartPage({ onStart }) {
  const [role, setRole] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [length, setLength] = useState(10);
  const [error, setError] = useState("");

  const handleStart = () => {
    if (!role.trim()) {
      setError("Please enter a role before starting!");
      return;
    }
    setError("");
    onStart({ role, difficulty, length }); 
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-white">
      <Card className="w-full max-w-md shadow-xl rounded-2xl p-6">
        <CardContent className="space-y-6">
          <h1 className="text-3xl font-bold text-center text-indigo-600">
            Smart Quiz Generator
          </h1>
          <p className="text-gray-600 text-center">
            Enter your <span className="font-semibold">role</span> and we'll craft a personalized quiz for you.
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g., Junior Developer"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Questions
            </label>
            <input
              type="number"
              min="3"
              max="20"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            onClick={handleStart}
          >
             Start Quiz
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
