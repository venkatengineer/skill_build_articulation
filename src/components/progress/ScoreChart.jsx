import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ScoreChart({ data }) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    Score: d.score,
  }));

  return (
    <div className="pastel-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-['Lexend',sans-serif] font-bold text-base text-[#2D2A26]">
            Daily Articulation Score
          </h3>
          <p className="text-xs text-[#65605B]">Overall pronunciation trend</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E8E5F8] text-[#382E67] border border-[#D1CBEF]">
          Line Chart
        </span>
      </div>

      <div className="h-64 w-full" role="img" aria-label="Line chart showing daily articulation scores">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE9E0" vertical={false} />
            <XAxis dataKey="date" stroke="#65605B" fontSize={12} tickLine={false} />
            <YAxis domain={[50, 100]} stroke="#65605B" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #D1CBEF',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                color: '#382E67',
                fontWeight: 'bold',
              }}
            />
            <Line
              type="monotone"
              dataKey="Score"
              stroke="#7C66DC"
              strokeWidth={3.5}
              dot={{ fill: '#7C66DC', r: 5, strokeWidth: 2, stroke: '#FFFFFF' }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
