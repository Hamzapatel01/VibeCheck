import { format, differenceInDays } from 'date-fns';

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
  if (!moodHistory || moodHistory.length === 0) {
    return {
      streak: 0,
      bestTime: 'Not enough data',
      totalEntries: 0,
      dominantMood: 'No data',
      happyPercentage: '0',
      neutralPercentage: '0',
      sadPercentage: '0'
    };
  }

  // Sort moods by date, most recent first
  const sortedMoods = [...moodHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  // Initialize counters
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const moodCounts = { Happy: 0, Neutral: 0, Sad: 0 };
  const timeDistribution = Array(24).fill(0);
  const moodByHour = Array(24).fill().map(() => ({ count: 0, positiveCount: 0 }));

  // Get today's date at midnight for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate streaks and gather mood statistics
  for (let i = 0; i < sortedMoods.length; i++) {
    const currentDate = new Date(sortedMoods[i].timestamp);
    currentDate.setHours(0, 0, 0, 0);
    
    // Count moods (case-insensitive)
    const moodType = sortedMoods[i].mood?.trim()?.toLowerCase();
    if (moodType === 'happy') moodCounts.Happy++;
    else if (moodType === 'neutral') moodCounts.Neutral++;
    else if (moodType === 'sad') moodCounts.Sad++;

    // Track mood distribution by hour
    const hour = new Date(sortedMoods[i].timestamp).getHours();
    timeDistribution[hour]++;
    moodByHour[hour] = {
      count: moodByHour[hour].count + 1,
      positiveCount: moodByHour[hour].positiveCount + (moodType === 'happy' ? 1 : 0)
    };

    // Calculate current streak (only if includes today or yesterday)
    if (i === 0) {
      const diffDays = Math.floor((today - currentDate) / (1000 * 60 * 60 * 24));
      if (diffDays <= 1) { // Today or yesterday
        currentStreak = 1;
      }
    }

    // Check consecutive days for streaks
    if (i > 0) {
      const prevDate = new Date(sortedMoods[i - 1].timestamp);
      prevDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((prevDate - currentDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
        if (i === 1 && currentStreak === 1) {
          currentStreak++;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak + 1);
        tempStreak = 0;
      }
    }
  }

  // Final check for longest streak
  longestStreak = Math.max(longestStreak, tempStreak + 1, currentStreak);

  // Calculate best time for mood logging
  let bestHour = 0;
  let bestRatio = 0;

  moodByHour.forEach((data, hour) => {
    if (data.count > 0) {
      const ratio = data.positiveCount / data.count;
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestHour = hour;
      }
    }
  });

  // Format best time
  const bestTime = timeDistribution.some(count => count > 0)
    ? `${bestHour}:00`
    : 'Not enough data';

  // Calculate total entries and percentages
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
    streak: longestStreak,
    bestTime,
    totalEntries,
    dominantMood,
    happyPercentage,
    neutralPercentage,
    sadPercentage
  };
};
