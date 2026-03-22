/**
 * useMqttDevices Hook
 * Manages MQTT connection and multi-device state.
 * Automatically detects new devices from incoming messages.
 * Supports user-activated demo mode for testing without hardware.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import mqtt from 'mqtt';

const BROKER_URL = import.meta.env.VITE_MQTT_BROKER_URL || 'ws://localhost:9001';
const TOPIC = import.meta.env.VITE_MQTT_TOPIC || 'alzette/machine/data';
const RECONNECT_PERIOD = 5000;
const MAX_HISTORY = 50;
const OFFLINE_TIMEOUT_MS = 10000;

// Device accent colors
const ACCENT_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#f59e0b', '#ec4899', '#10b981'];

// ============================================================
// Demo data generator
// ============================================================
const DEMO_DEVICES = [
  { id: 'esp32-line-A', baseTemp: 23, drift: 4 },
  { id: 'esp32-line-B', baseTemp: 26, drift: 5 },
  { id: 'esp32-pack-01', baseTemp: 21, drift: 3 },
];

function generateDemoHistory(def, idx) {
  const now = new Date();
  const history = [];
  for (let i = 29; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 2000);
    const temp = Math.round((def.baseTemp + Math.sin(i * 0.3 + idx) * def.drift + (Math.random() - 0.5) * 1.5) * 10) / 10;
    const status = temp >= 30 ? 'critical' : temp >= 25 ? 'warning' : 'running';
    history.push({
      temp, status, counter: 1000 + i * 3 + idx * 500, machine_id: def.id,
      time: t.toLocaleTimeString(), value: temp, timestamp: t.toISOString(),
    });
  }
  return history;
}

function generateDemoDevices() {
  const devices = new Map();
  const now = new Date();
  DEMO_DEVICES.forEach((def, idx) => {
    const history = generateDemoHistory(def, idx);
    const latest = history[history.length - 1];
    devices.set(def.id, {
      id: def.id,
      data: { temp: latest.temp, status: latest.status, counter: latest.counter, machine_id: def.id },
      history: [...history].reverse(),
      lastSeen: now,
      isOnline: true,
      color: ACCENT_COLORS[idx % ACCENT_COLORS.length],
    });
  });
  return devices;
}

// ============================================================
// Hook
// ============================================================
export function useMqttDevices() {
  const [devices, setDevices] = useState(new Map());
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [totalMessages, setTotalMessages] = useState(0);
  const [demoActive, setDemoActive] = useState(false);
  const clientRef = useRef(null);
  const colorIndexRef = useRef(0);
  const offlineTimersRef = useRef(new Map());
  const demoIntervalRef = useRef(null);

  const injectDataPoint = useCallback((machineId, payload) => {
    const now = new Date();
    setTotalMessages(prev => prev + 1);

    setDevices(prev => {
      const next = new Map(prev);
      const existing = next.get(machineId);

      const dataPoint = {
        temp: payload.temp, status: payload.status, counter: payload.counter,
        machine_id: machineId, time: now.toLocaleTimeString(),
        value: payload.temp, timestamp: now.toISOString(),
      };

      const history = existing
        ? [dataPoint, ...existing.history].slice(0, MAX_HISTORY)
        : [dataPoint];

      const color = existing?.color || (() => {
        const c = ACCENT_COLORS[colorIndexRef.current % ACCENT_COLORS.length];
        colorIndexRef.current++;
        return c;
      })();

      next.set(machineId, { id: machineId, data: payload, history, lastSeen: now, isOnline: true, color });
      return next;
    });

    if (offlineTimersRef.current.has(machineId)) {
      clearTimeout(offlineTimersRef.current.get(machineId));
    }
    offlineTimersRef.current.set(machineId, setTimeout(() => {
      setDevices(prev => {
        const next = new Map(prev);
        const device = next.get(machineId);
        if (device) next.set(machineId, { ...device, isOnline: false });
        return next;
      });
    }, OFFLINE_TIMEOUT_MS));
  }, []);

  // --- Demo mode controls ---
  const startDemo = useCallback(() => {
    // Stop real MQTT if running
    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }

    // Seed with history
    setDevices(generateDemoDevices());
    setTotalMessages(DEMO_DEVICES.length * 30);
    setConnectionStatus('Demo Mode');
    setDemoActive(true);

    // Tick new data every 2s
    let counters = DEMO_DEVICES.map((_, i) => 1000 + 30 * 3 + i * 500);
    demoIntervalRef.current = setInterval(() => {
      DEMO_DEVICES.forEach((def, idx) => {
        counters[idx]++;
        const temp = Math.round((def.baseTemp + Math.sin(Date.now() / 3000 + idx) * def.drift + (Math.random() - 0.5) * 1.5) * 10) / 10;
        const status = temp >= 30 ? 'critical' : temp >= 25 ? 'warning' : 'running';
        injectDataPoint(def.id, { temp, status, counter: counters[idx], machine_id: def.id });
      });
    }, 2000);
  }, [injectDataPoint]);

  const stopDemo = useCallback(() => {
    if (demoIntervalRef.current) {
      clearInterval(demoIntervalRef.current);
      demoIntervalRef.current = null;
    }
    setDemoActive(false);
    setDevices(new Map());
    setTotalMessages(0);
    setConnectionStatus('Connecting...');
    colorIndexRef.current = 0;

    // Reconnect real MQTT
    const client = mqtt.connect(BROKER_URL, {
      reconnectPeriod: RECONNECT_PERIOD, clean: true, clientId: `dashboard-${Date.now()}`,
    });
    clientRef.current = client;
    client.on('connect', () => { setConnectionStatus('Connected'); client.subscribe(TOPIC, { qos: 0 }); });
    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        injectDataPoint(payload.machine_id || 'unknown', payload);
      } catch (e) { console.error('Failed to parse MQTT message:', e); }
    });
    client.on('error', () => setConnectionStatus('Error'));
    client.on('reconnect', () => setConnectionStatus('Reconnecting...'));
    client.on('offline', () => setConnectionStatus('Offline'));
    client.on('close', () => setConnectionStatus('Disconnected'));
  }, [injectDataPoint]);

  // --- Initial MQTT connection ---
  useEffect(() => {
    const client = mqtt.connect(BROKER_URL, {
      reconnectPeriod: RECONNECT_PERIOD, clean: true, clientId: `dashboard-${Date.now()}`,
    });
    clientRef.current = client;

    client.on('connect', () => { setConnectionStatus('Connected'); client.subscribe(TOPIC, { qos: 0 }); });
    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        injectDataPoint(payload.machine_id || 'unknown', payload);
      } catch (e) { console.error('Failed to parse MQTT message:', e); }
    });
    client.on('error', () => setConnectionStatus('Error'));
    client.on('reconnect', () => setConnectionStatus('Reconnecting...'));
    client.on('offline', () => setConnectionStatus('Offline'));
    client.on('close', () => setConnectionStatus('Disconnected'));

    return () => {
      client.end(true);
      offlineTimersRef.current.forEach(t => clearTimeout(t));
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [injectDataPoint]);

  return {
    devices,
    connectionStatus,
    totalMessages,
    deviceList: Array.from(devices.values()),
    onlineCount: Array.from(devices.values()).filter(d => d.isOnline).length,
    demoActive,
    startDemo,
    stopDemo,
  };
}
