var request = require('request');
var extend = require('xtend');
var database = require('./db');
var plotter = require('./plotter');
var sparkinfo = require('./config').spark;

var requestObj;
var chunks = [];

var appendToQueue = function(arr) {
    for(var i=0;i<arr.length;i++) {
        var line = (arr[i] || "").trim();
        if (line == "") {
            continue;
        }
        chunks.push(line);
        if (line.indexOf("data:") == 0) {
            processItem(chunks);
            chunks = [];
        }
    }
};

var processItem = function(arr) {
    var obj = {};
    for(var i=0;i<arr.length;i++) {
        var line = arr[i];

        if (line.indexOf("event:") == 0) {
            obj.name = line.replace("event:", "").trim();
        }
        else if (line.indexOf("data:") == 0) {
            line = line.replace("data:", "");
            obj = extend(obj, JSON.parse(line));
        }
    }

    parseObject(obj)
};

var parseObject = function(obj) {
  var Readings = JSON.parse(obj.data)
   , TimeStamp = obj.published_at
   , AirTemp = Readings[0]
   , SoilTemp = Readings[1]
   , Humidity = Readings[2]
   , Moisture = Readings[3]
   , Lux = Readings[4]

  console.log({
    "TimeStamp":TimeStamp,
    "AirTemp":AirTemp,
    "SoilTemp":SoilTemp,
    "Moisture":Moisture,
    "Lux":Lux
    })

  database.insert(TimeStamp, AirTemp, SoilTemp, Humidity, Moisture, Lux);
  plotter.plot(AirTemp, SoilTemp, Humidity, Moisture, Lux);
}

var onData = function(event) {
  var chunk = event.toString();
  appendToQueue(chunk.split("\n"));
};

openstream = function(){
  requestObj = request({
              uri: 'https://api.spark.io/v1/devices/' + sparkinfo['DeviceId'] + '/events',
              method: "GET",
              headers: {
                "Transfer-Encoding":"Chunked",
                "Authorization": "Bearer " + sparkinfo['AccessToken']}
  });

  requestObj.on('data', onData);
  requestObj.on('end', function(){
    console.log("Stream disconnected, reconnecting...");
    setTimeout(openstream,1000);
  });
}

openstream();

console.log("Listening")
