"use strict"
var Tenacious = require('tenacious-http'),
    https = require('https'),
    extend = require('xtend'),
    util = require('util'),
    Emitter = require('events').EventEmitter;


var SparkParser = function SparkParser(opt, config){
    var self = this;

    Emitter.call(this, opt);
    self.config = config;
};

util.inherits(SparkParser, Emitter)

SparkParser.prototype.init = function init(done){
    var self = this,
        chunks = [];

    function appendToQueue(chunk) {
        var pieces = chunk.toString().split("\n");

        pieces.forEach(function(piece){
            var line = (piece || "").trim();
            if (line == "") {
                return;
            }

            chunks.push(line);
            if (line.indexOf("data:") == 0) {
                processItem(chunks);
                chunks = [];
            }
        });
    };

    function processItem(chunks) {
        var Sparkobj = {};

        chunks.forEach(function(line){
            if (line.indexOf("event:") == 0) {
                Sparkobj.name = line.replace("event:", "").trim();
            }
            else if (line.indexOf("data:") == 0) {
                line = line.replace("data:", "");
                Sparkobj = extend(Sparkobj, JSON.parse(line));
            }
        });

        parseObject(Sparkobj)
    };

    function parseObject(Sparkobj) {
      var Readings = JSON.parse(Sparkobj.data),
          SparkData = {
              "TimeStamp": Sparkobj.published_at,
              "Air Temperature": Readings[0],
              "Soil Temperature": Readings[1],
              "Humidity": Readings[2],
              "Soil Moisture": Readings[3],
              "Light": Readings[4]
          };

      self.emit('data', SparkData)
    };

    function connectSpark(){
        var req = https.request({
                    host: 'api.spark.io',
                    method: "GET",
                    headers: {
                        "Transfer-Encoding":"Chunked",
                        "Authorization": "Bearer " + self.config.AccessToken
                    },
                    path: '/v1/devices/' + self.config.DeviceId + '/events',
                });

        req.end();
        return req;
    };

    self.tenacious = Tenacious.create(connectSpark);
    self.tenacious.on('data', appendToQueue)
    self.tenacious.start().then(done(), function(err){
        throw err;
    });
};

module.exports = SparkParser;
