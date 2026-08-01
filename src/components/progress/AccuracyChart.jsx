import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function AccuracyChart({ data }) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    Accuracy: d.accuracy,
  }));

  return (
    <div className="pastel-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-['Lexend',sans-serif] font-bold text-base text-[#2D2A26]">
            Phonetic Accuracy Over Time
          </h3>
          <p className="text-xs text-[#65605B]">Consonant & vowel precision</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D4ECD5] text-[#1E4722] border border-[#B2D8B5]">
          Area Chart
        </span>
      </div>

      <div className="h-64 w-full" role="img" aria-label="Area chart showing phonetic accuracy percentage over time">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sageGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4ECD5" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#D4ECD5" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE9E0" vertical={false} />
            <XAxis dataKey="date" stroke="#65605B" fontSize={12} tickLine={false} />
            <YAxis domain={[50, 100]} stroke="#65605B" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #B2D8B5',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                color: '#1E4722',
                fontWeight: 'bold',
              }}
            />
            <Area
              type="monotone"
              dataKey="Accuracy"
              stroke="#2E7D32"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#sageGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
