import { useState, useEffect, useCallback } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useTimer } from '../hooks/useTimer';
import { analyzeAudio, getExercises } from '../api/client';
import Waveform from '../components/Waveform';
import RecordButton from '../components/RecordButton';
import WordFeedback from '../components/WordFeedback';
import ScoreReveal from '../components/ScoreReveal';
import MouthAnimation from '../components/MouthAnimation';
import { ChevronRight, RefreshCw, Volume2, Sparkles, CheckCircle } from 'lucide-react';

const STATES = {
  READY: 'ready',
  RECORDING: 'recording',
  ANALYZING: 'analyzing',
  RESULTS: 'results',
};

export default function Practice() {
  const [flowState, setFlowState] = useState(STATES.READY);
  const [exercises, setExercises] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [analysisResults, setAnalysisResults] = useState(null);

  const { isRecording, analyserNode, startRecording, stopRecording, clearRecording } = useAudioRecorder();
  const timer = useTimer();

  useEffect(() => {
    getExercises().then(setExercises).catch(console.error);
  }, []);

  const currentExercise = exercises[currentIdx] || {
    text: 'She sells seashells by the seashore',
    category: 'Sibilants (S/SH)',
  };

  const handleNextExercise = () => {
    setCurrentIdx((prev) => (prev + 1) % (exercises.length || 1));
    setFlowState(STATES.READY);
    setAnalysisResults(null);
    clearRecording();
    timer.reset();
  };

  const handleRecordToggle = useCallback(async () => {
    if (flowState === STATES.RECORDING) {
      /* Stop recording & send for analysis */
      const blob = stopRecording();
      timer.stop();
      setFlowState(STATES.ANALYZING);

      try {
        const result = await analyzeAudio(currentExercise.text, blob);
        setAnalysisResults(result);
        setFlowState(STATES.RESULTS);
      } catch (err) {
        console.error('Analysis error:', err);
        setFlowState(STATES.READY);
      }
    } else {
      /* Start recording */
      clearRecording();
      setAnalysisResults(null);
      await startRecording();
      timer.start();
      setFlowState(STATES.RECORDING);
    }
  }, [flowState, stopRecording, startRecording, clearRecording, timer, currentExercise]);

  const handleRetry = () => {
    setFlowState(STATES.READY);
    setAnalysisResults(null);
    clearRecording();
    timer.reset();
  };

  /* Text-to-speech reference playback for accessibility */
  const speakReference = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentExercise.text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Lexend',sans-serif] text-[#2D2A26]">
            Speech Articulation Practice
          </h1>
          <p className="text-sm text-[#65605B] mt-0.5">
            Read the phrase aloud clearly at a comfortable speaking pace.
          </p>
        </div>
        <span className="px-3 py-1 bg-[#E8E5F8] text-[#382E67] border border-[#D1CBEF] rounded-full text-xs font-bold">
          Exercise {currentIdx + 1} of {exercises.length || 1}
        </span>
      </div>

      {/* Target Phrase Display Card */}
      <div className="pastel-card p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 bg-[#D4ECD5] text-[#1E4722] border border-[#B2D8B5] rounded-full text-xs font-bold">
            Target Focus: {currentExercise.category}
          </span>
          <button
            onClick={speakReference}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F2] text-[#382E67] hover:bg-[#E8E5F8] border border-[#EFE9E0] transition-colors"
            title="Listen to reference pronunciation"
          >
            <Volume2 className="w-4 h-4 text-[#7C66DC]" aria-hidden="true" />
            <span>Listen Reference</span>
          </button>
        </div>

        {/* Large Accessible Text Display */}
        <div className="py-4 text-center">
          <p className="text-2xl md:text-3xl font-extrabold font-['Lexend',sans-serif] text-[#2D2A26] leading-snug tracking-wide">
            "{currentExercise.text}"
          </p>
        </div>
      </div>

      {/* Recording & Waveform Section (State: READY or RECORDING) */}
      {(flowState === STATES.READY || flowState === STATES.RECORDING) && (
        <div className="pastel-card p-6 md:p-8 space-y-6 text-center">
          {/* Live Waveform Display */}
          <Waveform analyserNode={analyserNode} isRecording={isRecording} />

          {/* Running Timer */}
          {flowState === STATES.RECORDING && (
            <div className="text-2xl font-mono font-bold text-[#6A1B38] animate-pulse">
              RECORDING {timer.formatted}
            </div>
          )}

          {/* Accessible 70px+ Record Button */}
          <div className="flex flex-col items-center justify-center gap-3 pt-2">
            <RecordButton isRecording={isRecording} onClick={handleRecordToggle} />
            <span className="text-xs font-bold text-[#65605B]">
              {isRecording
                ? 'Tap Stop when finished speaking'
                : 'Tap Microphone to start recording'}
            </span>
          </div>
        </div>
      )}

      {/* Analyzing State with Mouth Animation */}
      {flowState === STATES.ANALYZING && (
        <div className="pastel-card p-8 space-y-6 text-center">
          <MouthAnimation isActive={true} />
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#382E67]">
            <Sparkles className="w-5 h-5 animate-spin text-[#7C66DC]" aria-hidden="true" />
            <span>Evaluating acoustic parameters & phonetic precision...</span>
          </div>
        </div>
      )}

      {/* Results View (State: RESULTS) */}
      {flowState === STATES.RESULTS && analysisResults && (
        <div className="space-y-6">
          <div className="pastel-card p-6">
            <ScoreReveal
              clarity={analysisResults.clarity}
              accuracy={analysisResults.accuracy}
              mistakes={analysisResults.mistakes}
              feedback={analysisResults.feedback}
            />
          </div>

          <div className="pastel-card p-6">
            <WordFeedback
              wordResults={analysisResults.wordResults}
              targetText={currentExercise.text}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={handleRetry}
              className="pastel-btn pastel-btn-pink min-w-[160px]"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>Try Again</span>
            </button>
            <button
              onClick={handleNextExercise}
              className="pastel-btn pastel-btn-sage min-w-[160px]"
            >
              <span>Next Exercise</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
