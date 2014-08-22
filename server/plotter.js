"use strict"
var _ = require('underscore');

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
      if (err) {throw err}

      var Streams = {};
      config.plots.forEach(function(plot){
        var newstream = plotly.stream(plot.token, function(err, res){
            if (err) {throw err;}

            console.log("Started stream: " + plot.name)
        });
        Streams[plot.name] = newstream;
      });

      function plot(Data){
        for (var key in Data){
            if (key in Streams){
                var dataObj = {
                        x:Data.TimeStamp
                            .replace(/T/, ' ')
                            .replace(/Z/, ''),
                            y:Data[key]
                        },
                    datastring = JSON.stringify(dataObj);

                Streams[key].write(datastring + "\n")
            };
        };
      };

      done(plot);
    });
};

module.exports = Plotter
