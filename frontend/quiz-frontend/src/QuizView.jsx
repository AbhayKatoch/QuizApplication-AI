import React, { useState } from 'react';
import { submitQuiz } from './api';

export default function QuizView({ quiz, onFinish, onCancel }){
  const { quiz_id, questions } = quiz;
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function choose(optionIdx){
    const copy = [...answers];
    copy[index] = optionIdx;
    setAnswers(copy);
  }

  async function handleSubmit(){
    setSubmitting(true);
    setError(null);
    try{
      const res = await submitQuiz(quiz_id, answers);
      onFinish(res);
    }catch(err){
      setError(err.message);
    }finally{
      setSubmitting(false);
    }
  }

  const q = questions[index];
  return (
    <div>
      <div className="mb-2 text-sm text-gray-600">Question {index+1}/{questions.length}</div>
      <div className="p-4 border rounded mb-4">
        <div className="font-medium mb-3">{q.text}</div>
        <div className="space-y-2">
          {q.options.map((opt, i)=>(
            <label key={i} className={`block p-2 border rounded cursor-pointer ${answers[index]===i ? 'bg-gray-100' : ''}`}>
              <input type="radio" name={`q-${index}`} checked={answers[index]===i} onChange={()=>choose(i)} className="mr-2" />
              <span>{String.fromCharCode(65+i)}. {opt}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="px-3 py-2 border rounded" disabled={index===0} onClick={()=>setIndex(idx=>idx-1)}>Prev</button>
        <button className="px-3 py-2 border rounded" disabled={index===questions.length-1} onClick={()=>setIndex(idx=>idx+1)}>Next</button>
        <div className="flex-1"></div>
        <button className="px-3 py-2 bg-gray-200 rounded" onClick={onCancel}>Cancel</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </div>
  );
}
