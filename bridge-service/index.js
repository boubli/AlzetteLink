/**
 * AlzetteLink Bridge Service
 *
 * This service connects to an MQTT broker and forwards incoming sensor data
 * to InfluxDB for storage and later analysis.
 *
 * @author Boubli Tech
 * @license MIT
 */

const mqtt = require('mqtt');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
require('dotenv').config();

// ============================================================
// CONFIGURATION
// ============================================================

const config = {
    mqtt: {
        broker: process.env.MQTT_BROKER || 'mqtt://localhost:1883',
        topic: process.env.MQTT_TOPIC || 'alzette/machine/data',
        clientId: `bridge-${Date.now()}`,
        reconnectPeriod: 5000,
    },
    influx: {
        url: process.env.INFLUX_URL || 'http://localhost:8086',
        token: process.env.INFLUX_TOKEN || 'YOUR_INFLUXDB_TOKEN_HERE',
        org: process.env.INFLUX_ORG || 'lycee',
        bucket: process.env.INFLUX_BUCKET || 'sensors',
    },
};

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * Validates incoming sensor data payload
 * @param {Object} data - Parsed JSON payload
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
function validatePayload(data) {
    const errors = [];

    // Temperature is required and must be a number in valid range
    if (typeof data.temp !== 'number') {
        errors.push('Missing or invalid "temp" field (must be a number)');
    } else if (data.temp < -40 || data.temp > 100) {
        errors.push(`Temperature ${data.temp}°C is out of valid range (-40 to 100)`);
    }

    // Status is optional but must be a string if present
    if (data.status !== undefined && typeof data.status !== 'string') {
        errors.push('"status" must be a string');
    }

    // Counter is optional but must be a non-negative integer if present
    if (data.counter !== undefined) {
        if (typeof data.counter !== 'number' || !Number.isInteger(data.counter)) {
            errors.push('"counter" must be an integer');
        } else if (data.counter < 0) {
            errors.push('"counter" cannot be negative');
        }
    }

    return {
        valid: errors.length === 0,
        errors,
    };
}

/**
 * Safely parses JSON with error handling
 * @param {string} str - JSON string to parse
 * @returns {Object|null} - Parsed object or null on error
 */
function safeJsonParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return null;
    }
}

// ============================================================
// STARTUP BANNER
// ============================================================

console.log(`
╔═══════════════════════════════════════════════════════════╗
║           AlzetteLink Bridge Service v1.0                 ║
╚═══════════════════════════════════════════════════════════╝
`);
console.log('📋 Configuration:');
console.log(`   MQTT Broker:  ${config.mqtt.broker}`);
console.log(`   MQTT Topic:   ${config.mqtt.topic}`);
console.log(`   InfluxDB:     ${config.influx.url}`);
console.log(`   Organization: ${config.influx.org}`);
console.log(`   Bucket:       ${config.influx.bucket}`);
console.log('');

// ============================================================
// INFLUXDB SETUP
// ============================================================

const influxDB = new InfluxDB({
    url: config.influx.url,
    token: config.influx.token,
});

const writeApi = influxDB.getWriteApi(config.influx.org, config.influx.bucket);
writeApi.useDefaultTags({ service: 'alzettelink-bridge' });

// ============================================================
// MQTT SETUP
// ============================================================

const mqttClient = mqtt.connect(config.mqtt.broker, {
    clientId: config.mqtt.clientId,
    reconnectPeriod: config.mqtt.reconnectPeriod,
    clean: true,
});

// Track message statistics
let stats = {
    received: 0,
    valid: 0,
    invalid: 0,
    saved: 0,
    errors: 0,
};

mqttClient.on('connect', () => {
    console.log('✅ Connected to MQTT Broker');

    mqttClient.subscribe(config.mqtt.topic, { qos: 1 }, (err) => {
        if (!err) {
            console.log(`✅ Subscribed to topic: ${config.mqtt.topic}`);
            console.log('🎧 Listening for messages...\n');
        } else {
            console.error('❌ Failed to subscribe:', err.message);
            process.exit(1);
        }
    });
});

mqttClient.on('reconnect', () => {
    console.log('🔄 Reconnecting to MQTT Broker...');
});

mqttClient.on('close', () => {
    console.log('🔌 Disconnected from MQTT Broker');
});

mqttClient.on('error', (err) => {
    console.error('❌ MQTT Error:', err.message);
    stats.errors++;
});

// ============================================================
// MESSAGE HANDLING
// ============================================================

mqttClient.on('message', async (topic, message) => {
    stats.received++;
    const payload = message.toString();
    const timestamp = new Date().toISOString();

    console.log(`📩 [${timestamp}] Message on ${topic}`);
    console.log(`   Raw: ${payload.substring(0, 100)}${payload.length > 100 ? '...' : ''}`);

    // Parse JSON
    const data = safeJsonParse(payload);
    if (!data) {
        console.log('   ⚠️ Invalid JSON - skipping');
        stats.invalid++;
        return;
    }

    // Validate payload
    const validation = validatePayload(data);
    if (!validation.valid) {
        console.log(`   ⚠️ Validation failed: ${validation.errors.join(', ')}`);
        stats.invalid++;
        return;
    }

    stats.valid++;

    // Create InfluxDB point
    const point = new Point('machine_telemetry')
        .tag('machine_id', data.machine_id || 'esp32_default')
        .tag('topic', topic)
        .floatField('temperature', data.temp);

    // Add optional fields
    if (data.status) {
        point.stringField('status', data.status);
    }
    if (data.counter !== undefined) {
        point.intField('counter', data.counter);
    }
    if (data.humidity !== undefined) {
        point.floatField('humidity', data.humidity);
    }

    // Write to InfluxDB
    try {
        writeApi.writePoint(point);
        await writeApi.flush();
        stats.saved++;
        console.log('   💾 Saved to InfluxDB');
    } catch (e) {
        stats.errors++;
        console.log(`   ❌ InfluxDB Error: ${e.message}`);
    }
});

// ============================================================
// GRACEFUL SHUTDOWN
// ============================================================

async function shutdown(signal) {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

    // Print final stats
    console.log('\n📊 Session Statistics:');
    console.log(`   Messages Received: ${stats.received}`);
    console.log(`   Valid Messages:    ${stats.valid}`);
    console.log(`   Invalid Messages:  ${stats.invalid}`);
    console.log(`   Saved to DB:       ${stats.saved}`);
    console.log(`   Errors:            ${stats.errors}`);

    // Close connections
    try {
        await writeApi.close();
        console.log('✅ InfluxDB connection closed');
    } catch (e) {
        console.error('⚠️ Error closing InfluxDB:', e.message);
    }

    mqttClient.end(true, () => {
        console.log('✅ MQTT connection closed');
        console.log('👋 Goodbye!\n');
        process.exit(0);
    });

    // Force exit after timeout
    setTimeout(() => {
        console.error('⚠️ Forced exit after timeout');
        process.exit(1);
    }, 5000);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
