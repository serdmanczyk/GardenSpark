var extend = require('xtend');
var plotter = require('./plotter');
var database = require('./db_mongo')
var chunks = [];
var callback;

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
  var Readings = JSON.parse(obj.data),
      Data = {
          "TimeStamp": obj.published_at,
          "Air Temperature": Readings[0],
          "Soil Temperature": Readings[1],
          "Humidity": Readings[2],
          "Soil Moisture": Readings[3],
          "Light": Readings[4]
      };

  obj.data = Data;
  console.log(obj);
  database.insert(Data);
  plotter.plot( Data);
};

module.exports = function(event) {
  var chunk = event.toString();
  appendToQueue(chunk.split("\n"));
};
