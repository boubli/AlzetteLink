/**
 * DeviceCard - Glassmorphism card for each device
 * Shows name, temp, status, sparkline, online/offline indicator
 */
import StatusBadge from './StatusBadge';
import Sparkline from './Sparkline';

function formatLastSeen(lastSeen) {
  if (!lastSeen) return 'Never';
  const diff = Math.floor((Date.now() - lastSeen.getTime()) / 1000);
  if (diff < 5) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function DeviceCard({ device, onClick }) {
  const { id, data, history, lastSeen, isOnline, color } = device;
  const temp = data?.temp?.toFixed(1) || '0.0';
  const sparkData = [...history].reverse().slice(-20);

  return (
    <button
      onClick={onClick}
      className="glass-card p-5 text-left w-full group cursor-pointer animate-fade-in"
      style={{ '--accent': color }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {/* Online indicator */}
          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all ${
            isOnline
              ? 'bg-emerald-400 shadow-glow-green'
              : 'bg-slate-600'
          }`} />
          <span className="font-semibold text-sm truncate" style={{ color: 'var(--text-primary)' }}>
            {id}
          </span>
        </div>
        <StatusBadge status={data?.status} size="sm" />
      </div>

      {/* Body */}
      <div className="flex items-end justify-between gap-4">
        {/* Temperature */}
        <div>
          <div className="text-3xl font-black" style={{ color: color }}>
            {temp}
            <span className="text-lg font-semibold" style={{ color: 'var(--text-muted)' }}>°C</span>
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            {isOnline ? formatLastSeen(lastSeen) : 'Offline'}
          </div>
        </div>

        {/* Sparkline */}
        <div className="opacity-80 group-hover:opacity-100 transition-opacity">
          <Sparkline data={sparkData} color={color} width={100} height={28} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="mt-4 h-0.5 rounded-full opacity-40 group-hover:opacity-80 transition-opacity"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }}
      />
    </button>
  );
}
