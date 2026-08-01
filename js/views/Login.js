import { login } from '../api/client.js';
import { Auth } from '../auth.js';

export async function LoginView(container) {
  container.innerHTML = `
    <div style="max-width: 400px; margin: 4rem auto; text-align: center;">
      <h1 style="color: var(--pastel-mint); margin-bottom: 0.5rem;">Articulate</h1>
      <p style="color: var(--text-secondary); margin-bottom: 2rem;">Sign in to your account</p>
      
      <form id="login-form" class="card" style="text-align: left;">
        <div id="login-error" style="color: var(--error); margin-bottom: 1rem; font-size: 0.875rem; display: none;"></div>
        
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" class="input-field" placeholder="you@example.com" value="alex@example.com" required>
        </div>
        
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" class="input-field" placeholder="••••••••" value="password123" required>
        </div>
        
        <button type="submit" id="submit-btn" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Sign In</button>
      </form>
    </div>
  `;

  const form = document.getElementById('login-form');
  const errorDiv = document.getElementById('login-error');
  const submitBtn = document.getElementById('submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorDiv.style.display = 'none';
    submitBtn.textContent = 'Signing in...';
    submitBtn.disabled = true;

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const { token, user } = await login(email, password);
      Auth.login(user, token);
      window.location.hash = '/'; // Redirect to home
    } catch (err) {
      errorDiv.textContent = err.message || 'Login failed';
      errorDiv.style.display = 'block';
    } finally {
      submitBtn.textContent = 'Sign In';
      submitBtn.disabled = false;
    }
  });
}
