import { useState, useRef, useCallback } from 'react';
import { encodeWAV } from '../utils/wavEncoder';

export function useAudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [analyserNode, setAnalyserNode] = useState(null);
  
  const audioCtxRef = useRef(null);
  const streamRef = useRef(null);
  const processorRef = useRef(null);
  const pcmChunksRef = useRef([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
        },
      });
      streamRef.current = stream;

      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000,
      });
      audioCtxRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      setAnalyserNode(analyser);

      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;
      pcmChunksRef.current = [];

      processor.onaudioprocess = (e) => {
        const inputBuffer = e.inputBuffer.getChannelData(0);
        pcmChunksRef.current.push(new Float32Array(inputBuffer));
      };

      source.connect(analyser);
      analyser.connect(processor);
      processor.connect(audioCtx.destination);

      setIsRecording(true);
    } catch (err) {
      console.error('Failed to access microphone:', err);
      throw err;
    }
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (processorRef.current) {
      processorRef.current.disconnect();
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }

    /* Consolidate Float32 arrays */
    const totalLength = pcmChunksRef.current.reduce((acc, curr) => acc + curr.length, 0);
    const combined = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of pcmChunksRef.current) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    /* Encode to WAV Blob */
    const wavBlob = encodeWAV(combined, 16000);
    return wavBlob;
  }, []);

  const clearRecording = useCallback(() => {
    pcmChunksRef.current = [];
    setAnalyserNode(null);
  }, []);

  return {
    isRecording,
    analyserNode,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
