/**
 * TemperatureGauge Component
 * Circular SVG gauge with color-coded ranges
 */
export default function TemperatureGauge({ value, min = 0, max = 50, size = 200 }) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = (temp) => {
    if (temp >= 30) return '#ef4444';    // Red - Hot
    if (temp >= 25) return '#f59e0b';    // Yellow - Warm
    return '#22c55e';                    // Green - Normal
  };

  const color = getColor(value);

  return (
    <div className="relative">
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(51, 65, 85, 0.3)"
          strokeWidth="12"
        />

        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          pathLength={1}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-black text-white leading-none">
          {value?.toFixed(1)}
        </div>
        <div className="text-sm text-slate-400 uppercase tracking-wide">°C</div>
      </div>
    </div>
  );
}
