import { useState, useEffect } from 'react';
import { getProgress } from '../api/client';
import ScoreChart from '../components/progress/ScoreChart';
import AccuracyChart from '../components/progress/AccuracyChart';
import StreakHeatmap from '../components/progress/StreakHeatmap';
import PracticeTime from '../components/progress/PracticeTime';

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProgress()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold font-['Lexend',sans-serif] text-[#2D2A26]">
          Progress Graphs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="pastel-card h-64 animate-pulse bg-[#EFE9E0]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-['Lexend',sans-serif] text-[#2D2A26]">
          Progress & Analytics
        </h1>
        <p className="text-sm text-[#65605B] mt-0.5">
          Visualize your articulation trajectory and practice consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreChart data={data.daily} />
        <AccuracyChart data={data.daily} />
        <StreakHeatmap data={data.streak} currentStreak={data.summary.currentStreak} />
        <PracticeTime data={data.daily} />
      </div>
    </div>
  );
}
