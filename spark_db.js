var sqlite3 = require('sqlite3').verbose()
 , db = new sqlite3.Database('sparklog.dbs');

db.serialize(function(){
  db.run("CREATE TABLE IF NOT EXISTS Readings (TimeStamp TEXT, AirTemp REAL, SoilTemp REAL, Humidity REAL, Moisture REAL, Lux REAL)")
});

exports.insert = function(TimeStamp, AirTemp, SoilTemp, Humidity, Moisture, Lux){
  db.run("INSERT INTO Readings VALUES (?,?,?,?,?,?)", TimeStamp, AirTemp, SoilTemp, Humidity, Moisture, Lux)
}
