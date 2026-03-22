#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

// --- Configuration ---
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* mqtt_server = "192.168.1.100"; // Address of your PC/Server
const int mqtt_port = 1883;

const char* topic_data = "alzette/machine/data";
const char* machine_id = "esp32-01";

// --- Reconnect settings ---
const int MAX_RECONNECT_ATTEMPTS = 10;
const unsigned long RECONNECT_DELAY_MS = 5000;
const unsigned long PUBLISH_INTERVAL_MS = 2000;

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
long counter = 0;
int reconnectAttempts = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  int wifiTimeout = 30; // 15 seconds max
  while (WiFi.status() != WL_CONNECTED && wifiTimeout > 0) {
    delay(500);
    Serial.print(".");
    wifiTimeout--;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("");
    Serial.println("WiFi connection FAILED - will retry in loop");
  }
}

/**
 * Non-blocking MQTT reconnect with attempt counter.
 * Returns true if connected, false if still trying.
 */
bool tryReconnect() {
  if (client.connected()) {
    reconnectAttempts = 0;
    return true;
  }

  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    Serial.println("Max MQTT reconnect attempts reached. Restarting...");
    ESP.restart();
  }

  reconnectAttempts++;
  Serial.print("Attempting MQTT connection (");
  Serial.print(reconnectAttempts);
  Serial.print("/");
  Serial.print(MAX_RECONNECT_ATTEMPTS);
  Serial.print(")...");

  // Create a random client ID
  String clientId = "ESP32Client-";
  clientId += String(random(0xffff), HEX);

  if (client.connect(clientId.c_str())) {
    Serial.println("connected");
    reconnectAttempts = 0;
    return true;
  } else {
    Serial.print("failed, rc=");
    Serial.print(client.state());
    Serial.println(" - will retry");
    return false;
  }
}

/**
 * Determine machine status based on temperature.
 */
const char* getStatus(float temp) {
  if (temp >= 32.0) return "critical";
  if (temp >= 28.0) return "warning";
  if (counter % 20 == 0) return "idle";
  return "running";
}

void setup() {
  Serial.begin(115200);
  Serial.println();
  Serial.println("=== AlzetteLink ESP32 Firmware v1.1 ===");

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  randomSeed(micros());
}

void loop() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi lost. Reconnecting...");
    setup_wifi();
    return;
  }

  // Non-blocking MQTT reconnect
  if (!client.connected()) {
    if (!tryReconnect()) {
      delay(RECONNECT_DELAY_MS);
      return; // Skip this loop iteration, try again next time
    }
  }
  client.loop();

  unsigned long now = millis();
  // Send data at configured interval
  if (now - lastMsg > PUBLISH_INTERVAL_MS) {
    lastMsg = now;

    // Create sensor data (dummy or from real sensor)
    float temp = 20.0 + (random(150) / 10.0); // 20.0 to 35.0
    counter++;

    const char* status = getStatus(temp);

    // JSON Serialization
    StaticJsonDocument<256> doc;
    doc["machine_id"] = machine_id;
    doc["temp"] = temp;
    doc["status"] = status;
    doc["counter"] = counter;

    char buffer[256];
    serializeJson(doc, buffer);

    Serial.print("Publishing: ");
    Serial.println(buffer);

    client.publish(topic_data, buffer);
  }
}
