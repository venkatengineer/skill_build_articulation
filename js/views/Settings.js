import { Auth } from '../auth.js';

export async function SettingsView(container) {
  const user = Auth.getUser() || { name: '', email: '' };

  container.innerHTML = `
    <div class="fade-in" style="max-width: 600px;">
      <h1 class="mb-1">Settings</h1>
      <p class="mb-4">Manage your profile and preferences</p>
      
      <div class="card mb-4">
        <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem; color: var(--pastel-mint);">Profile</h2>
        
        <form id="settings-form">
          <div class="input-group">
            <label for="settings-name">Full Name</label>
            <input type="text" id="settings-name" class="input-field" value="${user.name}">
          </div>
          
          <div class="input-group">
            <label for="settings-email">Email Address</label>
            <input type="email" id="settings-email" class="input-field" value="${user.email}">
          </div>
          
          <div class="flex items-center gap-4 mt-4">
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <span id="save-msg" style="color: var(--success); font-weight: 600; opacity: 0; transition: opacity 0.3s;">✓ Saved</span>
          </div>
        </form>
      </div>

      <div class="card">
        <h2 style="font-size: 1.25rem; margin-bottom: 1.5rem; color: var(--error);">Danger Zone</h2>
        <p class="mb-3" style="font-size: 0.875rem;">Sign out of your account on this device.</p>
        <button id="settings-logout" class="btn btn-secondary">Sign Out</button>
      </div>
    </div>
  `;

  document.getElementById('settings-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Mock save
    const newName = document.getElementById('settings-name').value;
    const newEmail = document.getElementById('settings-email').value;
    
    const updatedUser = { ...user, name: newName, email: newEmail };
    Auth.login(updatedUser, Auth.getToken());
    
    const msg = document.getElementById('save-msg');
    msg.style.opacity = '1';
    setTimeout(() => { msg.style.opacity = '0'; }, 2000);
  });

  document.getElementById('settings-logout').addEventListener('click', () => {
    Auth.logout();
  });
}
