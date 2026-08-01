/**
 * Mock implementation of POST /analyze
 * Expected response shape per spec:
 * {
 *   "clarity": 90,
 *   "accuracy": 82,
 *   "mistakes": ["R", "TH"],
 *   "feedback": "Keep tongue behind teeth for TH...",
 *   "wordResults": [ ... ]
 * }
 */
export async function mockAnalyze(targetText, _audioBlob) {
  /* Simulate processing latency for demo realism */
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const words = targetText.split(/\s+/).filter((w) => w.length > 0);

  const wordResults = words.map((word) => {
    /* Random realistic scores */
    const score = Math.floor(Math.random() * 45) + 55; // 55 to 100
    let status = 'correct';
    if (score < 68) status = 'error';
    else if (score < 82) status = 'warning';

    return {
      word: word.replace(/[^a-zA-Z0-9'-]/g, ''),
      score,
      status,
    };
  });

  const avgScore = Math.round(
    wordResults.reduce((acc, curr) => acc + curr.score, 0) / wordResults.length
  );

  const errors = wordResults.filter((w) => w.status === 'error').map((w) => w.word);
  const warnings = wordResults.filter((w) => w.status === 'warning').map((w) => w.word);
  
  /* Extract sound patterns for mistakes */
  const potentialMistakes = ['TH', 'S', 'SH', 'R', 'L', 'P', 'B'];
  const mistakes = Array.from(
    new Set(
      [...errors, ...warnings].map((w) => {
        if (/th/i.test(w)) return 'TH';
        if (/sh/i.test(w)) return 'SH';
        if (/s/i.test(w)) return 'S';
        if (/r/i.test(w)) return 'R';
        if (/l/i.test(w)) return 'L';
        return potentialMistakes[Math.floor(Math.random() * potentialMistakes.length)];
      })
    )
  ).slice(0, 3);

  let feedback = 'Clear articulation and steady pace! Great performance.';
  if (avgScore < 70) {
    feedback = 'Focus on enunciating the end consonants and maintaining a steady vocal airflow.';
  } else if (avgScore < 85) {
    feedback = `Good progress! Keep your tongue relaxed and pay special attention to the ${mistakes.join(' and ')} sound patterns.`;
  }

  return {
    clarity: Math.min(99, Math.max(50, avgScore + 2)),
    accuracy: Math.min(99, Math.max(50, avgScore - 3)),
    mistakes: mistakes.length > 0 ? mistakes : ['S'],
    feedback,
    wordResults,
  };
}
