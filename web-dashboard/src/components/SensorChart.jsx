import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 500 },
  interaction: { intersect: false, mode: 'index' },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      titleColor: '#f1f5f9',
      bodyColor: '#94a3b8',
      borderColor: 'rgba(51, 65, 85, 0.5)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 8,
    },
  },
  scales: {
    x: {
      grid: { color: 'rgba(51, 65, 85, 0.3)' },
      ticks: { color: '#64748b', maxRotation: 0 }
    },
    y: {
      min: 15,
      max: 35,
      grid: { color: 'rgba(51, 65, 85, 0.3)' },
      ticks: { color: '#64748b' }
    },
  },
};

export default function SensorChart({ dataPoints = [] }) {
  const labels = dataPoints.map(d => d.time || '');
  const data = {
    labels,
    datasets: [{
      label: 'Temperature (°C)',
      data: dataPoints.map(d => d.value || 0),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 8,
      pointHoverBackgroundColor: '#3b82f6',
      pointHoverBorderColor: '#1e293b',
      pointHoverBorderWidth: 2,
      tension: 0.4,
      fill: true,
    }],
  };

  return <Line options={options} data={data} />;
}
