#include "plotly_spark.h"
#include "plotly_defines.h"
#include "math.h"
#include "DHT.h"
#include "Adafruit_TSL2561_U.h"

#define TEMPPIN A0
#define MOISTPIN A1
#define DHTPIN D4
#define DHTTYPE DHT22

#define FIVE_MINUTES (5*60*1000)
#define FIFTY_SECONDS (50*1000)

// convert input volage reading to kelvin; 10mV = 1 K
#define ANALOGKELVINCONVERSION 0.08056640625 // (3.3/4096)*100

double Temp = 0.0;
double SoilTemp = 0.0;
double Humidity = 0.0;
double Light = 0.0;
int Moisture = 0;

unsigned long lastloop = 0;
unsigned long heartbeat = 0;

// char Info[64];
char *tokens[TOKENS] = {AIRTEMPTOK, HUMIDTOK, SOILTEMPTOK, MOISTURETOK, LIGHTTOK};
plotly graph = plotly(USERNAME, APITOKEN, tokens, PLOTNAME, TOKENS);
DHT dht(DHTPIN, DHTTYPE);
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_FLOAT, 42);

void setup() {
    // Serial.begin(9600);

    // tsl.setGain(TSL2561_GAIN_1X);      /* No gain ... use in bright light to avoid sensor saturation */
    // tsl.setGain(TSL2561_GAIN_16X);     /* 16x gain ... use in low light to boost sensitivity */
    tsl.enableAutoRange(true);            /* Auto-gain ... switches automatically between 1x and 16x */
    // tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_13MS);      /* fast but low resolution */
    // tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_101MS);  /* medium resolution and speed   */
    tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_402MS);  /* 16-bit data but slowest conversions */

    tsl.begin();
    dht.begin();

    pinMode(MOISTPIN, INPUT);
    pinMode(TEMPPIN, INPUT);
    Spark.variable("Temperature", &Temp, DOUBLE);
    Spark.variable("SoilTemp", &SoilTemp, DOUBLE);
    Spark.variable("Humidity", &Humidity, DOUBLE);
    Spark.variable("Light", &Light, DOUBLE);
    Spark.variable("Moisture", &Moisture, INT);

    graph.fileopt = "extend";
    graph.log_level = 4;
    graph.maxpoints = 288;
    graph.init();
    graph.openStream();
    heartbeat = millis();
}

void loop() {
    unsigned long now = millis();

    if ((now - lastloop) > FIVE_MINUTES){
      sensors_event_t event;

      tsl.getEvent(&event);
      Light = (double)event.light;
      Temp = (double)dht.readTemperature();
      Humidity = (double)dht.readHumidity();
      Moisture = map(analogRead(MOISTPIN), 0, 4096, 0, 330);
      SoilTemp = ((double)analogRead(TEMPPIN) * ANALOGKELVINCONVERSION) - 273.15;

      graph.plot(now, (float)Temp, tokens[0]);
      graph.plot(now, (float)Humidity, tokens[1]);
      graph.plot(now, (float)SoilTemp, tokens[2]);
      graph.plot(now, Moisture, tokens[3]);
      graph.plot(now, (float)Light, tokens[4]);

      lastloop = now;
  }else if((now-heartbeat) > FIFTY_SECONDS){
      graph.heartbeat();
      heartbeat = now;
  }
}
