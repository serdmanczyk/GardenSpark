#include "plotly_spark.h"
#include "math.h"
#include "DHT.h"
#include "Adafruit_TSL2561_U.h"

#define TEMPPIN A0
#define MOISTPIN A1
#define DHTPIN D4
#define DHTTYPE DHT22
#define n_tokens 5
#define ANALOGKELVINCONVERSION 0.08056640625 // (3.3/4096)*100

double Temp = 0.0;
double SoilTemp = 0.0;
double Humidity = 0.0;
double Light = 0.0;
int Moisture = 0;

unsigned long lastloop = 0;

// char Info[64];
char *tokens[n_tokens] = {AIRTEMPTOK, HUMIDTOK, SOILTEMPTOK, MOISTURETOK, LIGHTTOK};
plotly graph = plotly(USERNAME, APITOKEN, tokens, PLOTNAME, n_tokens);
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
    Spark.variable("SoilTemperature", &SoilTemp, DOUBLE);
    Spark.variable("Humidity", &Humidity, DOUBLE);
    Spark.variable("Light", &Light, DOUBLE);
    Spark.variable("Moisture", &Moisture, INT);

    graph.fileopt = "extend";
    graph.log_level = 4;
    graph.maxpoints = 2880;
    graph.init();
    graph.openStream();
}

void loop() {
    unsigned long now = millis();

    if ((now - lastloop) > 30000){
      sensors_event_t event;

      tsl.getEvent(&event);
      Light = (double)event.light;
      Temp = (double)dht.readTemperature();
      Humidity = (double)dht.readHumidity();
      Moisture = map(analogRead(MOISTPIN), 0, 4096, 0, 330);
      SoilTemp = ((double)analogRead(TEMPPIN) * ANALOGKELVINCONVERSION) - 273.15;

      // sprintf(Info, "Temperature=%.2fC", Temp);
      // Serial.println(Info);
      //
      // sprintf(Info, "Soil Temperature=%.2fC", SoilTemp);
      // Serial.println(Info);
      //
      // sprintf(Info, "Humidity=%.2f%%", Humidity);
      // Serial.println(Info);
      //
      // sprintf(Info, "Light=%.2f Lux", Light);
      // Serial.println(Info);
      //
      // sprintf(Info, "Moisture=%d", Moisture);
      // Serial.println(Info);

      graph.plot(now, (float)Temp, tokens[0]);
      graph.plot(now, (float)Humidity, tokens[1]);
      graph.plot(now, (float)SoilTemp, tokens[2]);
      graph.plot(now, Moisture, tokens[3]);
      graph.plot(now, (float)Light, tokens[4]);

      // sprintf(Info, "Elapsed=%d", millis()-start);
      // Serial.println(Info);
      lastloop = now;
    }
}
