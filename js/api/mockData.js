export const mockExercises = [
  { id: 'e1', type: 'twister', text: 'She sells seashells by the seashore', category: 'sibilants' },
  { id: 'e2', type: 'twister', text: 'Peter Piper picked a peck of pickled peppers', category: 'plosives' },
  { id: 'e3', type: 'twister', text: 'How much wood would a woodchuck chuck', category: 'vowels' }
];

export const mockPassages = [
  { id: 'p1', type: 'passage', text: 'The quick brown fox jumps over the lazy dog. It is a well-known pangram that contains every letter of the English alphabet.', category: 'general' }
];

export const mockProgress = {
  summary: { totalSessions: 42, avgScore: 78, bestScore: 96, currentStreak: 7, totalPracticeMinutes: 435 },
  daily: [
    { date: '2023-07-25', score: 72, accuracy: 70, minutes: 12 },
    { date: '2023-07-26', score: 75, accuracy: 73, minutes: 15 },
    { date: '2023-07-27', score: 71, accuracy: 75, minutes: 10 },
    { date: '2023-07-28', score: 80, accuracy: 82, minutes: 20 },
    { date: '2023-07-29', score: 85, accuracy: 84, minutes: 25 },
    { date: '2023-07-30', score: 82, accuracy: 81, minutes: 15 },
    { date: '2023-07-31', score: 88, accuracy: 86, minutes: 30 }
  ],
  streak: [
    { date: '2023-07-25', count: 2 }, { date: '2023-07-26', count: 3 },
    { date: '2023-07-27', count: 1 }, { date: '2023-07-28', count: 4 },
    { date: '2023-07-29', count: 5 }, { date: '2023-07-30', count: 2 },
    { date: '2023-07-31', count: 6 }
  ]
};

export const mockHistory = [
  {
    id: 's1', date: '2023-07-31T10:00:00Z', dateFormatted: 'Today',
    exercise: 'She sells seashells by the seashore', category: 'sibilants',
    overallScore: 88, clarity: 90, accuracy: 86,
    mistakes: ['seashells', 'seashore'], feedback: 'Great job! Pay a little more attention to the "sh" sound.',
    wordResults: [
      { word: 'She', status: 'correct', score: 95 },
      { word: 'sells', status: 'correct', score: 92 },
      { word: 'seashells', status: 'warning', score: 75 },
      { word: 'by', status: 'correct', score: 99 },
      { word: 'the', status: 'correct', score: 98 },
      { word: 'seashore', status: 'warning', score: 70 }
    ]
  },
  {
    id: 's2', date: '2023-07-30T14:30:00Z', dateFormatted: 'Yesterday',
    exercise: 'Peter Piper picked a peck of pickled peppers', category: 'plosives',
    overallScore: 72, clarity: 75, accuracy: 70,
    mistakes: ['peck', 'pickled'], feedback: 'Try to enunciate your "p" sounds more clearly.',
    wordResults: [
      { word: 'Peter', status: 'correct', score: 85 },
      { word: 'Piper', status: 'correct', score: 80 },
      { word: 'picked', status: 'correct', score: 82 },
      { word: 'a', status: 'correct', score: 90 },
      { word: 'peck', status: 'error', score: 45 },
      { word: 'of', status: 'correct', score: 88 },
      { word: 'pickled', status: 'error', score: 50 },
      { word: 'peppers', status: 'warning', score: 65 }
    ]
  }
];

export const mockUser = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  joinDate: '2023-01-15T00:00:00Z'
};
