import { useState, useEffect } from 'react'
import mqtt from 'mqtt'
import SensorChart from './components/SensorChart'
import TemperatureGauge from './components/TemperatureGauge'
import StatusBadge from './components/StatusBadge'
import ExportButton from './components/ExportButton'
import Logo from './assets/AlzetteLink-logo.png'

// MQTT Broker configuration
const BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:9001'
const TOPIC = import.meta.env.VITE_MQTT_TOPIC || 'alzette/machine/data'

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [sensorData, setSensorData] = useState({ temp: 0, status: 'unknown', counter: 0 })
  const [history, setHistory] = useState([])
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    console.log('Connecting to MQTT broker...')

    const client = mqtt.connect(BROKER_URL)

    client.on('connect', () => {
      setConnectionStatus('Connected')
      console.log('âœ… Connected via WebSockets to', TOPIC)
      client.subscribe(TOPIC)
    })

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString())
        setSensorData(payload)
        setLastUpdate(new Date())

        // Update history for charts and export functionality
        setHistory(prev => {
          const newPoint = {
            temp: payload.temp,
            status: payload.status,
            counter: payload.counter,
            time: new Date().toLocaleTimeString(),   // For SensorChart
            value: payload.temp,                      // For SensorChart
            timestamp: new Date().toISOString()       // For Export
          }
          const newHistory = [newPoint, ...prev]
          // Keep only last 50 points for performance
          return newHistory.slice(0, 50)
        })
      } catch (e) {
        console.error('Failed to parse MQTT message:', e)
      }
    })

    client.on('error', (err) => {
      console.error('MQTT connection error:', err)
      setConnectionStatus('Error')
      client.end()
    })

    client.on('close', () => {
      setConnectionStatus('Disconnected')
      console.log('MQTT connection closed')
    })

    // Cleanup on unmount
    return () => {
      if (client) {
        client.end()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Sticky Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <img src={Logo} alt="AlzetteLink Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  AlzetteLink
                </h1>
                <p className="text-sm text-slate-400">Industrial IoT Dashboard</p>
              </div>
            </div>

            {/* Controls and Stats */}
            <div className="flex items-center space-x-6">
              {/* Connection Status Indicator */}
              <div className="flex items-center space-x-2">
                <div className={`
                  w-3 h-3 rounded-full ring-2 ring-inset
                  ${connectionStatus === 'Connected'
                    ? 'bg-emerald-400 ring-emerald-400/30 animate-pulse'
                    : connectionStatus === 'Error'
                    ? 'bg-red-400 ring-red-400/30'
                    : 'bg-amber-400 ring-amber-400/30'}
                `} />
                <span className="text-sm font-medium capitalize text-slate-300">
                  {connectionStatus}
                </span>
              </div>

              {/* Data Counter */}
              <div className="text-right">
                <div className="text-2xl font-black text-blue-400">
                  {sensorData.counter?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">
                  Messages processed
                </div>
              </div>

              {/* Export Button */}
              <ExportButton
                data={history}
                machineId="machine-01"
              />

              {/* Last Update Time */}
              {lastUpdate && (
                <div className="text-xs text-slate-500 font-mono">
                  {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {/* Temperature Gauge Card */}
          <div className="lg:col-span-2 xl:col-span-2">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Temperature Monitor</h2>
                <StatusBadge status={sensorData.status} />
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
                <TemperatureGauge value={sensorData.temp || 0} />
                <div className="text-center md:text-left">
                  <div className="text-6xl font-black text-white mb-2">
                    {sensorData.temp?.toFixed(1) || '0.0'}Â°C
                  </div>
                  <div className="text-slate-400 text-lg font-medium">
                    {sensorData.status?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Chart Card */}
          <div className="xl:col-span-2">
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Live Temperature Trend</h2>
                <div className="text-sm text-slate-400">
                  Last {history.length} readings
                </div>
              </div>
              <div className="h-80">
                <SensorChart dataPoints={history || []} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
