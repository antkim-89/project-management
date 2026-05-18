import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export function AreaChart() {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // We use custom HTML legend in the parent
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(20, 27, 44, 0.9)',
        titleColor: '#fff',
        bodyColor: '#e2e2e5',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false, // We use custom HTML ticks below
        }
      },
      y: {
        grid: {
          color: 'rgba(114, 119, 134, 0.1)',
          drawTicks: false,
        },
        border: {
          display: false,
        },
        ticks: {
          display: false,
        },
        min: 0,
        max: 200,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  const labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Full-time',
        data: [120, 150, 110, 180, 130, 190],
        borderColor: '#0057c3', // primary
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(0, 87, 195, 0.3)');
          gradient.addColorStop(1, 'rgba(0, 87, 195, 0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 2.5,
        pointBackgroundColor: '#0057c3',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0057c3',
        pointRadius: 0,
        pointHoverRadius: 6,
      },
      {
        fill: true,
        label: 'Contractors',
        data: [50, 60, 45, 80, 55, 95],
        borderColor: '#34d399', // emerald-400
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, 'rgba(52, 211, 153, 0.2)');
          gradient.addColorStop(1, 'rgba(52, 211, 153, 0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 2,
        pointBackgroundColor: '#34d399',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#34d399',
        pointRadius: 0,
        pointHoverRadius: 6,
        borderDash: [5, 5],
      },
    ],
  };

  return <Line options={options} data={data} />;
}
