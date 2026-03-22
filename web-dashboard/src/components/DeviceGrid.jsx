/**
 * DeviceGrid - Overview page showing all devices
 */
import DeviceCard from './DeviceCard';
import { SkeletonDeviceGrid } from './Skeleton';

export default function DeviceGrid({ devices, onSelectDevice, onStartDemo }) {
  const onlineDevices = devices.filter(d => d.isOnline);
  const offlineDevices = devices.filter(d => !d.isOnline);
  const avgTemp = devices.length > 0
    ? (devices.reduce((sum, d) => sum + (d.data?.temp || 0), 0) / devices.length).toFixed(1)
    : '—';

  // Show skeleton while no devices connected
  if (devices.length === 0) {
    return (
      <div className="animate-fade-in">
        {/* Summary stats placeholder */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Device Overview
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Waiting for devices to connect...
          </p>
        </div>
        <SkeletonDeviceGrid />

        {/* Try Demo CTA */}
        {onStartDemo && (
          <div className="mt-8 text-center">
            <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>
              No ESP32? Try the dashboard with simulated data
            </p>
            <button
              onClick={onStartDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
              Try Demo Mode
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Summary stats */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Device Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatPill label="Total Devices" value={devices.length} color="#3b82f6" />
          <StatPill label="Online" value={onlineDevices.length} color="#22c55e" />
          <StatPill label="Offline" value={offlineDevices.length} color="#64748b" />
          <StatPill label="Avg Temp" value={`${avgTemp}°C`} color="#f59e0b" />
        </div>
      </div>

      {/* Device grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {devices.map(device => (
          <DeviceCard
            key={device.id}
            device={device}
            onClick={() => onSelectDevice(device.id)}
          />
        ))}
      </div>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div className="glass-card px-4 py-3 rounded-xl">
      <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-2xl font-black" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
