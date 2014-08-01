var request = require('request');
var extend = require('xtend');
var database = require('./spark_db')
var sparkinfo = require('./config.json');

var requestObj = request({
            // uri: 'https://api.spark.io/v1/devices/' + sparkinfo['DeviceId'] + '/events?access_token=' + sparkinfo['AcessToken'],
            uri: 'https://api.spark.io/v1/devices/' + sparkinfo['DeviceId'] + '/events',
            method: "GET",
            headers: {
              "Transfer-Encoding":"Chunked",
              "Authorization": "Bearer " + sparkinfo['AccessToken']}
});

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

    // console.log(obj);
    parseObject(obj)
};

var parseObject = function(obj) {
  Readings = JSON.parse(obj.data)
  Time_Origin = obj.published_at;
  var AirTemp = Readings[0];
  var SoilTemp = Readings[1];
  var Humidity = Readings[2];
  var Moisture = Readings[3];
  var Lux = Readings[4];
  database.insert(Time_Origin, AirTemp, SoilTemp, Humidity, Moisture, Lux);
}

var onData = function(event) {
            var chunk = event.toString();
            appendToQueue(chunk.split("\n"));
};

requestObj.on('data', onData);
console.log("Opened Stream")
