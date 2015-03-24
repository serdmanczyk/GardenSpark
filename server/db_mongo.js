"use strict"
var mongojs = require('mongojs'),
    smooth = require('./smooth'),
    _ = require('underscore'),
    connection_string = '127.0.0.1:27017/gardenspark';

// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
      process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
      process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
      process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
      process.env.OPENSHIFT_APP_NAME;
};

var db = mongojs(connection_string, ['readings']),
    readings = db.readings;

readings.ensureIndex({timestamp:1});

exports.insert = function insert(Data){
    console.log("saved data: " + Data.timestamp);
    readings.insert(Data, {safe:true}, function(err, objects){
        if (err) {console.warn(err.message);}
    });

    delete Data._id;
};

exports.getReadings = function getReadings(start, end, callback, smoothing){
    function validDate(dateStr, def){
        return (Date(dateStr) !== "Invalid Date") ? new Date(dateStr) : new Date(def);
    };

    var query = {
            timestamp:{
                $gt:(validDate(start, 0).toISOString()),
                $lt:(validDate(end, Date.now()).toISOString())
            }
        },
        results = [];

    readings.find(query,{_id:false})
        .forEach(function(err,doc){
            if (!doc) {
                if (smoothing) {
                    return callback(smooth(results));
                } else {
                    return callback(results);
                }
            };
            results.push(doc);
        });
};

exports.getLatest = function getLatest(callback){
    var latest = {};

    readings.find({},{_id:false})
        .sort({timestamp:-1})
        .limit(1)
        .forEach(function(err,doc){
            if (!doc) {
                callback(latest);
            };

            latest = doc;
        });
};