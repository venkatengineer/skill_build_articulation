import { mockExercises, mockPassages, mockProgress, mockHistory, mockUser } from './mockData';
import { mockAnalyze } from './mockAnalyze';

const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('articulate_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'API request failed' }));
    throw new Error(error.message || 'API request failed');
  }

  return res.json();
}

export async function login(email, password) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { token: 'mock-jwt-token-12345', user: { ...mockUser, email } };
  }
  return fetchWithAuth('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(name, email, password) {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { token: 'mock-jwt-token-12345', user: { id: 'u2', name, email } };
  }
  return fetchWithAuth('/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getExercises() {
  if (USE_MOCK) return Promise.resolve(mockExercises);
  return fetchWithAuth('/exercises');
}

export async function getAssessmentPassages() {
  if (USE_MOCK) return Promise.resolve(mockPassages);
  return fetchWithAuth('/assessment');
}

export async function getProgress() {
  if (USE_MOCK) return Promise.resolve(mockProgress);
  return fetchWithAuth('/progress');
}

export async function getHistory() {
  if (USE_MOCK) return Promise.resolve(mockHistory);
  return fetchWithAuth('/history');
}

export async function analyzeAudio(targetText, audioBlob) {
  if (USE_MOCK) {
    return mockAnalyze(targetText, audioBlob);
  }

  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('targetText', targetText);

  const token = localStorage.getItem('articulate_token');
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error('Analysis request failed');
  return res.json();
}
