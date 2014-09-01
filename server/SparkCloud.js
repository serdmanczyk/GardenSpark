"use strict"
var EventSource = require('eventsource'),
    util = require('util'),
    Emitter = require('events').EventEmitter;

var SparkCloud = function SparkCloud(opt, config){
    var self = this;

    Emitter.call(this, opt);
    self.config = config;
};

util.inherits(SparkCloud, Emitter)

SparkCloud.prototype.init = function init(done){
    var self = this,
        url = "https://api.spark.io/v1/devices/" + self.config.DeviceId + "/events",
        evsSettings = {
           rejectUnauthorized: false,
           headers:{
              "Transfer-Encoding":"Chunked",
              Authorization: "Bearer "+ self.config.AccessToken
           }
        };

    var es = new EventSource(url,evsSettings);
    es.addEventListener('Readings', function ParseEvent(event) {
        var sparkObj = JSON.parse(event.data),
            Readings = JSON.parse(sparkObj.data),
            SparkData = {
                "TimeStamp": sparkObj.published_at,
                "Air Temperature": Readings[0],
                "Soil Temperature": Readings[1],
                "Humidity": Readings[2],
                "Soil Moisture": Readings[3],
                "Light": Readings[4]
            };

        self.emit('data', SparkData)
    }, false);

    es.onerror = function(){
        console.log("error with EventSource connection with SparkCloud");
    };

    self.es = es;
};

module.exports = SparkCloud;
