import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ current, total }) {
  const percentage = ((current + 1) / total) * 100;
  return (
    <div className="w-full mb-3">
      <Progress value={percentage} className="h-2 bg-indigo-100" />
      <p className="text-xs text-gray-500 mt-1 text-right">
        {current + 1} / {total} questions
      </p>
    </div>
  );
}
