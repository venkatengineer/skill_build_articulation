import { getProgress } from '../api/client.js';

export async function ProgressView(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 class="mb-1">Progress Dashboard</h1>
      <p class="mb-4">Track your pronunciation improvement over time</p>
      
      <div id="progress-stats" class="grid grid-cols-4 gap-4 mb-4">
        <!-- Stats injected here -->
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="card">
          <h3 class="mb-3" style="font-size: 1rem; color: var(--text-secondary);">Score Trend</h3>
          <canvas id="chart-score"></canvas>
        </div>
        <div class="card">
          <h3 class="mb-3" style="font-size: 1rem; color: var(--text-secondary);">Accuracy</h3>
          <canvas id="chart-accuracy"></canvas>
        </div>
      </div>
    </div>
  `;

  try {
    const data = await getProgress();
    
    // Render Stats
    const statsHtml = `
      <div class="card text-center">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📝</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--text-primary);">${data.summary.totalSessions}</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Total Sessions</div>
      </div>
      <div class="card text-center">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📊</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--pastel-mint);">${data.summary.avgScore}%</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Avg Score</div>
      </div>
      <div class="card text-center">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🏆</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--pastel-pink);">${data.summary.bestScore}%</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Best Score</div>
      </div>
      <div class="card text-center">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⏱️</div>
        <div style="font-size: 1.5rem; font-weight: 800; color: var(--pastel-lavender);">${Math.floor(data.summary.totalPracticeMinutes/60)}h</div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">Practice Time</div>
      </div>
    `;
    document.getElementById('progress-stats').innerHTML = statsHtml;

    // Chart.js global defaults for our theme
    Chart.defaults.font.family = 'Nunito, sans-serif';
    Chart.defaults.color = '#8c8582';
    
    // Render Score Chart
    const ctxScore = document.getElementById('chart-score').getContext('2d');
    new Chart(ctxScore, {
      type: 'line',
      data: {
        labels: data.daily.map(d => d.date.substring(5)),
        datasets: [{
          label: 'Overall Score',
          data: data.daily.map(d => d.score),
          borderColor: '#b5dfd1', // pastel-mint
          backgroundColor: 'rgba(181, 223, 209, 0.2)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }]
      },
      options: { responsive: true, scales: { y: { min: 40, max: 100 } } }
    });

    // Render Accuracy Chart
    const ctxAcc = document.getElementById('chart-accuracy').getContext('2d');
    new Chart(ctxAcc, {
      type: 'bar',
      data: {
        labels: data.daily.map(d => d.date.substring(5)),
        datasets: [{
          label: 'Accuracy',
          data: data.daily.map(d => d.accuracy),
          backgroundColor: '#f7cac9', // pastel-pink
          borderRadius: 6
        }]
      },
      options: { responsive: true, scales: { y: { min: 40, max: 100 } } }
    });
    
  } catch (err) {
    container.innerHTML += '<p style="color: var(--error);">Failed to load progress data.</p>';
  }
}
