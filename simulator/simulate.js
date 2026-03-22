/**
 * AlzetteLink Simulator
 * 
 * This script simulates an ESP32 device by publishing fake sensor data
 * to the MQTT broker. Use this to test the dashboard without real hardware.
 * 
 * Usage:
 *   cd simulator
 *   npm install
 *   node simulate.js
 * 
 * Environment variables:
 *   MQTT_BROKER  - Broker URL (default: mqtt://localhost:1883)
 *   MACHINE_ID   - Machine identifier (default: sim-esp32-01)
 */

const mqtt = require('mqtt');

// Configuration
const BROKER_URL = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const TOPIC = 'alzette/machine/data';
const MACHINE_ID = process.env.MACHINE_ID || 'sim-esp32-01';
const INTERVAL_MS = 2000; // Send data every 2 seconds

console.log('🔌 AlzetteLink Simulator');
console.log(`📡 Connecting to: ${BROKER_URL}`);
console.log(`📨 Publishing to: ${TOPIC}`);
console.log(`🏷️  Machine ID:    ${MACHINE_ID}`);
console.log('---');

const client = mqtt.connect(BROKER_URL);

let counter = 0;
let baseTemp = 22;

client.on('connect', () => {
    console.log('✅ Connected to MQTT Broker!');
    console.log(`⏱️  Sending data every ${INTERVAL_MS / 1000} seconds...`);
    console.log('Press Ctrl+C to stop.\n');

    setInterval(() => {
        counter++;

        // Simulate temperature fluctuation (sine wave + noise)
        const tempVariation = Math.sin(counter * 0.1) * 5;
        const noise = (Math.random() - 0.5) * 2;
        const temp = baseTemp + tempVariation + noise;

        // Simulate status changes based on temperature
        let status = 'running';
        if (counter % 20 === 0) {
            status = 'idle';
        } else if (temp > 28) {
            status = 'warning';
        } else if (temp > 32) {
            status = 'critical';
        }

        const payload = {
            machine_id: MACHINE_ID,
            temp: parseFloat(temp.toFixed(2)),
            status: status,
            counter: counter
        };

        const message = JSON.stringify(payload);
        client.publish(TOPIC, message);

        console.log(`📤 [${new Date().toLocaleTimeString()}] ${message}`);
    }, INTERVAL_MS);
});

client.on('error', (err) => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n👋 Simulator stopped.');
    client.end();
    process.exit(0);
});
