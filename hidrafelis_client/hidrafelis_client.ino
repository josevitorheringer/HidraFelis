
#include "ESP8266WiFi.h"
#include <PubSubClient.h>
#include "AESLib.h"

const char* ssid = "";
const char* password = "";
const char* BROKER_MQTT = "";
int BROKER_PORT = 1883;

#define POWER_PIN  D7
#define SIGNAL_PIN A0

int value = 0;
char cstr[16];

WiFiClient espClient;
PubSubClient MQTT(espClient); 

#define TOPIC "hidrafelis"

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i=0;i<length;i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

void setup(void)
{ 
  Serial.begin(9600);
  WiFi.begin(ssid, password);
  pinMode(POWER_PIN, OUTPUT); 
  digitalWrite(POWER_PIN, LOW);

  while (WiFi.status() != WL_CONNECTED) {
     delay(500);
     Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println(WiFi.localIP());

  MQTT.setServer(BROKER_MQTT, BROKER_PORT);
  MQTT.setCallback(callback);
}

int getSensorValue() {
      digitalWrite(POWER_PIN, HIGH);
      delay(100);                     
      value = analogRead(SIGNAL_PIN);
      digitalWrite(POWER_PIN, LOW);

      return value;
}

void loop() {
  int finalValue = getSensorValue();

  for (int i = 0; i < 10; i++) {            
      value = getSensorValue();

      finalValue = (finalValue + value) / 2;
  }

  if (MQTT.connect("hidrafelis_client")) {
      Serial.print("Sensor value: ");
      Serial.println(finalValue);

      MQTT.publish(TOPIC, itoa(finalValue, cstr, 10));
  }


  delay(15 * 60 * 1000);
}
