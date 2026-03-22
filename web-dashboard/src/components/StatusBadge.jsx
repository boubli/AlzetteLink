/**
 * StatusBadge Component v2.0
 * Displays machine status with color coding and dot indicator
 */
export default function StatusBadge({ status, className = '', size = 'md' }) {
  const getStatusConfig = (s) => {
    switch (s?.toLowerCase()) {
      case 'running': return { classes: 'bg-green-500/15 text-green-400 border-green-500/30', dot: 'bg-green-400' };
      case 'warning': return { classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30', dot: 'bg-yellow-400' };
      case 'critical': return { classes: 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse', dot: 'bg-red-400' };
      case 'idle': return { classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30', dot: 'bg-slate-400' };
      case 'error':
      case 'stopped': return { classes: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' };
      default: return { classes: 'bg-slate-500/15 text-slate-400 border-slate-500/30', dot: 'bg-slate-500' };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium border
      backdrop-blur-sm transition-all ${config.classes} ${sizeClasses} ${className}
    `}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status || 'Unknown'}
    </span>
  );
}
