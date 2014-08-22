"use strict"
var mongojs = require('mongojs');

var DB = function(){
    var connection_string = '127.0.0.1:27017/gardenspark';
    // if OPENSHIFT env variables are present, use the available connection info:
    if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
      connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
          process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
          process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
          process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
          process.env.OPENSHIFT_APP_NAME;
    };

    this.connection_string = connection_string;
};

DB.prototype.init = function init(done){
    var self = this;

    var db = mongojs(self.connection_string, ['readings']);
    self.readings = db.readings;
    done();
};

DB.prototype.updateBadTimeStamps = function updateBadTimeStamps(){
    var self = this;

    function matchISO8601(date){
        var iso8601 = /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})\.(\d{3})Z/;

        return iso8601.test(date);
    };

    var updates = [];
    function updateTimeStamp(obj){
        var old = obj.TimeStamp;

        obj.TimeStamp = old.replace(" ", "T") + "Z";
        updates.push(obj);
    };

    function updateOld(){
        updates.forEach(function(obj){
            self.readings.save(obj, function(err, saved){
                if (err) {throw err;}
                console.log("updated: " + obj.TimeStamp);
            });
        });
    };

    self.readings.find().forEach(function(err, obj){
        if (err) {throw err;}
        if (!obj) {return updateOld();}

        if (!matchISO8601(obj.TimeStamp)){
            updateTimeStamp(obj);
        };
    });
};

DB.prototype.insert = function insert(Data){
    var self = this;

    console.log("saved data: " + Data.TimeStamp);
    self.readings.insert(Data, {safe:true}, function(err, objects){
        if (err) {console.warn(err.message);}
  });
};

// DB.prototype.getReadings = function insert(startDate, endDate){
DB.prototype.getReadings = function insert(callback){
    var self = this,
        // start = (startDate || (new Date(0)).toISOString()),
        // end = (endDate || (new Date()).toISOString());
        results = [],
        query = {
            TimeStamp:{
                $gt:((new Date(0)).toISOString()),
                $lt:((new Date()).toISOString())
            }
        },
        filter = {_id:false},
        sort = {TimeStamp:-1};

    self.readings.find(query,filter)
        .sort(sort)
        .limit(50)
        .forEach(function(err,doc){
            if (!doc) {
                return callback(JSON.stringify(results, null, 4));
            };
            results.push(doc);
        });
};

module.exports = DB;
