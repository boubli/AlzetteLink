/**
 * Sidebar - Collapsible navigation with glassmorphism
 */
import { useTheme } from '../../context/ThemeContext';
import Logo from '../../assets/AlzetteLink-logo.png';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'devices', label: 'Devices', icon: DevicesIcon },
];

function DashboardIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function DevicesIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 18v3" />
      <path d="M8 21h8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function SunIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

export default function Sidebar({ currentPage, onNavigate, collapsed, onToggleCollapse, demoActive, onToggleDemo }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`
          hidden md:flex flex-col glass-sidebar fixed left-0 top-0 h-full z-50
          transition-all duration-300 ease-in-out
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center justify-center px-3 py-4 border-b border-slate-700/40 ${collapsed ? 'px-2' : 'px-4'}`}>
          <img
            src={Logo}
            alt="AlzetteLink"
            className={`sidebar-logo ${collapsed ? 'w-10' : 'w-36'} h-auto transition-all duration-300`}
          />
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(item => {
            const isActive = currentPage === item.id || (item.id === 'dashboard' && currentPage.startsWith('device/'));
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200 group
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive
                    ? 'bg-blue-500/15 text-blue-400 shadow-glow-blue'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {!collapsed && <span className="animate-fade-in">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom controls */}
        <div className="px-2 py-4 border-t border-slate-700/40 space-y-2">
          {/* Demo mode toggle */}
          <button
            onClick={onToggleDemo}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${collapsed ? 'justify-center' : ''} ${
              demoActive
                ? 'bg-amber-500/15 text-amber-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            title={demoActive ? 'Stop Demo' : 'Demo Mode'}
          >
            {demoActive ? (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
            )}
            {!collapsed && <span className="animate-fade-in">{demoActive ? 'Stop Demo' : 'Demo Mode'}</span>}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
            title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
          >
            {theme === 'dark'
              ? <SunIcon className="w-5 h-5 flex-shrink-0" />
              : <MoonIcon className="w-5 h-5 flex-shrink-0" />
            }
            {!collapsed && <span className="animate-fade-in">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <svg className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
            </svg>
            {!collapsed && <span className="animate-fade-in">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-slate-700/40">
        <div className="flex justify-around items-center py-2 px-4">
          {NAV_ITEMS.map(item => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all
                  ${isActive ? 'text-blue-400' : 'text-slate-500'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
          <button onClick={onToggleDemo} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl ${demoActive ? 'text-amber-400' : 'text-slate-500'}`}>
            {demoActive ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
            )}
            <span className="text-xs font-medium">Demo</span>
          </button>
          <button onClick={toggleTheme} className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl text-slate-500">
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            <span className="text-xs font-medium">Theme</span>
          </button>
        </div>
      </nav>
    </>
  );
}
