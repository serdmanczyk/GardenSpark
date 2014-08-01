#include "plotly_spark.h"
#include "plotly_defines.h"
#include "math.h"
#include "DHT.h"
#include "Adafruit_TSL2561_U.h"

#define TEMPPIN A0
#define MOISTPIN A1
#define DHTPIN D4
#define DHTTYPE DHT22

#define HALF_A_DAY (12*60*60*1000)
#define FIVE_MINUTES (5*60*1000)
#define ONE_MINUTE (60*1000)
#define TEN_SECONDS (10*1000)
#define ONE_SECOND (1000)
#define FIFTY_SECONDS (50*1000)

// convert input volage reading to kelvin; 10mV = 1K
#define ANALOGKELVINCONVERSION (0.08056640625) // (3.3/4096)*100
#define KELVINCELSIUSCONVERSION (-273.15)

double AirTemp = 0.0;
double SoilTemp = 0.0;
double Humidity = 0.0;
double Light = 0.0;
double Moisture = 0;

unsigned long timesync = 0;
unsigned long lastloop = 0;
unsigned long heartbeat = 0;

char *tokens[TOKENS] = {AIRTEMPTOK, HUMIDTOK, SOILTEMPTOK, MOISTURETOK, LIGHTTOK};
plotly graph = plotly(USERNAME, APITOKEN, tokens, PLOTNAME, TOKENS);
DHT dht(DHTPIN, DHTTYPE);
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_FLOAT, 42);

void setup() {
    tsl.enableAutoRange(true);            /* Auto-gain ... switches automatically between 1x and 16x */
    tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_402MS);  /* 16-bit data but slowest conversions */

    tsl.begin();
    dht.begin();

    pinMode(MOISTPIN, INPUT);
    pinMode(TEMPPIN, INPUT);

    graph.fileopt = "extend";
    graph.log_level = 4;
    graph.maxpoints = 288;
    graph.init();
    graph.openStream();

    timesync = heartbeat = millis();
}

void loop() {
    unsigned long now = millis();

    if ((now - lastloop) > ONE_MINUTE){
        sensors_event_t event;
        char data[18];

        tsl.getEvent(&event);
        Light = (double)event.light;
        AirTemp = (double)dht.readTemperature();
        Humidity = (double)dht.readHumidity();
        Moisture = ((double)map(analogRead(MOISTPIN), 0, 4096, 0, 330) / 100);  // convert to voltage
        SoilTemp = ((double)analogRead(TEMPPIN) * ANALOGKELVINCONVERSION) + KELVINCELSIUSCONVERSION;

        graph.plot(now, (float)AirTemp, tokens[0]);
        graph.plot(now, (float)Humidity, tokens[1]);
        graph.plot(now, (float)SoilTemp, tokens[2]);
        graph.plot(now, (float)Moisture, tokens[3]);
        graph.plot(now, (float)Light, tokens[4]);

        sprintf(data, "[%03.03f,%03.03f,%03.03f,%03.03f,%03.03f]", AirTemp, SoilTemp, Humidity, Moisture, Light);
        Spark.publish("Readings", data, 300, PRIVATE);

        lastloop = now;
    }else if((now - heartbeat) > FIFTY_SECONDS){
        graph.heartbeat();
        heartbeat = now;
    }else if ((now - timesync) > HALF_A_DAY){
        Spark.syncTime();
        timesync = now;
    }
}
