import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function CircularProgressChart() {
  const data = {
    labels: ['Completed', 'Remaining'],
    datasets: [
      {
        data: [85, 15],
        backgroundColor: [
          '#0057c3', // primary
          'rgba(114, 119, 134, 0.1)' // outline-variant/10
        ],
        borderWidth: 0,
        circumference: 360,
        rotation: 270,
        cutout: '85%',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: '85%',
  };

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-display-lg font-bold text-on-surface">
          85%
        </span>
        <span className="text-label-caps text-on-surface-variant font-bold uppercase tracking-widest">
          Efficiency
        </span>
      </div>
    </div>
  );
}
