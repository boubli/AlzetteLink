/**
 * StatusBadge Component
 * Displays machine status with color coding
 */
export default function StatusBadge({ status, className = '' }) {
  const getStatusClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'running': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'idle': return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
      case 'error':
      case 'stopped': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const statusClass = getStatusClass(status);

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
      backdrop-blur-sm ${statusClass} ${className}
    `}>
      {status || 'Unknown'}
    </span>
  );
}
