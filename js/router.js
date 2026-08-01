export class Router {
  constructor(routes, rootElement) {
    this.routes = routes;
    this.rootElement = rootElement;
    
    // Bind event listeners
    window.addEventListener('hashchange', () => this.navigate());
  }

  async navigate() {
    let hash = window.location.hash.slice(1) || '/';
    
    // Find matching route
    const route = this.routes.find(r => r.path === hash);
    if (!route) {
      window.location.hash = '/';
      return;
    }

    // Check auth guard
    const { Auth } = await import('./auth.js');
    if (route.protected && !Auth.isAuthenticated()) {
      window.location.hash = '/login';
      return;
    }
    
    if (!route.protected && Auth.isAuthenticated() && (hash === '/login' || hash === '/signup')) {
      window.location.hash = '/';
      return;
    }

    // Load view
    try {
      // Clear current content
      this.rootElement.innerHTML = '';
      
      // Execute the route's view function which handles rendering and event listeners
      await route.view(this.rootElement);
      
      // Dispatch event to update active links
      window.dispatchEvent(new CustomEvent('route-changed', { detail: { path: hash } }));
    } catch (err) {
      console.error('Route error:', err);
      this.rootElement.innerHTML = '<div class="card"><p class="text-error">Error loading page.</p></div>';
    }
  }

  start() {
    this.navigate();
  }
}
