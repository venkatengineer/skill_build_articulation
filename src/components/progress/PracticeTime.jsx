import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function PracticeTime({ data = [] }) {
  const chartData = data.map((d) => ({
    date: d.date.substring(5),
    Minutes: d.minutes,
  }));

  const totalMins = data.reduce((acc, curr) => acc + curr.minutes, 0);

  return (
    <div className="pastel-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-['Lexend',sans-serif] font-bold text-base text-[#2D2A26]">
            Practice Duration (Minutes)
          </h3>
          <p className="text-xs text-[#65605B]">Total time spent exercising</p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FFE8D6] text-[#7C2D12] border border-[#FFCBA4]">
          {totalMins} Mins Total
        </span>
      </div>

      <div className="h-64 w-full" role="img" aria-label="Bar chart showing practice duration in minutes per day">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE9E0" vertical={false} />
            <XAxis dataKey="date" stroke="#65605B" fontSize={12} tickLine={false} />
            <YAxis stroke="#65605B" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #FFCBA4',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                color: '#7C2D12',
                fontWeight: 'bold',
              }}
            />
            <Bar dataKey="Minutes" fill="#FFE8D6" stroke="#FFCBA4" strokeWidth={1.5} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
