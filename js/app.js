import { Auth } from './auth.js';
import { Router } from './router.js';

// Import Views
import { HomeView } from './views/Home.js';
import { PracticeView } from './views/Practice.js';
import { LoginView } from './views/Login.js';
import { ProgressView } from './views/Progress.js';
import { HistoryView } from './views/History.js';
import { SettingsView } from './views/Settings.js';

const routes = [
  { path: '/', view: HomeView, protected: true },
  { path: '/practice', view: PracticeView, protected: true },
  { path: '/progress', view: ProgressView, protected: true },
  { path: '/history', view: HistoryView, protected: true },
  { path: '/settings', view: SettingsView, protected: true },
  { path: '/login', view: LoginView, protected: false }
];

// App initialization
function initApp() {
  const appContainer = document.getElementById('app-container');
  
  // Create sidebar if authenticated
  function renderLayout() {
    if (Auth.isAuthenticated()) {
      if (!document.getElementById('sidebar')) {
        const sidebar = document.createElement('aside');
        sidebar.id = 'sidebar';
        sidebar.innerHTML = `
          <h2 style="color: var(--pastel-mint); margin-bottom: 2rem;">Articulate</h2>
          <nav>
            <a href="#/" class="nav-link" data-path="/">🏠 Home</a>
            <a href="#/practice" class="nav-link" data-path="/practice">🎙️ Practice</a>
            <a href="#/progress" class="nav-link" data-path="/progress">📊 Progress</a>
            <a href="#/history" class="nav-link" data-path="/history">📜 History</a>
          </nav>
          <div style="margin-top: auto;">
            <a href="#/settings" class="nav-link" data-path="/settings">⚙️ Settings</a>
            <button id="logout-btn" class="btn btn-outline" style="width: 100%; margin-top: 1rem;">Sign Out</button>
          </div>
        `;
        appContainer.insertBefore(sidebar, document.getElementById('main-content'));
        
        document.getElementById('logout-btn').addEventListener('click', () => {
          Auth.logout();
        });
      }
    } else {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.remove();
    }
  }

  // Handle active navigation links
  window.addEventListener('route-changed', (e) => {
    const path = e.detail.path;
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.path === path) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

  // Handle Auth changes
  window.addEventListener('auth-change', () => {
    renderLayout();
    router.navigate(); // Re-evaluate routes
  });

  // Initial layout render
  renderLayout();

  // Start router
  const router = new Router(routes, document.getElementById('main-content'));
  router.start();
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
