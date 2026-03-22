/**
 * TemperatureGauge Component v2.0
 * Circular SVG gauge with gradient arc and glow effect
 */
export default function TemperatureGauge({ value, min = 0, max = 50, size = 200, accentColor }) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColors = (temp) => {
    if (temp >= 30) return { main: '#ef4444', glow: 'rgba(239, 68, 68, 0.3)', gradient: ['#ef4444', '#f97316'] };
    if (temp >= 25) return { main: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', gradient: ['#f59e0b', '#eab308'] };
    return { main: '#22c55e', glow: 'rgba(34, 197, 94, 0.3)', gradient: ['#22c55e', '#06b6d4'] };
  };

  const colors = getColors(value);
  const primary = accentColor || colors.main;
  const gradientId = `gauge-grad-${primary.replace('#', '')}`;
  const glowId = `gauge-glow-${primary.replace('#', '')}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="transform -rotate-90"
      >
        <defs>
          {/* Gradient for arc */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.gradient[0]} />
            <stop offset="100%" stopColor={colors.gradient[1]} />
          </linearGradient>
          {/* Glow filter */}
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feFlood floodColor={primary} floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--surface-border)"
          strokeWidth="10"
          opacity="0.4"
        />

        {/* Gradient arc with glow */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          filter={`url(#${glowId})`}
          className="transition-all duration-700 ease-out"
        />

        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map(pct => {
          const angle = (pct / 100) * 360 - 90;
          const rad = (angle * Math.PI) / 180;
          const innerR = radius - 16;
          const outerR = radius - 12;
          return (
            <line
              key={pct}
              x1={100 + Math.cos(rad) * innerR}
              y1={100 + Math.sin(rad) * innerR}
              x2={100 + Math.cos(rad) * outerR}
              y2={100 + Math.sin(rad) * outerR}
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
            />
          );
        })}
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>
          {value?.toFixed(1)}
        </div>
        <div className="text-sm uppercase tracking-wide mt-1" style={{ color: 'var(--text-muted)' }}>°C</div>
      </div>
    </div>
  );
}
