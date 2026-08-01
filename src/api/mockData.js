export const mockExercises = [
  { id: 'e1', type: 'twister', text: 'She sells seashells by the seashore', category: 'Sibilants (S/SH)' },
  { id: 'e2', type: 'twister', text: 'Peter Piper picked a peck of pickled peppers', category: 'Plosives (P/B)' },
  { id: 'e3', type: 'twister', text: 'Thirty-three thousand feathers on a thrush', category: 'Dental (TH)' },
  { id: 'e4', type: 'twister', text: 'Red lorry yellow lorry red lorry yellow lorry', category: 'Liquids (R/L)' },
  { id: 'e5', type: 'word_drill', text: 'The weather in Thursday was rather surprising', category: 'Dental (TH)' },
];

export const mockPassages = [
  { id: 'p1', type: 'passage', title: 'The Wind and the Sun', text: 'The North Wind and the Sun were disputing which was the stronger, when a traveler came along wrapped in a warm cloak. They agreed that the one who first succeeded in making the traveler take his cloak off should be considered stronger.', category: 'Comprehensive Assessment' },
  { id: 'p2', type: 'passage', title: 'Clear Articulation Drill', text: 'Proper articulation requires deliberate placement of the tongue against the hard palate, ensuring clean vocal resonance and precise consonant delivery across varied speech tempos.', category: 'Phonetic Accuracy' },
];

export const mockProgress = {
  summary: {
    totalSessions: 38,
    avgScore: 84,
    bestScore: 98,
    currentStreak: 6,
    totalPracticeMinutes: 412,
  },
  daily: [
    { date: '2026-07-26', score: 74, accuracy: 72, minutes: 12 },
    { date: '2026-07-27', score: 78, accuracy: 76, minutes: 15 },
    { date: '2026-07-28', score: 75, accuracy: 74, minutes: 10 },
    { date: '2026-07-29', score: 82, accuracy: 80, minutes: 20 },
    { date: '2026-07-30', score: 86, accuracy: 84, minutes: 25 },
    { date: '2026-07-31', score: 84, accuracy: 82, minutes: 18 },
    { date: '2026-08-01', score: 90, accuracy: 88, minutes: 30 },
  ],
  streak: [
    { date: '2026-07-26', count: 2 },
    { date: '2026-07-27', count: 3 },
    { date: '2026-07-28', count: 1 },
    { date: '2026-07-29', count: 4 },
    { date: '2026-07-30', count: 5 },
    { date: '2026-07-31', count: 3 },
    { date: '2026-08-01', count: 6 },
  ],
};

export const mockHistory = [
  {
    id: 's1',
    date: '2026-08-01T08:30:00Z',
    dateFormatted: 'Today',
    exercise: 'She sells seashells by the seashore',
    category: 'Sibilants (S/SH)',
    overallScore: 88,
    clarity: 90,
    accuracy: 86,
    mistakes: ['SH', 'S'],
    feedback: 'Excellent rhythm! Focus on distinct tongue placement between "S" and "SH" sounds.',
    wordResults: [
      { word: 'She', status: 'correct', score: 95 },
      { word: 'sells', status: 'correct', score: 92 },
      { word: 'seashells', status: 'warning', score: 74 },
      { word: 'by', status: 'correct', score: 98 },
      { word: 'the', status: 'correct', score: 96 },
      { word: 'seashore', status: 'warning', score: 72 },
    ],
  },
  {
    id: 's2',
    date: '2026-07-31T14:15:00Z',
    dateFormatted: 'Yesterday',
    exercise: 'Thirty-three thousand feathers on a thrush',
    category: 'Dental (TH)',
    overallScore: 78,
    clarity: 82,
    accuracy: 74,
    mistakes: ['TH', 'R'],
    feedback: 'Keep your tongue gently behind your front teeth for the "TH" sound.',
    wordResults: [
      { word: 'Thirty-three', status: 'warning', score: 70 },
      { word: 'thousand', status: 'warning', score: 72 },
      { word: 'feathers', status: 'correct', score: 91 },
      { word: 'on', status: 'correct', score: 99 },
      { word: 'a', status: 'correct', score: 99 },
      { word: 'thrush', status: 'error', score: 54 },
    ],
  },
  {
    id: 's3',
    date: '2026-07-30T10:00:00Z',
    dateFormatted: '2 days ago',
    exercise: 'Peter Piper picked a peck of pickled peppers',
    category: 'Plosives (P/B)',
    overallScore: 92,
    clarity: 94,
    accuracy: 90,
    mistakes: ['P'],
    feedback: 'Outstanding breath control and clean explosive consonants!',
    wordResults: [
      { word: 'Peter', status: 'correct', score: 96 },
      { word: 'Piper', status: 'correct', score: 94 },
      { word: 'picked', status: 'correct', score: 90 },
      { word: 'a', status: 'correct', score: 100 },
      { word: 'peck', status: 'correct', score: 88 },
      { word: 'of', status: 'correct', score: 98 },
      { word: 'pickled', status: 'correct', score: 86 },
      { word: 'peppers', status: 'correct', score: 92 },
    ],
  },
];

export const mockUser = {
  id: 'u1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  joinDate: '2026-01-15T00:00:00Z',
};
