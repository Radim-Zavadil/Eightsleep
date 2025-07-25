// Calculate a composite sleep score (0-100) based on sleep duration, bedroom score, and journaling entries.
// Sleep duration and bedroom score are high priority (40% each), journaling is low (20%).

export function calculateSleepScore({
  sleepDurationHours, // number
  bedroomScore,       // 0-100
  journalEntries,     // number of entries in period
  periodDays = 7      // days in period (default: 7)
}: {
  sleepDurationHours: number,
  bedroomScore: number,
  journalEntries: number,
  periodDays?: number
}): number {
  // Sleep Duration Score
  let sleepScore = 0;
  if (sleepDurationHours >= 7 && sleepDurationHours <= 9) {
    sleepScore = 100;
  } else if (sleepDurationHours < 4 || sleepDurationHours > 11) {
    sleepScore = 0;
  } else if (sleepDurationHours < 7) {
    sleepScore = ((sleepDurationHours - 4) / (7 - 4)) * 100;
  } else {
    sleepScore = ((11 - sleepDurationHours) / (11 - 9)) * 100;
  }
  sleepScore = Math.max(0, Math.min(100, sleepScore));

  // Bedroom Score (already 0-100)
  const normalizedBedroomScore = Math.max(0, Math.min(100, bedroomScore));

  // Journaling Score
  const targetEntries = periodDays; // 1 per day
  const journalScore = Math.max(0, Math.min(100, (journalEntries / targetEntries) * 100));

  // Weighted sum
  const finalScore =
    sleepScore * 0.4 +
    normalizedBedroomScore * 0.4 +
    journalScore * 0.2;

  return Math.round(finalScore);
} 