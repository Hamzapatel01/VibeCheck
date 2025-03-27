import React from 'react';
import { Line } from 'react-chartjs-2';

const MoodChart = ({ data, options }) => {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <div className="mood-trend">
      <h2>Mood Trend</h2>
      <div className="trend-chart">
        <Line data={data} options={chartOptions} />
      </div>
    </div>
  );
};

export default MoodChart; 