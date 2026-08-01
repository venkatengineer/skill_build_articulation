export const Auth = {
  getUser() {
    const userStr = localStorage.getItem('articulate_user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken() {
    return localStorage.getItem('articulate_token');
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getUser();
  },

  login(user, token) {
    localStorage.setItem('articulate_user', JSON.stringify(user));
    localStorage.setItem('articulate_token', token);
    window.dispatchEvent(new Event('auth-change'));
  },

  logout() {
    localStorage.removeItem('articulate_user');
    localStorage.removeItem('articulate_token');
    window.dispatchEvent(new Event('auth-change'));
  }
};
