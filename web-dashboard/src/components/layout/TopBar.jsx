/**
 * TopBar - Header with connection status, stats, and controls
 */
import ExportButton from '../ExportButton';

export default function TopBar({ connectionStatus, totalMessages, deviceCount, onlineCount, exportData }) {
  return (
    <header className="glass-panel border-b border-slate-700/40 sticky top-0 z-40 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Title (mobile only) */}
        <h1 className="md:hidden text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AlzetteLink
        </h1>

        {/* Stats pills */}
        <div className="hidden md:flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full text-sm">
            <div className={`
              w-2.5 h-2.5 rounded-full
              ${connectionStatus === 'Connected'
                ? 'bg-emerald-400 animate-pulse shadow-glow-green'
                : connectionStatus === 'Error'
                ? 'bg-red-400'
                : 'bg-amber-400 animate-pulse'}
            `} />
            <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
              {connectionStatus}
            </span>
          </div>

          {/* Device count */}
          <div className="glass-card px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <circle cx="12" cy="12" r="1" fill="currentColor" />
            </svg>
            <span style={{ color: 'var(--text-secondary)' }}>
              <span className="font-bold text-blue-400">{onlineCount}</span>
              <span className="mx-0.5">/</span>
              <span>{deviceCount}</span>
              <span className="ml-1 hidden lg:inline" style={{ color: 'var(--text-muted)' }}>devices</span>
            </span>
          </div>

          {/* Total messages */}
          <div className="glass-card px-3 py-1.5 rounded-full text-sm flex items-center gap-2">
            <svg className="w-4 h-4" style={{ color: 'var(--text-muted)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span className="font-bold text-blue-400">{totalMessages.toLocaleString()}</span>
            <span className="hidden lg:inline" style={{ color: 'var(--text-muted)' }}>messages</span>
          </div>
        </div>

        {/* Right: Export */}
        <div className="flex items-center gap-3">
          {exportData && (
            <ExportButton data={exportData.data} machineId={exportData.machineId} />
          )}
        </div>
      </div>
    </header>
  );
}
