"use strict"
var util = require('util');

var Plotter = function plotter(config){
    this.config = config;
};

Plotter.prototype.init = function init(done){
    var self = this,
        config = self.config,
        plotly = require('plotly')(config.settings.username, config.settings.apitoken),
        options = {
           fileopt: config.settings.fileopt,
           filename: config.settings.filename,
           title: config.settings.filename
    };

    var plots = [];
    config.plots.forEach(function(plot){
            plots.push({
                x:[],
                y:[],
                name:plot.name,
                stream:{
                    token:plot.token,
                    maxpoints:config.settings.maxpoints
                }
            });
    });

    plotly.plot(plots, options, function(err, msg){
        if (err) {throw err;}

        var Streams = {};
        config.plots.forEach(function(plot){
            var newstream = plotly.stream(plot.token, function(res){
                throw new Error(util.format('Failed starting stream %s: [%s] [%s]',
                    plot.name,
                    res.msg,
                    res.statusCode
                ));
        });
        Streams[plot.name] = newstream;
    });

        function heartbeat(){
            console.log("plotly heartbeat: " + (new Date()).toISOString());
            for (var key in Streams){
                Streams[key].write('\n');
            };
        };

        var interval = setInterval(heartbeat,59000);
        function plot(data){
            console.log("plot data: " + data.TimeStamp);
            for (var key in data){
                if (key in Streams){
                    var dataObj = {
                            x:data.TimeStamp
                                .replace(/T/, ' ')
                                .replace(/Z/, ''),
                            y:data[key]
                        },
                        datastring = JSON.stringify(dataObj);

                    Streams[key].write(datastring + "\n");
                };
            };

            clearInterval(interval);
            interval = setInterval(heartbeat, 59000);
        };

        done(plot);
    });
};

module.exports = Plotter
