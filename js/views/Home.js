import { Auth } from '../auth.js';
import { getHistory } from '../api/client.js';

export async function HomeView(container) {
  const user = Auth.getUser();
  const name = user?.name?.split(' ')[0] || 'there';
  
  // Render skeleton
  container.innerHTML = `
    <div class="fade-in">
      <h1 class="mb-1">Hello, ${name}! 👋</h1>
      <p class="mb-4">Ready to improve your pronunciation today?</p>
      
      <div class="card mb-4" style="text-align: center; background: linear-gradient(135deg, var(--surface-color), var(--bg-color));">
        <h2 style="font-size: 2rem; margin-bottom: 1rem;">🎙️</h2>
        <h2 class="mb-2">Start Practicing</h2>
        <p class="mb-3" style="max-width: 400px; margin-left: auto; margin-right: auto;">
          Record yourself reading exercises and get AI-powered pronunciation feedback.
        </p>
        <a href="#/practice" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.1rem;">
          🎤 Begin Session
        </a>
      </div>
      
      <div class="grid grid-cols-4 gap-4 mb-4">
        <div class="card text-center">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎯</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--pastel-mint);">82%</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Today's Score</div>
        </div>
        <div class="card text-center">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔥</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--warning);">7 days</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Current Streak</div>
        </div>
        <div class="card text-center">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📝</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--pastel-blue);">Today</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Last Session</div>
        </div>
        <div class="card text-center">
          <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">⏱️</div>
          <div style="font-size: 1.5rem; font-weight: 800; color: var(--pastel-lavender);">7h 15m</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Total Practice</div>
        </div>
      </div>
    </div>
  `;
}
