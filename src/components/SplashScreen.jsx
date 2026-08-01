import { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 300);
          return 100;
        }
        return prev + 12;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF7F2] text-[#2D2A26] px-4"
      role="region"
      aria-label="App loading splash screen"
    >
      <div className="flex flex-col items-center max-w-sm text-center">
        {/* Soft Lavender Mark */}
        <div
          className="w-20 h-20 rounded-3xl bg-[#E8E5F8] border border-[#D1CBEF] flex items-center justify-center mb-6 shadow-sm"
          style={{ animation: 'softPulse 2.5s infinite' }}
        >
          <Mic className="w-10 h-10 text-[#382E67]" aria-hidden="true" />
        </div>

        <h1 className="text-3xl font-bold font-['Lexend',sans-serif] text-[#2D2A26] mb-2 tracking-tight">
          Articulate
        </h1>
        <p className="text-base text-[#65605B] mb-8 font-medium">
          Smart Accessible Speech Trainer
        </p>

        {/* Accessible Progress Indicator */}
        <div className="w-64 bg-[#EFE9E0] rounded-full h-3 overflow-hidden mb-3 border border-[#E2DAD0]">
          <div
            className="bg-[#7C66DC] h-full transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Loading application"
          />
        </div>
        <span className="text-xs font-semibold text-[#65605B]">
          Initializing speech model... {Math.min(progress, 100)}%
        </span>
      </div>
    </div>
  );
}
