import { useEffect, useState } from "react";

export default function Timer({ duration, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex justify-end text-sm font-medium text-gray-600">
      ⏱️ {mins}:{secs.toString().padStart(2, "0")} remaining
    </div>
  );
}
