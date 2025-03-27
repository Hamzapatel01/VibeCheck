import { format } from 'date-fns';

export const moodToScore = (mood) => {
  switch (mood) {
    case "Happy": return 3;
    case "Neutral": return 2;
    case "Sad": return 1;
    default: return 0;
  }
};

export const formatTimestamp = (timestamp) => {
  return format(new Date(timestamp), 'MMM d, yyyy');
};

export const getMoodInsights = (moodHistory) => {
  if (moodHistory.length === 0) {
    return {
      totalEntries: 0,
      dominantMood: 'No data',
      happyPercentage: '0',
      neutralPercentage: '0',
      sadPercentage: '0'
    };
  }

  const moodCounts = { Happy: 0, Neutral: 0, Sad: 0 };

  // Count moods
  for (let i = 0; i < moodHistory.length; i++) {
    const moodType = moodHistory[i].mood?.trim()?.toLowerCase();
    if (moodType === 'happy') moodCounts.Happy++;
    else if (moodType === 'neutral') moodCounts.Neutral++;
    else if (moodType === 'sad') moodCounts.Sad++;
  }

  // Calculate total entries
  const totalEntries = moodCounts.Happy + moodCounts.Neutral + moodCounts.Sad;

  // Calculate percentages with safe division and string conversion
  const calculatePercentage = (count) => {
    if (totalEntries === 0) return '0';
    return ((count / totalEntries) * 100).toFixed(1);
  };

  const happyPercentage = calculatePercentage(moodCounts.Happy);
  const neutralPercentage = calculatePercentage(moodCounts.Neutral);
  const sadPercentage = calculatePercentage(moodCounts.Sad);

  // Find dominant mood
  let dominantMood = 'No data';
  if (totalEntries > 0) {
    if (moodCounts.Happy > moodCounts.Neutral && moodCounts.Happy > moodCounts.Sad) {
      dominantMood = 'Happy';
    } else if (moodCounts.Neutral > moodCounts.Happy && moodCounts.Neutral > moodCounts.Sad) {
      dominantMood = 'Neutral';
    } else if (moodCounts.Sad > moodCounts.Happy && moodCounts.Sad > moodCounts.Neutral) {
      dominantMood = 'Sad';
    } else {
      dominantMood = 'Mixed';  // In case of ties
    }
  }

  return {
    totalEntries,
    dominantMood,
    happyPercentage,
    neutralPercentage,
    sadPercentage
  };
};
