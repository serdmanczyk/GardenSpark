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
