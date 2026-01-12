/**
 * TemperatureGauge Component
 * 
 * A circular SVG gauge that displays temperature with color-coded ranges.
 * Green: Normal (<25°C), Yellow: Warm (25-30°C), Red: Hot (>30°C)
 */

export default function TemperatureGauge({ value, min = 0, max = 50 }) {
    // Calculate percentage
    const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    // SVG parameters
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Color based on temperature
    const getColor = (temp) => {
        if (temp >= 30) return '#ef4444'; // Red
        if (temp >= 25) return '#f59e0b'; // Yellow
        return '#22c55e'; // Green
    };

    const color = getColor(value);

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-slate-700"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="gauge-circle transition-all duration-500"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color }}>
                        {value.toFixed(1)}
                    </span>
                    <span className="text-sm text-slate-400">°C</span>
                </div>
            </div>
            <span className="mt-2 text-sm text-slate-400">Temperature</span>
        </div>
    );
}
