export async function mockAnalyze(targetText, audioBlob) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const words = targetText.split(/\s+/).filter(w => w.length > 0);
  
  const wordResults = words.map(word => {
    // Generate random score between 40 and 100
    const score = Math.floor(Math.random() * 61) + 40;
    
    let status = 'correct';
    if (score < 60) status = 'error';
    else if (score < 80) status = 'warning';
    
    return {
      word,
      score,
      status
    };
  });
  
  // Calculate aggregate metrics
  const avgScore = wordResults.reduce((sum, w) => sum + w.score, 0) / words.length;
  
  const errors = wordResults.filter(w => w.status === 'error').map(w => w.word);
  const warnings = wordResults.filter(w => w.status === 'warning').map(w => w.word);
  const mistakes = [...errors, ...warnings].slice(0, 3);
  
  let feedback = 'Excellent pronunciation! Keep up the great work.';
  if (avgScore < 60) {
    feedback = 'Needs improvement. Focus on enunciating each syllable clearly.';
  } else if (avgScore < 80) {
    feedback = `Good effort. Pay special attention to words like: ${mistakes.join(', ')}.`;
  }
  
  return {
    clarity: Math.round(avgScore),
    accuracy: Math.round(Math.min(100, avgScore + 5)),
    overall: Math.round(avgScore),
    wordResults,
    mistakes,
    feedback
  };
}
