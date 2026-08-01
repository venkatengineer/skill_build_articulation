import { mockExercises, mockPassages, mockProgress, mockHistory, mockUser } from './mockData.js';
import { mockAnalyze } from './mockAnalyze.js';

// Configuration
const USE_MOCK = true; 
const BASE_URL = 'http://localhost:3000/api';

// Helper to handle fetch responses
async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem('articulate_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'API Request Failed' }));
    throw new Error(error.message || 'API Request Failed');
  }
  
  // Return blob for audio responses, JSON otherwise
  if (headers['Accept'] === 'audio/wav') return res.blob();
  return res.json();
}

// === AUTH ENDPOINTS ===

export async function login(email, password) {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ token: 'mock-jwt-token', user: mockUser });
      }, 500);
    });
  }
  return fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

// === DATA ENDPOINTS ===

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

// === AUDIO ANALYSIS ===

export async function analyzeAudio(targetText, audioBlob) {
  if (USE_MOCK) {
    return mockAnalyze(targetText, audioBlob);
  }
  
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('text', targetText);
  
  const token = localStorage.getItem('articulate_token');
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    body: formData
  });
  
  if (!res.ok) throw new Error('Analysis failed');
  return res.json();
}
