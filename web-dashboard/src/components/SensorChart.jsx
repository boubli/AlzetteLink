/**
 * SensorChart Component v2.0
 * Line chart with annotation lines, accent colors, and gradient fill
 */
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

// Annotation plugin (simple horizontal lines)
const annotationPlugin = {
  id: 'thresholdLines',
  afterDraw(chart) {
    const { ctx } = chart;
    const yAxis = chart.scales.y;
    const xAxis = chart.scales.x;

    const drawLine = (value, color, label) => {
      const y = yAxis.getPixelForValue(value);
      if (y < yAxis.top || y > yAxis.bottom) return;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(xAxis.left, y);
      ctx.lineTo(xAxis.right, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = color;
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(label, xAxis.right - 4, y - 4);
      ctx.restore();
    };

    drawLine(30, 'rgba(239, 68, 68, 0.5)', 'Critical 30°C');
    drawLine(25, 'rgba(245, 158, 11, 0.4)', 'Warning 25°C');
  },
};

ChartJS.register(annotationPlugin);

export default function SensorChart({ dataPoints = [], accentColor = '#3b82f6' }) {
  const labels = dataPoints.map(d => d.time || '');

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 400 },
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
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y?.toFixed(1)}°C`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.2)', drawBorder: false },
        ticks: { color: '#64748b', maxRotation: 0, maxTicksLimit: 8, font: { size: 10 } },
        border: { display: false },
      },
      y: {
        suggestedMin: 15,
        suggestedMax: 35,
        grid: { color: 'rgba(51, 65, 85, 0.2)', drawBorder: false },
        ticks: {
          color: '#64748b',
          callback: (val) => `${val}°`,
          font: { size: 10 },
        },
        border: { display: false },
      },
    },
  };

  const data = {
    labels,
    datasets: [{
      label: 'Temperature (°C)',
      data: dataPoints.map(d => d.value || 0),
      borderColor: accentColor,
      backgroundColor: (ctx) => {
        const gradient = ctx.chart?.ctx?.createLinearGradient(0, 0, 0, ctx.chart.height);
        if (gradient) {
          gradient.addColorStop(0, accentColor + '30');
          gradient.addColorStop(1, accentColor + '00');
          return gradient;
        }
        return accentColor + '15';
      },
      borderWidth: 2.5,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: accentColor,
      pointHoverBorderColor: '#0f172a',
      pointHoverBorderWidth: 2,
      tension: 0.35,
      fill: true,
    }],
  };

  return <Line options={options} data={data} />;
}
