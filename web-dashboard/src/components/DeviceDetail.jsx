/**
 * DeviceDetail - Full detail view for a single device
 */
import TemperatureGauge from './TemperatureGauge';
import SensorChart from './SensorChart';
import StatusBadge from './StatusBadge';
import ExportButton from './ExportButton';
import { SkeletonCard, SkeletonChart } from './Skeleton';

function formatLastSeen(lastSeen) {
  if (!lastSeen) return 'Never';
  const diff = Math.floor((Date.now() - lastSeen.getTime()) / 1000);
  if (diff < 5) return 'Just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export default function DeviceDetail({ device, onBack }) {
  if (!device) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonChart />
      </div>
    );
  }

  const { id, data, history, lastSeen, isOnline, color } = device;
  const chartData = [...history].reverse();

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back button + device name */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="glass-card p-2 rounded-xl hover:bg-white/10 transition-colors"
            title="Back to overview"
          >
            <svg className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400 shadow-glow-green' : 'bg-slate-600'}`} />
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {id}
              </h2>
            </div>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {isOnline ? `Online • Last update ${formatLastSeen(lastSeen)}` : `Offline • Last seen ${formatLastSeen(lastSeen)}`}
            </p>
          </div>
        </div>
        <ExportButton data={history} machineId={id} />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gauge Card */}
        <div className="glass-card-gradient p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Temperature
            </h3>
            <StatusBadge status={data?.status} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <TemperatureGauge value={data?.temp || 0} accentColor={color} />
            <div className="text-center sm:text-left">
              <div className="text-5xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
                {data?.temp?.toFixed(1) || '0.0'}
                <span className="text-2xl font-semibold" style={{ color: 'var(--text-muted)' }}>°C</span>
              </div>
              <div className="text-lg font-medium uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {data?.status || 'Unknown'}
              </div>
              {data?.counter !== undefined && (
                <div className="mt-3 glass-card px-3 py-1.5 rounded-full inline-flex items-center gap-2 text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Counter</span>
                  <span className="font-bold" style={{ color }}>{data.counter.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chart Card */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Temperature Trend
            </h3>
            <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Last {history.length} readings
            </div>
          </div>
          <div className="h-72">
            <SensorChart dataPoints={chartData} accentColor={color} />
          </div>
        </div>
      </div>
    </div>
  );
}
