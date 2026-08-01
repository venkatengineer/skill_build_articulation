import { createContext, useContext, useState, useEffect } from 'react';
import { mockUser } from '../api/mockData';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('articulate_user');
    const savedToken = localStorage.getItem('articulate_token');

    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch {
        localStorage.removeItem('articulate_user');
        localStorage.removeItem('articulate_token');
      }
    } else {
      /* Default mock login for smooth hackathon demo */
      setUser(mockUser);
      setToken('mock-demo-token');
      localStorage.setItem('articulate_user', JSON.stringify(mockUser));
      localStorage.setItem('articulate_token', 'mock-demo-token');
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('articulate_user', JSON.stringify(userData));
    localStorage.setItem('articulate_token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('articulate_user');
    localStorage.removeItem('articulate_token');
  };

  const updateUser = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('articulate_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
