import { moodToScore } from './moodUtils';

export const getChartData = (moodHistory, formatTimestamp) => {
  // Sort mood history by timestamp
  const sortedHistory = [...moodHistory].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  return {
    labels: sortedHistory.length > 0 
      ? sortedHistory.map((entry) => formatTimestamp(entry.timestamp)) 
      : ["No data"],
    datasets: [{
      label: "Mood Tracker",
      data: sortedHistory.length > 0 
        ? sortedHistory.map((entry) => moodToScore(entry.mood)) 
        : [0],
      borderColor: "rgba(75,192,192,1)",
      backgroundColor: "rgba(75,192,192,0.2)",
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "rgba(75,192,192,1)",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
    }],
  };
};

export const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function(context) {
          const score = context.raw;
          let mood = "Unknown";
          if (score === 3) mood = "Happy";
          else if (score === 2) mood = "Neutral";
          else if (score === 1) mood = "Sad";
          return `Mood: ${mood}`;
        }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 3,
      ticks: {
        stepSize: 1,
        callback: function(value) {
          if (value === 3) return "Happy";
          if (value === 2) return "Neutral";
          if (value === 1) return "Sad";
          return "";
        }
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        maxRotation: 45,
        minRotation: 45
      }
    }
  }
}; 