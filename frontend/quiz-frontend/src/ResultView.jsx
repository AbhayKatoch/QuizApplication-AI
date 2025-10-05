import React from 'react';

export default function ResultView({ result, onRetake }){
  const { score, per_question } = result;
  return (
    <div>
      <div className="p-4 border rounded mb-4">
        <h2 className="text-xl font-bold">Score: {Math.round(score)}%</h2>
        <p className="text-sm text-gray-600">{per_question.length} questions</p>
      </div>

      <div className="space-y-3">
        {per_question.map((p, idx)=>(
          <div key={p.question_id} className="p-3 border rounded">
            <div className="font-medium">{idx+1}. {p.text}</div>
            <div className="mt-2">
              {p.options.map((opt, i)=>(
                <div key={i} className={`text-sm p-1 ${p.correct_index===i ? 'font-semibold' : ''}`}>
                  {String.fromCharCode(65+i)}. {opt} {p.user_choice===i ? (p.correct ? '✅' : '❌') : ''}
                </div>
              ))}
            </div>
            {p.explanation && <div className="mt-2 text-xs text-gray-700"><strong>Explanation:</strong> {p.explanation}</div>}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={onRetake}>Take another quiz</button>
      </div>
    </div>
  );
}
