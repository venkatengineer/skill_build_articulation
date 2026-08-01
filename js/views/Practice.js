import { getExercises, analyzeAudio } from '../api/client.js';
import { AudioRecorder } from '../audio/audioRecorder.js';

export async function PracticeView(container) {
  // Setup HTML structure
  container.innerHTML = `
    <div class="fade-in" style="max-width: 800px; margin: 0 auto;">
      <h1 class="mb-1">Practice</h1>
      <p class="mb-4">Read the phrase clearly and at a natural pace.</p>

      <!-- Exercise Card -->
      <div class="card mb-4">
        <div class="flex justify-between items-center mb-3">
          <span class="badge badge-warning" id="exercise-category">Loading...</span>
        </div>
        <h2 style="font-size: 1.75rem; text-align: center; margin: 2rem 0;" id="exercise-text">
          Loading exercise...
        </h2>
      </div>

      <!-- Recording Section -->
      <div class="card mb-4 text-center" id="recording-section">
        <canvas id="waveform" class="waveform-canvas mb-4"></canvas>
        <div id="timer" style="font-family: monospace; font-size: 2rem; font-weight: 700; color: var(--pastel-pink); margin-bottom: 1rem; display: none;">
          00:00
        </div>
        <div class="flex justify-center mb-2">
          <button id="record-btn" class="record-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="22"></line>
            </svg>
          </button>
        </div>
        <p id="record-status" style="font-size: 0.875rem;">Tap to record</p>
      </div>

      <!-- Analysis Animation -->
      <div class="card mb-4 text-center" id="analyzing-section" style="display: none; padding: 4rem 2rem;">
        <h2 style="color: var(--pastel-mint); animation: pulse 1.5s infinite;">Analyzing pronunciation...</h2>
      </div>

      <!-- Results Section -->
      <div id="results-section" style="display: none;">
        <!-- Scores -->
        <div class="card mb-4 flex justify-between items-center">
          <div class="text-center" style="flex: 1;">
            <div style="font-size: 3rem; font-weight: 800; color: var(--pastel-mint);" id="score-clarity">0</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem; font-weight: 600; text-transform: uppercase;">Clarity</div>
          </div>
          <div style="width: 1px; height: 60px; background: var(--border-color);"></div>
          <div class="text-center" style="flex: 1;">
            <div style="font-size: 3rem; font-weight: 800; color: var(--success);" id="score-accuracy">0</div>
            <div style="color: var(--text-secondary); font-size: 0.875rem; font-weight: 600; text-transform: uppercase;">Accuracy</div>
          </div>
        </div>
        
        <!-- Feedback -->
        <div class="card mb-4" id="word-feedback-container">
           <!-- Word feedback will be injected here -->
        </div>

        <div class="flex justify-center gap-4">
           <button class="btn btn-outline" id="retry-btn">🔄 Try Again</button>
           <button class="btn btn-primary" id="next-btn">Next Exercise ➔</button>
        </div>
      </div>
    </div>
  `;

  // State
  let exercises = [];
  let currentIdx = 0;
  let timerInterval = null;
  let seconds = 0;
  let audioRecorder = null;
  let canvasCtx = null;
  
  // Elements
  const exerciseText = document.getElementById('exercise-text');
  const exerciseCategory = document.getElementById('exercise-category');
  const recordBtn = document.getElementById('record-btn');
  const recordStatus = document.getElementById('record-status');
  const timerEl = document.getElementById('timer');
  const waveformCanvas = document.getElementById('waveform');
  const recordingSection = document.getElementById('recording-section');
  const analyzingSection = document.getElementById('analyzing-section');
  const resultsSection = document.getElementById('results-section');
  
  // Initialize canvas
  canvasCtx = waveformCanvas.getContext('2d');
  waveformCanvas.width = waveformCanvas.offsetWidth;
  waveformCanvas.height = waveformCanvas.offsetHeight;
  drawFlatWaveform();

  function drawFlatWaveform() {
    canvasCtx.fillStyle = 'var(--surface-color)';
    canvasCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'var(--pastel-mint)';
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, waveformCanvas.height / 2);
    canvasCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
    canvasCtx.stroke();
  }

  function drawWaveform(dataArray) {
    canvasCtx.fillStyle = 'var(--surface-color)';
    canvasCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
    
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'var(--pastel-mint)';
    canvasCtx.beginPath();
    
    const sliceWidth = waveformCanvas.width * 1.0 / dataArray.length;
    let x = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      const v = dataArray[i] / 128.0;
      const y = v * waveformCanvas.height / 2;
      
      if (i === 0) canvasCtx.moveTo(x, y);
      else canvasCtx.lineTo(x, y);
      
      x += sliceWidth;
    }
    canvasCtx.lineTo(waveformCanvas.width, waveformCanvas.height / 2);
    canvasCtx.stroke();
  }

  // Load Exercises
  try {
    exercises = await getExercises();
    loadExercise();
  } catch (err) {
    exerciseText.textContent = "Failed to load exercises.";
  }

  function loadExercise() {
    const ex = exercises[currentIdx];
    exerciseText.textContent = ex.text;
    exerciseCategory.textContent = ex.category;
  }

  // Timer logic
  function updateTimer() {
    seconds++;
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    timerEl.textContent = `${m}:${s}`;
  }

  // Audio Recorder Init
  audioRecorder = new AudioRecorder((dataArray) => {
    drawWaveform(dataArray);
  });

  // Record button logic
  recordBtn.addEventListener('click', async () => {
    if (audioRecorder.isRecording) {
      // Stop Recording
      clearInterval(timerInterval);
      recordBtn.classList.remove('recording');
      recordStatus.textContent = 'Processing...';
      
      const audioBlob = audioRecorder.stop();
      drawFlatWaveform();
      timerEl.style.display = 'none';
      
      // UI transition
      recordingSection.style.display = 'none';
      analyzingSection.style.display = 'block';
      
      try {
        const results = await analyzeAudio(exercises[currentIdx].text, audioBlob);
        showResults(results);
      } catch (err) {
        console.error(err);
        alert('Analysis failed');
        resetToReady();
      }
      
    } else {
      // Start Recording
      try {
        await audioRecorder.start();
        recordBtn.classList.add('recording');
        recordStatus.textContent = 'Tap to stop';
        seconds = 0;
        timerEl.textContent = '00:00';
        timerEl.style.display = 'block';
        timerInterval = setInterval(updateTimer, 1000);
      } catch (err) {
        alert('Microphone access denied or error occurred.');
      }
    }
  });

  function showResults(results) {
    analyzingSection.style.display = 'none';
    resultsSection.style.display = 'block';
    
    // Animate scores
    animateValue(document.getElementById('score-clarity'), 0, results.clarity, 1000);
    animateValue(document.getElementById('score-accuracy'), 0, results.accuracy, 1000);
    
    // Render word feedback
    const fbContainer = document.getElementById('word-feedback-container');
    
    let html = `<div style="line-height: 2.5; font-size: 1.25rem;">`;
    results.wordResults.forEach(w => {
      let color = 'var(--text-primary)';
      let bg = 'transparent';
      
      if (w.status === 'correct') { color = '#2c6e4f'; bg = 'var(--success)'; }
      else if (w.status === 'warning') { color = '#8a5a3a'; bg = 'var(--warning)'; }
      else if (w.status === 'error') { color = '#8a3a3a'; bg = 'var(--error)'; }
      
      html += `<span style="padding: 0.2rem 0.5rem; margin: 0 0.2rem; border-radius: 4px; background-color: ${bg}; color: ${color}; font-weight: 600; cursor: help;" title="Score: ${w.score}%">${w.word}</span>`;
    });
    html += `</div>`;
    
    if (results.feedback) {
      html += `<div style="margin-top: 1.5rem; padding: 1rem; background-color: var(--bg-color); border-radius: var(--border-radius-sm); border-left: 4px solid var(--pastel-mint);">
        <span style="font-weight: 700; color: var(--pastel-mint);">AI Feedback:</span> ${results.feedback}
      </div>`;
    }
    
    fbContainer.innerHTML = html;
  }
  
  function resetToReady() {
    resultsSection.style.display = 'none';
    analyzingSection.style.display = 'none';
    recordingSection.style.display = 'block';
    recordStatus.textContent = 'Tap to record';
    drawFlatWaveform();
  }

  document.getElementById('retry-btn').addEventListener('click', resetToReady);
  
  document.getElementById('next-btn').addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % exercises.length;
    loadExercise();
    resetToReady();
  });

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
}
