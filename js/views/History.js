import { getHistory } from '../api/client.js';

export async function HistoryView(container) {
  container.innerHTML = `
    <div class="fade-in">
      <h1 class="mb-1">Session History</h1>
      <p class="mb-4">Review your past practice results</p>
      
      <div id="history-list" class="grid gap-4" style="grid-template-columns: 1fr;">
        <div style="text-align: center; color: var(--text-muted); padding: 2rem;">Loading...</div>
      </div>
    </div>
  `;

  const listContainer = document.getElementById('history-list');

  try {
    const sessions = await getHistory();
    
    if (sessions.length === 0) {
      listContainer.innerHTML = '<div class="card text-center">No sessions found.</div>';
      return;
    }

    let html = '';
    sessions.forEach(session => {
      let scoreColor = 'var(--success)';
      let scoreBg = '#e6f7ef';
      if (session.overallScore < 80) { scoreColor = 'var(--warning)'; scoreBg = '#fff6f0'; }
      if (session.overallScore < 60) { scoreColor = 'var(--error)'; scoreBg = '#fff0ef'; }

      html += `
        <div class="card" style="cursor: pointer;" onclick="this.classList.toggle('expanded')">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4" style="flex: 1;">
              <div style="font-size: 0.875rem; color: var(--text-secondary); width: 80px;">${session.dateFormatted}</div>
              <div style="padding: 0.25rem 0.75rem; border-radius: var(--border-radius-full); font-weight: 700; color: ${scoreColor}; background-color: ${scoreBg};">
                ${session.overallScore}%
              </div>
              <div style="color: var(--text-primary); font-weight: 600; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${session.exercise}
              </div>
            </div>
            
            <div class="flex items-center gap-2">
              ${session.mistakes.slice(0,2).map(m => `<span style="font-size: 0.75rem; padding: 0.2rem 0.5rem; background: #fff0ef; color: var(--error); border-radius: 4px;">${m}</span>`).join('')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--text-muted);">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
          
          <div class="session-detail" style="display: none; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color);">
            <div class="flex items-center gap-4 mb-4">
              <div><div style="font-size: 0.75rem; color: var(--text-muted);">Clarity</div><div style="font-weight: 700; font-size: 1.25rem; color: var(--pastel-mint);">${session.clarity}%</div></div>
              <div><div style="font-size: 0.75rem; color: var(--text-muted);">Accuracy</div><div style="font-weight: 700; font-size: 1.25rem; color: var(--success);">${session.accuracy}%</div></div>
            </div>
            
            <div style="line-height: 2; font-size: 1.1rem; margin-bottom: 1rem;">
              ${session.wordResults.map(w => {
                let c = 'var(--text-primary)', bg = 'transparent';
                if(w.status === 'error') { c = '#8a3a3a'; bg = 'var(--error)'; }
                else if(w.status === 'warning') { c = '#8a5a3a'; bg = 'var(--warning)'; }
                else if(w.status === 'correct') { c = '#2c6e4f'; bg = 'var(--success)'; }
                return `<span style="padding: 0.1rem 0.3rem; margin: 0 0.1rem; border-radius: 4px; background: ${bg}; color: ${c};">${w.word}</span>`;
              }).join('')}
            </div>
            
            ${session.feedback ? `<div style="padding: 1rem; background: var(--bg-color); border-radius: 8px; border-left: 4px solid var(--pastel-pink);"><span style="font-weight: 700; color: var(--pastel-pink);">Feedback:</span> ${session.feedback}</div>` : ''}
          </div>
        </div>
      `;
    });
    
    // Add CSS for expanding dynamically
    if (!document.getElementById('history-style')) {
      const style = document.createElement('style');
      style.id = 'history-style';
      style.textContent = `
        .card.expanded .session-detail { display: block !important; animation: fadeIn 0.3s ease-out; }
        .card.expanded svg { transform: rotate(180deg); transition: transform 0.3s ease; }
        .card:not(.expanded) svg { transform: rotate(0deg); transition: transform 0.3s ease; }
      `;
      document.head.appendChild(style);
    }
    
    listContainer.innerHTML = html;
    
  } catch (err) {
    listContainer.innerHTML = '<div style="color: var(--error);">Failed to load history.</div>';
  }
}
