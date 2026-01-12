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

WiFiClient espClient;
PubSubClient client(espClient);

unsigned long lastMsg = 0;
long counter = 0;

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    
    // Attempt to connect
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  randomSeed(micros());
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  unsigned long now = millis();
  // Send data every 2 seconds
  if (now - lastMsg > 2000) {
    lastMsg = now;
    
    // Create Dummy Data
    float temp = 20.0 + (random(150) / 10.0); // 20.0 to 35.0
    counter++;

    // JSON Serialization
    StaticJsonDocument<200> doc;
    doc["temp"] = temp;
    doc["status"] = "running";
    doc["counter"] = counter;

    char buffer[256];
    serializeJson(doc, buffer);

    Serial.print("Publishing message: ");
    Serial.println(buffer);
    
    client.publish(topic_data, buffer);
  }
}
