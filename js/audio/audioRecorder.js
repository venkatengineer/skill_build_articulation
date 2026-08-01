import { encodeWAV } from './wavEncoder.js';

export class AudioRecorder {
  constructor(onDataAvailable) {
    this.audioContext = null;
    this.mediaStream = null;
    this.processor = null;
    this.analyser = null;
    this.source = null;
    this.audioData = [];
    this.isRecording = false;
    this.onDataAvailable = onDataAvailable; // callback for waveform drawing
  }

  async start() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 16000
      });
      
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      
      this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
      
      this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
      
      this.audioData = [];
      
      this.processor.onaudioprocess = (e) => {
        if (!this.isRecording) return;
        
        const inputData = e.inputBuffer.getChannelData(0);
        // Copy data for WAV encoding
        this.audioData.push(new Float32Array(inputData));
        
        // Notify for waveform drawing
        if (this.onDataAvailable) {
          const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
          this.analyser.getByteTimeDomainData(dataArray);
          this.onDataAvailable(dataArray);
        }
      };

      this.source.connect(this.analyser);
      this.analyser.connect(this.processor);
      this.processor.connect(this.audioContext.destination);
      
      this.isRecording = true;
    } catch (err) {
      console.error('Error starting recording:', err);
      throw err;
    }
  }

  stop() {
    if (!this.isRecording) return null;
    
    this.isRecording = false;
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
    }
    
    if (this.processor) {
      this.processor.disconnect();
      this.source.disconnect();
      this.analyser.disconnect();
    }
    
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    // Flatten array
    let totalLength = 0;
    for (const chunk of this.audioData) totalLength += chunk.length;
    
    const flattened = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.audioData) {
      flattened.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert to WAV Blob
    return encodeWAV(flattened, 16000);
  }
}
