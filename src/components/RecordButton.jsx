import { Mic, Square } from 'lucide-react';

export default function RecordButton({ isRecording, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={isRecording ? 'Stop recording voice sample' : 'Start recording voice sample'}
      className={`
        w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center
        transition-all duration-200 cursor-pointer shadow-md focus-visible:ring-4 focus-visible:ring-[#7C66DC]
        ${
          isRecording
            ? 'bg-[#FCE4EC] text-[#6A1B38] border-2 border-[#F8BBD0] animate-record-pulse'
            : 'bg-[#E8E5F8] text-[#382E67] border-2 border-[#D1CBEF] hover:bg-[#DDD8F3] hover:scale-105'
        }
      `}
    >
      {isRecording ? (
        <>
          <Square className="w-8 h-8 fill-[#6A1B38]" aria-hidden="true" />
          <span className="text-[11px] font-bold mt-1 tracking-wide uppercase">Stop</span>
        </>
      ) : (
        <>
          <Mic className="w-9 h-9" aria-hidden="true" />
          <span className="text-[11px] font-bold mt-1 tracking-wide uppercase">Record</span>
        </>
      )}
    </button>
  );
}
