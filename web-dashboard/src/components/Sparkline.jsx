/**
 * Sparkline - Tiny inline SVG mini-chart
 * No Chart.js dependency — pure SVG polyline
 */
export default function Sparkline({ data = [], color = '#3b82f6', width = 120, height = 32 }) {
  if (data.length < 2) {
    return (
      <svg width={width} height={height} className="opacity-30">
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
      </svg>
    );
  }

  const values = data.map(d => (typeof d === 'number' ? d : d.value || d.temp || 0));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const padding = 2;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Gradient fill path
  const firstX = padding;
  const lastX = ((values.length - 1) / (values.length - 1)) * (width - padding * 2) + padding;
  const fillPoints = `${firstX},${height} ${points} ${lastX},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={fillPoints}
        fill={`url(#spark-fill-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current value dot */}
      {values.length > 0 && (() => {
        const lastVal = values[values.length - 1];
        const cx = lastX;
        const cy = height - padding - ((lastVal - min) / range) * (height - padding * 2);
        return <circle cx={cx} cy={cy} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}
