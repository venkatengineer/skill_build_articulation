import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function WordFeedback({ wordResults = [], targetText = '' }) {
  if (!wordResults || wordResults.length === 0) {
    return (
      <p className="text-sm text-[#65605B] italic">No word feedback available.</p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#2D2A26]">
          Word-by-Word Pronunciation
        </h3>
        {/* Colorblind / Icon Legend */}
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-[#1E4722]">
            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Accurate
          </span>
          <span className="flex items-center gap-1 text-[#7C2D12]">
            <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" /> Slight Error
          </span>
          <span className="flex items-center gap-1 text-[#6A1B38]">
            <XCircle className="w-3.5 h-3.5" aria-hidden="true" /> Needs Practice
          </span>
        </div>
      </div>

      {/* Render Word Pills with both Color AND Icons */}
      <div
        className="flex flex-wrap gap-2.5 p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE9E0] leading-relaxed"
        role="region"
        aria-label="Color and icon annotated word results"
      >
        {wordResults.map((item, idx) => {
          let styleClass = '';
          let IconComponent = CheckCircle2;
          let label = 'Accurate';

          if (item.status === 'correct') {
            styleClass = 'bg-[#D4ECD5] text-[#1E4722] border-[#B2D8B5]';
            IconComponent = CheckCircle2;
            label = 'Accurate';
          } else if (item.status === 'warning') {
            styleClass = 'bg-[#FFE8D6] text-[#7C2D12] border-[#FFCBA4]';
            IconComponent = AlertTriangle;
            label = 'Slight error';
          } else {
            styleClass = 'bg-[#FCE4EC] text-[#6A1B38] border-[#F8BBD0]';
            IconComponent = XCircle;
            label = 'Needs practice';
          }

          return (
            <span
              key={idx}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold shadow-2xs ${styleClass}`}
              title={`${item.word}: ${label} (${item.score}% accuracy)`}
              tabIndex={0}
              aria-label={`${item.word}, ${label}, score ${item.score} percent`}
            >
              <IconComponent className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{item.word}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
