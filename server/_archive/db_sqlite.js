var sqlite3 = require('sqlite3').verbose()
 , db = new sqlite3.Database('sparklog.dbs');

db.serialize(function(){
  db.run("CREATE TABLE IF NOT EXISTS Readings (TimeStamp TEXT, Air_Temperature REAL, Soil_Temperature REAL, Humidity REAL, Soil_Moisture REAL, Light REAL)")
});

exports.insert = function(Data){
  db.run("INSERT INTO Readings VALUES (?,?,?,?,?,?)",
      Data['TimeStamp'],
      Data['Air Temperature'],
      Data['Soil Temperature'],
      Data['Humidity'],
      Data['Soil Moisture'],
      Data['Light']
  )
}
