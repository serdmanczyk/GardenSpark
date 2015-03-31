"use strict"
var util = require('util'),
    Emitter = require('events').EventEmitter;

var spewer = function spewer(){
    Emitter.call(this);
};

util.inherits(spewer, Emitter)

module.exports = new spewer();