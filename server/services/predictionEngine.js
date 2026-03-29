export const getRuleBasedPredictions = (history, action) => {
  const warnings = [];

  if (action.sleepHours != null && action.sleepHours < 5) {
    warnings.push({ type: 'warning', message: 'Sleep < 5 hours detected: Fatigue risk.' });
  }

  if (action.calories != null && action.calories > 2500) {
    warnings.push({ type: 'warning', message: 'Calories > 2500: Potential for weight gain.' });
  }

  if (action.steps != null && action.steps === 0 || action.activity === "none") {
    warnings.push({ type: 'warning', message: 'No activity planned: Increased risk of low stamina.' });
  }

  if (history.report && history.report.ai_analysis && history.report.ai_analysis.keyMetrics) {
    const { sugarLevel } = history.report.ai_analysis.keyMetrics;
    
    if (sugarLevel && sugarLevel > 140 && action.calories && action.calories > 2500) {
      warnings.push({ type: 'danger', message: 'High historical sugar level combined with high calorie intake significantly increases diabetes risk.' });
    }
  }

  return warnings;
};
