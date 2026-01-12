/**
 * StatusBadge Component
 * 
 * Displays the machine status with appropriate color coding.
 */

export default function StatusBadge({ status }) {
    const getStatusClass = (s) => {
        switch (s?.toLowerCase()) {
            case 'running':
                return 'status-running';
            case 'warning':
                return 'status-warning';
            case 'idle':
                return 'status-idle';
            case 'error':
            case 'stopped':
                return 'status-error';
            default:
                return 'status-idle';
        }
    };

    return (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wide ${getStatusClass(status)}`}>
            <span className="relative flex h-2 w-2">
                {status === 'running' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${status === 'running' ? 'bg-green-400' : status === 'warning' ? 'bg-yellow-400' : 'bg-slate-400'}`}></span>
            </span>
            {status || 'Unknown'}
        </span>
    );
}
