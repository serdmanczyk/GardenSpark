"use strict"

var _ = require('underscore'),
    util = require('util'),
    Emitter = require('events').EventEmitter;

var DataCache = function DataCache(opt){
    var self = this;

    Emitter.call(this, opt);
    self.data = {count:0};
    self.timeout = 0;
};

util.inherits(DataCache, Emitter);

DataCache.prototype.append = function append(data){
    var self = this,
        c = this.data.count;

    for (var key in data){
        if (key === "TimeStamp"){
            continue;
        };
        if (key in self.data){
            var o = self.data[key],
                n = data[key];

            self.data[key] = o + ((n-o)/(c+1));
        }else{
            self.data[key] = data[key];
        }
    };
    self.data.count++;
};

DataCache.prototype.peek = function peek(){
    var self = this,
        copy = {};

    if (self.data.count === 0){
        return {};
    };

    for (var key in self.data) {
        if (this.data.hasOwnProperty(key)){
            copy[key] = _.clone(self.data[key]);
        };
    };

    copy.TimeStamp = (new Date()).toISOString();
    delete copy.count;
    return copy;
};

DataCache.prototype.get = function get(){
    var self = this,
        copy = self.peek();

    self.data = {count:0};
    return copy;
};

DataCache.prototype.setEmitInterval = function setEmitInterval(ms){
    var self = this;

    self.timeout = ms;
    if (self.interval !== undefined){
        clearInterval(self.interval);
    };

    self.interval = setInterval(function(){
        if (self.data.count > 0){
            self.emit('interval', self.get());
        };
    }, self.timeout);
};

module.exports = DataCache
