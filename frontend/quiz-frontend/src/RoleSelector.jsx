import React, { useState } from 'react';
import { generateQuiz } from './api';

export default function RoleSelector({ onStart }){
  const [role, setRole] = useState('');
  const [length, setLength] = useState(5);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleStart(e){
    e.preventDefault();
    setError(null);
    if (!role.trim()) { setError("Enter a role"); return; }
    setLoading(true);
    try{
      const data = await generateQuiz(role, difficulty, length);
      onStart(data); // {quiz_id, questions}
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleStart} className="space-y-4">
      <div>
        <label className="block font-medium">Enter role</label>
        <input className="w-full p-2 border" value={role} onChange={(e)=>setRole(e.target.value)} placeholder="e.g., Junior Python Developer" />
      </div>
      <div className="flex gap-3">
        <div>
          <label className="block font-medium">Number of questions</label>
          <input type="number" min="3" max="20" value={length} onChange={(e)=>setLength(Number(e.target.value))} className="p-2 border w-24" />
        </div>
        <div>
          <label className="block font-medium">Difficulty</label>
          <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} className="p-2 border">
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>
          {loading ? 'Generating...' : 'Start Quiz'}
        </button>
      </div>
    </form>
  );
}
