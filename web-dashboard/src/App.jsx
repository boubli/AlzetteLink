/**
 * AlzetteLink Dashboard v2.0
 * Professional multi-device IoT monitoring platform
 */
import { useState } from 'react';
import { useMqttDevices } from './hooks/useMqttDevices';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import DeviceGrid from './components/DeviceGrid';
import DeviceDetail from './components/DeviceDetail';

function App() {
  const { devices, deviceList, connectionStatus, totalMessages, onlineCount, demoActive, startDemo, stopDemo } = useMqttDevices();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Get selected device for detail view
  const selectedDeviceId = currentPage.startsWith('device/') ? currentPage.slice(7) : null;
  const selectedDevice = selectedDeviceId ? devices.get(selectedDeviceId) : null;

  // Navigation handler
  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleToggleDemo = () => {
    if (demoActive) {
      stopDemo();
      setCurrentPage('dashboard');
    } else {
      startDemo();
    }
  };

  // Export data for TopBar
  const allHistory = deviceList.flatMap(d => d.history);
  const exportData = allHistory.length > 0
    ? { data: allHistory, machineId: 'all-devices' }
    : null;

  // Render the current page
  const renderPage = () => {
    if (selectedDeviceId) {
      return (
        <DeviceDetail
          device={selectedDevice}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
    }

    // Default: dashboard / devices (same view)
    return (
      <DeviceGrid
        devices={deviceList}
        onSelectDevice={(id) => setCurrentPage(`device/${id}`)}
        onStartDemo={!demoActive ? startDemo : undefined}
      />
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--surface-bg)' }}>
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
        demoActive={demoActive}
        onToggleDemo={handleToggleDemo}
      />

      {/* Main area (offset by sidebar width) */}
      <div
        className="transition-all duration-300 ease-in-out pb-20 md:pb-0"
        style={{
          marginLeft: `var(--sidebar-offset, 0px)`,
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            :root {
              --sidebar-offset: ${sidebarCollapsed ? '64px' : '240px'};
            }
          }
          @media (max-width: 767px) {
            :root {
              --sidebar-offset: 0px;
            }
          }
        `}</style>

        {/* Top bar */}
        <TopBar
          connectionStatus={connectionStatus}
          totalMessages={totalMessages}
          deviceCount={deviceList.length}
          onlineCount={onlineCount}
          exportData={exportData}
        />

        {/* Page content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
