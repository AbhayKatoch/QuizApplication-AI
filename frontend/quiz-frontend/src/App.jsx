import React, { useState } from 'react';
import RoleSelector from './RoleSelector';
import QuizView from './QuizView';
import ResultView from './ResultView';

function App() {
  const [quiz, setQuiz] = useState(null); // {quiz_id, questions}
  const [result, setResult] = useState(null);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Role-driven MCQ Quiz</h1>
      {!quiz && !result && (
        <RoleSelector onStart={(q)=>{ setQuiz(q); setResult(null); }} />
      )}
      {quiz && !result && (
        <QuizView quiz={quiz} onFinish={(res)=>{ setResult(res); setQuiz(null); }} onCancel={()=>setQuiz(null)} />
      )}
      {result && (
        <ResultView result={result} onRetake={()=>{ setResult(null); }} />
      )}
    </div>
  );
}

export default App;
