import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mic, Flame, Award, Clock, ArrowRight, Activity, BookOpen } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const firstName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="pastel-card p-6 md:p-8 bg-gradient-to-r from-[#E8E5F8] via-[#FAF7F2] to-[#D4ECD5] border-[#D1CBEF]">
        <div className="max-w-2xl space-y-3">
          <span className="px-3 py-1 bg-white/80 text-[#382E67] border border-[#D1CBEF] rounded-full text-xs font-bold inline-block">
            Speech Articulation Assistant
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-['Lexend',sans-serif] text-[#2D2A26]">
            Welcome back, {firstName}! 👋
          </h1>
          <p className="text-sm md:text-base text-[#65605B] leading-relaxed">
            Ready to train your voice? Practice tongue twisters, record your speech, and get real-time acoustic feedback.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/practice')}
              className="pastel-btn pastel-btn-lavender text-base shadow-sm"
            >
              <Mic className="w-5 h-5" aria-hidden="true" />
              <span>Start Practice Session</span>
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/assessment')}
              className="pastel-btn pastel-btn-sage text-base"
            >
              <BookOpen className="w-5 h-5" aria-hidden="true" />
              <span>Take Assessment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Score */}
        <div className="pastel-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#E8E5F8] border border-[#D1CBEF] flex items-center justify-center text-[#382E67]">
            <Award className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-[#65605B] block">Today's Avg Score</span>
          <div className="text-2xl font-extrabold text-[#382E67]">88%</div>
          <span className="text-[11px] font-semibold text-[#1E4722] bg-[#D4ECD5] px-2 py-0.5 rounded-full inline-block">
            +4% vs yesterday
          </span>
        </div>

        {/* Streak */}
        <div className="pastel-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FFE8D6] border border-[#FFCBA4] flex items-center justify-center text-[#7C2D12]">
            <Flame className="w-5 h-5 fill-[#7C2D12]" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-[#65605B] block">Current Streak</span>
          <div className="text-2xl font-extrabold text-[#7C2D12]">6 Days</div>
          <span className="text-[11px] font-semibold text-[#7C2D12] bg-[#FFE8D6] px-2 py-0.5 rounded-full inline-block">
            Keep it up! 🔥
          </span>
        </div>

        {/* Last Session */}
        <div className="pastel-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#D4ECD5] border border-[#B2D8B5] flex items-center justify-center text-[#1E4722]">
            <Activity className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-[#65605B] block">Last Session</span>
          <div className="text-2xl font-extrabold text-[#1E4722]">Today</div>
          <span className="text-[11px] font-semibold text-[#65605B]">3 exercises logged</span>
        </div>

        {/* Total Time */}
        <div className="pastel-card p-5 bg-white space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#FCE4EC] border border-[#F8BBD0] flex items-center justify-center text-[#6A1B38]">
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
          <span className="text-xs font-bold text-[#65605B] block">Practice Time</span>
          <div className="text-2xl font-extrabold text-[#6A1B38]">6h 52m</div>
          <span className="text-[11px] font-semibold text-[#65605B]">Across 38 sessions</span>
        </div>
      </div>
    </div>
  );
}
