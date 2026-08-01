import { useState, useEffect } from 'react';
import { getHistory } from '../api/client';
import WordFeedback from '../components/WordFeedback';
import { ChevronDown, Calendar, AlertTriangle } from 'lucide-react';

export default function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    getHistory()
      .then(setSessions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-['Lexend',sans-serif] text-[#2D2A26]">
          Session History
        </h1>
        <p className="text-sm text-[#65605B] mt-0.5">
          Review previous recordings and tracked sound pattern improvements.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="pastel-card h-20 animate-pulse bg-[#EFE9E0]" />
          ))}
        </div>
      ) : sessions.length === 0 ? (
        <div className="pastel-card p-8 text-center text-[#65605B]">
          No past practice sessions logged yet.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const isExpanded = expandedId === session.id;

            let scoreBadgeClass = 'bg-[#D4ECD5] text-[#1E4722] border-[#B2D8B5]';
            if (session.overallScore < 80) {
              scoreBadgeClass = 'bg-[#FFE8D6] text-[#7C2D12] border-[#FFCBA4]';
            }
            if (session.overallScore < 65) {
              scoreBadgeClass = 'bg-[#FCE4EC] text-[#6A1B38] border-[#F8BBD0]';
            }

            return (
              <div key={session.id} className="pastel-card overflow-hidden transition-all">
                {/* Spec Required Style Header */}
                <button
                  onClick={() => toggleExpand(session.id)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF7F2] transition-colors focus-visible:ring-3 focus-visible:ring-[#7C66DC]"
                  aria-expanded={isExpanded}
                  aria-label={`Session from ${session.dateFormatted}, score ${session.overallScore} percent`}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#65605B] min-w-[90px]">
                      <Calendar className="w-4 h-4 text-[#7C66DC]" aria-hidden="true" />
                      <span>{session.dateFormatted}</span>
                    </div>

                    <span
                      className={`px-3 py-1 text-xs font-extrabold rounded-full border ${scoreBadgeClass}`}
                    >
                      {session.overallScore}% Overall
                    </span>

                    {/* Spec Format: Yesterday — 82% — Problem: R, TH */}
                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#7C2D12] bg-[#FFE8D6] px-2.5 py-1 rounded-md border border-[#FFCBA4]">
                      <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Problem: {session.mistakes.join(', ')}</span>
                    </div>

                    <p className="text-sm font-semibold text-[#2D2A26] truncate flex-1 ml-2 hidden md:block">
                      "{session.exercise}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <ChevronDown
                      className={`w-5 h-5 text-[#65605B] transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {/* Expanded Detail View */}
                {isExpanded && (
                  <div className="p-5 bg-[#FAF7F2] border-t border-[#EFE9E0] space-y-4 animate-fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-center">
                      <div className="p-3 bg-white rounded-xl border border-[#EFE9E0]">
                        <span className="text-xs text-[#65605B] font-semibold block">Clarity Score</span>
                        <span className="text-lg font-bold text-[#382E67]">{session.clarity}%</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#EFE9E0]">
                        <span className="text-xs text-[#65605B] font-semibold block">Phonetic Accuracy</span>
                        <span className="text-lg font-bold text-[#1E4722]">{session.accuracy}%</span>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-[#EFE9E0] col-span-2 sm:col-span-1">
                        <span className="text-xs text-[#65605B] font-semibold block">Category</span>
                        <span className="text-xs font-bold text-[#2D2A26]">{session.category}</span>
                      </div>
                    </div>

                    <WordFeedback
                      wordResults={session.wordResults}
                      targetText={session.exercise}
                    />

                    {session.feedback && (
                      <div className="p-3.5 bg-white rounded-xl border border-[#D1CBEF] text-xs font-semibold text-[#382E67]">
                        Guidance: {session.feedback}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
