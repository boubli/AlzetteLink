import { useState, useEffect } from 'react'
import mqtt from 'mqtt'
import SensorChart from './components/SensorChart'
import TemperatureGauge from './components/TemperatureGauge'
import StatusBadge from './components/StatusBadge'
import Logo from './assets/AlzetteLink-logo.png'

// MQTT Broker URL (WebSockets)
// Mosquitto port 9001 is configured for WebSockets in docker-compose
const BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:9001';
const TOPIC = import.meta.env.VITE_MQTT_TOPIC || 'alzette/machine/data';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [sensorData, setSensorData] = useState({ temp: 0, status: 'unknown', counter: 0 });
  const [history, setHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    console.log('Connecting to MQTT...');
    const client = mqtt.connect(BROKER_URL);

    client.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('Connected via WebSockets');
      client.subscribe(TOPIC);
    });

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        setSensorData(payload);
        setLastUpdate(new Date());

        // Add to history for chart
        setHistory(prev => {
          const now = new Date().toLocaleTimeString();
          const newPoint = { time: now, value: payload.temp };
          const newHistory = [...prev, newPoint];
          if (newHistory.length > 20) newHistory.shift(); // Keep last 20 points
          return newHistory;
        });
      } catch (e) {
        console.error('Error parsing JSON', e);
      }
    });

    client.on('error', (err) => {
      console.error('Connection error: ', err);
      setConnectionStatus('Error');
      client.end();
    });

    client.on('close', () => {
      setConnectionStatus('Disconnected');
    });

    return () => {
      if (client) client.end();
    };
  }, []);

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <header className="card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <img src={Logo} alt="AlzetteLink Logo" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AlzetteLink
                </h1>
                <p className="text-slate-500 text-sm">Industrial IoT Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {lastUpdate && (
              <span className="text-xs text-slate-500">
                Last update: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${connectionStatus === 'Connected'
              ? 'bg-green-500/10 text-green-400 border-green-500/30'
              : connectionStatus === 'Connecting...'
                ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
              }`}>
              <span className={`w-2 h-2 rounded-full ${connectionStatus === 'Connected' ? 'bg-green-400' :
                connectionStatus === 'Connecting...' ? 'bg-yellow-400 animate-pulse' : 'bg-red-400'
                }`}></span>
              {connectionStatus}
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Stats */}
          <div className="space-y-6">
            {/* Temperature Gauge Card */}
            <div className="card p-6 flex flex-col items-center">
              <TemperatureGauge value={sensorData.temp} />
            </div>

            {/* Status Card */}
            <div className="card p-6">
              <h3 className="text-slate-500 text-sm font-medium mb-3">Machine Status</h3>
              <StatusBadge status={sensorData.status} />
            </div>

            {/* Counter Card */}
            <div className="card p-6">
              <h3 className="text-slate-500 text-sm font-medium mb-1">Counter</h3>
              <p className="text-4xl font-bold text-slate-100 tabular-nums">
                {sensorData.counter.toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">Total items processed</p>
            </div>
          </div>

          {/* Right Column - Chart */}
          <div className="lg:col-span-2 card p-6">
            <h3 className="text-slate-400 text-sm font-medium mb-4">Temperature History</h3>
            <div className="h-[300px]">
              <SensorChart dataPoints={history} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-600 text-sm py-4">
          <p>AlzetteLink v1.0 • Lycée Technique Luxembourg • Industry 4.0 Educational Platform</p>
        </footer>

      </div>
    </div>
  )
}

export default App
