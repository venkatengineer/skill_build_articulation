import { Flame } from 'lucide-react';

export default function StreakHeatmap({ data = [], currentStreak = 6 }) {
  return (
    <div className="pastel-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-['Lexend',sans-serif] font-bold text-base text-[#2D2A26]">
            Practice Streak & Frequency
          </h3>
          <p className="text-xs text-[#65605B]">Daily activity history</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFE8D6] text-[#7C2D12] rounded-full border border-[#FFCBA4] font-bold text-xs">
          <Flame className="w-4 h-4 fill-[#7C2D12]" aria-hidden="true" />
          <span>{currentStreak} Days Active</span>
        </div>
      </div>

      {/* Accessible Pastel Heatmap Grid */}
      <div className="grid grid-cols-7 gap-2.5 pt-2">
        {data.map((item, idx) => {
          let bgClass = 'bg-[#EFE9E0] text-[#65605B]';
          if (item.count >= 5) bgClass = 'bg-[#7C66DC] text-white font-bold';
          else if (item.count >= 3) bgClass = 'bg-[#E8E5F8] text-[#382E67] font-semibold border border-[#D1CBEF]';
          else if (item.count >= 1) bgClass = 'bg-[#D4ECD5] text-[#1E4722] font-semibold border border-[#B2D8B5]';

          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${bgClass}`}
              title={`${item.date}: ${item.count} sessions completed`}
              tabIndex={0}
              aria-label={`${item.date}, ${item.count} practice sessions completed`}
            >
              <span className="text-[11px] uppercase opacity-80">
                {new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-base font-extrabold mt-0.5">
                {item.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
