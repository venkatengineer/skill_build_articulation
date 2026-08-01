import { useState, useEffect, useCallback } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTimer } from '../hooks/useTimer';
import { analyzeAudio, getAssessmentPassages } from '../api/client';
import Waveform from '../components/Waveform';
import RecordButton from '../components/RecordButton';
import WordFeedback from '../components/WordFeedback';
import ScoreReveal from '../components/ScoreReveal';
import MouthAnimation from '../components/MouthAnimation';
import { FileCheck, Play } from 'lucide-react';

const STATES = {
  INTRO: 'intro',
  READY: 'ready',
  RECORDING: 'recording',
  ANALYZING: 'analyzing',
  RESULTS: 'results',
};

export default function Assessment() {
  const [flowState, setFlowState] = useState(STATES.INTRO);
  const [passages, setPassages] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState(null);

  const { isRecording, analyserNode, startRecording, stopRecording, clearRecording } = useAudioRecorder();
  const timer = useTimer();

  useEffect(() => {
    getAssessmentPassages().then(setPassages).catch(console.error);
  }, []);

  const currentPassage = passages[currentIdx] || {
    title: 'The Wind and the Sun',
    text: 'The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak.',
    category: 'Comprehensive Assessment',
  };

  const handleStartAssessment = () => setFlowState(STATES.READY);

  const handleRecordToggle = useCallback(async () => {
    if (flowState === STATES.RECORDING) {
      const blob = stopRecording();
      timer.stop();
      setFlowState(STATES.ANALYZING);

      try {
        const res = await analyzeAudio(currentPassage.text, blob);
        setResults(res);
        setFlowState(STATES.RESULTS);
      } catch {
        setFlowState(STATES.READY);
      }
    } else {
      clearRecording();
      setResults(null);
      await startRecording();
      timer.start();
      setFlowState(STATES.RECORDING);
    }
  }, [flowState, stopRecording, startRecording, clearRecording, timer, currentPassage]);

  if (flowState === STATES.INTRO) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 text-center pt-6">
        <div className="w-16 h-16 rounded-2xl bg-[#E8E5F8] border border-[#D1CBEF] flex items-center justify-center text-[#382E67] mx-auto shadow-xs">
          <FileCheck className="w-8 h-8" aria-hidden="true" />
        </div>

        <h1 className="text-3xl font-extrabold font-['Lexend',sans-serif] text-[#2D2A26]">
          Speech Assessment Flow
        </h1>
        <p className="text-base text-[#65605B] max-w-lg mx-auto leading-relaxed">
          Read a full paragraph aloud to test your overall speech clarity, phonetic stability, and breathing control across multiple consonant clusters.
        </p>

        <div className="pastel-card p-6 text-left max-w-lg mx-auto">
          <h2 className="font-bold text-sm text-[#382E67] mb-2">Assessment Passage Preview:</h2>
          <p className="text-sm font-semibold text-[#2D2A26] leading-relaxed">
            "{currentPassage.text}"
          </p>
        </div>

        <button
          onClick={handleStartAssessment}
          className="pastel-btn pastel-btn-lavender px-8 py-3 text-base shadow-sm"
        >
          <Play className="w-5 h-5 fill-[#382E67]" aria-hidden="true" />
          <span>Begin Assessment</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Lexend',sans-serif] text-[#2D2A26]">
            Assessment: {currentPassage.title}
          </h1>
          <p className="text-sm text-[#65605B]">Read at a natural, steady pace.</p>
        </div>
      </div>

      <div className="pastel-card p-6 md:p-8">
        <p className="text-xl font-semibold text-[#2D2A26] leading-relaxed">
          "{currentPassage.text}"
        </p>
      </div>

      {(flowState === STATES.READY || flowState === STATES.RECORDING) && (
        <div className="pastel-card p-6 space-y-6 text-center">
          <Waveform analyserNode={analyserNode} isRecording={isRecording} />
          {flowState === STATES.RECORDING && (
            <div className="text-2xl font-mono font-bold text-[#6A1B38]">
              ⏱️ {timer.formatted}
            </div>
          )}
          <div className="flex flex-col items-center justify-center gap-3">
            <RecordButton isRecording={isRecording} onClick={handleRecordToggle} />
            <span className="text-xs font-bold text-[#65605B]">
              {isRecording ? 'Tap Stop when complete' : 'Tap to start recording passage'}
            </span>
          </div>
        </div>
      )}

      {flowState === STATES.ANALYZING && (
        <div className="pastel-card p-8">
          <MouthAnimation isActive={true} />
        </div>
      )}

      {flowState === STATES.RESULTS && results && (
        <div className="space-y-6">
          <div className="pastel-card p-6">
            <ScoreReveal
              clarity={results.clarity}
              accuracy={results.accuracy}
              mistakes={results.mistakes}
              feedback={results.feedback}
            />
          </div>
          <div className="pastel-card p-6">
            <WordFeedback wordResults={results.wordResults} targetText={currentPassage.text} />
          </div>
        </div>
      )}
    </div>
  );
}
