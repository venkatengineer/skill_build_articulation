import { Award, Target, AlertCircle } from 'lucide-react';

export default function ScoreReveal({ clarity = 0, accuracy = 0, mistakes = [], feedback = '' }) {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Clarity Score Card */}
        <div className="flex items-center gap-4 p-5 bg-[#E8E5F8] border border-[#D1CBEF] rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#382E67] shadow-xs">
            <Award className="w-7 h-7" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#382E67]">
              Clarity Rating
            </span>
            <div className="text-3xl font-extrabold text-[#382E67]">
              {clarity}%
            </div>
          </div>
        </div>

        {/* Accuracy Score Card */}
        <div className="flex items-center gap-4 p-5 bg-[#D4ECD5] border border-[#B2D8B5] rounded-2xl">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-[#1E4722] shadow-xs">
            <Target className="w-7 h-7" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-[#1E4722]">
              Phonetic Accuracy
            </span>
            <div className="text-3xl font-extrabold text-[#1E4722]">
              {accuracy}%
            </div>
          </div>
        </div>
      </div>

      {/* Target Phonetic Areas / Mistakes */}
      {mistakes && mistakes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap p-3.5 bg-[#FFE8D6] border border-[#FFCBA4] rounded-xl text-sm font-semibold text-[#7C2D12]">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Target Sound Focus:</span>
          <div className="flex gap-1.5">
            {mistakes.map((sound, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 bg-white rounded-md text-xs font-bold border border-[#FFCBA4]"
              >
                /{sound}/ Sound
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actionable Feedback Text */}
      {feedback && (
        <div className="p-4 bg-[#FAF7F2] border-l-4 border-[#7C66DC] rounded-r-xl text-sm font-medium text-[#2D2A26] leading-relaxed">
          <span className="font-bold text-[#382E67] block mb-1">
            AI Articulation Guidance:
          </span>
          {feedback}
        </div>
      )}
    </div>
  );
}
