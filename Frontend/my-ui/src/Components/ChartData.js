import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns'; // Import the date adapter

const ChartData = ({ data }) => {
  const [chart, setChart] = useState(null);

  useEffect(() => {
    if (!chart) {
      const ctx = document.getElementById('myChart');
      const newChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.ts),
          datasets: [{
            label: 'Machine Status',
            data: data.map(item => item.machine_status),
            borderColor: 'rgba(255, 206, 86, 1)', // yellow for 0
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            tension: 0.4,
            fill: true,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'HH:mm',
                },
              },
              ticks: {
                source: 'auto',
                maxRotation: 0,
                autoSkip: true,
              },
            },
            y: {
              min: 0,
              max: 1,
              ticks: {
                stepSize: 1,
                callback: value => (value === 0 ? '0' : '1'),
              },
            },
          },
        },
      });
      setChart(newChart);
    } else {
      // Destroy existing chart instance
      chart.destroy();
      // Create new chart instance with updated data
      const ctx = document.getElementById('myChart');
      const updatedChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.map(item => item.ts),
          datasets: [{
            label: 'Machine Status',
            data: data.map(item => item.machine_status),
            borderColor: 'rgba(255, 206, 86, 1)', // yellow for 0
            backgroundColor: 'rgba(255, 206, 86, 0.2)',
            tension: 0.4,
            fill: true,
          }],
        },
        options: {
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'hour',
                displayFormats: {
                  hour: 'HH:mm',
                },
              },
              ticks: {
                source: 'auto',
                maxRotation: 0,
                autoSkip: true,
              },
            },
            y: {
              min: 0,
              max: 1,
              ticks: {
                stepSize: 1,
                callback: value => (value === 0 ? '0' : '1'),
              },
            },
          },
        },
      });
      setChart(updatedChart);
    }
  }, [data, chart]);

  return (
    <div className="chart-container">
      <canvas id="myChart" width={800} height={400} />
    </div>
  );
};

export default ChartData;
