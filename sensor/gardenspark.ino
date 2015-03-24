#include "math.h"
#include "defines.h"
#include "DHT.h"
#include "Adafruit_TSL2561_U.h"

unsigned long timesync = 0;
unsigned long lastloop = 0;

DHT dht(DHTPIN, DHTTYPE);
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_FLOAT, 42);

void setup() {
    tsl.enableAutoRange(true);            /* Auto-gain ... switches automatically between 1x and 16x */
    tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_402MS);  /* 16-bit data but slowest conversions */
    tsl.begin();
    dht.begin();

    pinMode(MOISTPIN, INPUT);
    pinMode(TEMPPIN, INPUT);

    timesync = millis();
}

void loop() {
    unsigned long now = millis();

    if ((now - lastloop) > TEN_SECONDS){
        sensors_event_t event;
        char data[42];
        double AirTemp = 0.0;
        double SoilTemp = 0.0;
        double Humidity = 0.0;
        double Light = 0.0;
        double Moisture = 0;

        tsl.getEvent(&event);
        Light = (double)event.light;
        AirTemp = (double)dht.readTemperature();
        Humidity = (double)dht.readHumidity();
        Moisture = ((double)map(analogRead(MOISTPIN), 0, 4096, 0, 330) / 100);  // convert to voltage
        // SoilTemp = ((double)analogRead(TEMPPIN) * ANALOGKELVINCONVERSION) + KELVINCELSIUSCONVERSION;
        SoilTemp = ((double)map(analogRead(TEMPPIN), 0, 4096, 0, 330) - 273.15);

        sprintf(data, "[%03.03f,%03.03f,%03.03f,%03.03f,%03.03f]", AirTemp, SoilTemp, Humidity, Moisture, Light);
        Spark.publish("Readings", data, 300, PRIVATE);

        lastloop = now;
    }else if ((now - timesync) > HALF_A_DAY){
        Spark.syncTime();
        timesync = now;
    }
}
