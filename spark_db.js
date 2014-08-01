var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('sparklog.dbs');

db.serialize(function(){
  db.run("CREATE TABLE IF NOT EXISTS Readings (TimeStamp TEXT, AirTemp REAL, SoilTemp REAL, Humidity REAL, Moisture REAL, Lux REAL)")
});

exports.insert = function(TimeStamp, AirTemp, SoilTemp, Humidity, Moisture, Lux){
  console.log(TimeStamp);
  console.log("\tAirTemp: " + AirTemp);
  console.log("\tSoilTemp: " + SoilTemp);
  console.log("\tHumidity: " + Humidity);
  console.log("\tMoisture: " + Moisture);
  console.log("\tLux: " + Lux);
  db.run("INSERT INTO Readings VALUES (?,?,?,?,?,?)", TimeStamp, AirTemp, SoilTemp, Humidity, Moisture, Lux)
}
