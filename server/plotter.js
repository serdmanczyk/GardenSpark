var config = require('./config').plotly,
    _ = require('underscore'),
    plotly = require('plotly')(config.settings.username, config.settings.apitoken),
    maxpoints = config.settings.maxpoints,
    plots = [],
    options = {
       fileopt: config.settings.fileopt,
       filename: config.settings.filename,
       title: config.settings.filename
   };

config.plots.forEach(function(plot){
        plots.push({
            x:[],
            y:[],
            name:plot.name,
            stream:{
                token:plot.token,
                maxpoints:maxpoints
            }
        });
});

plotly.plot(plots, options, function(err, msg){
  if (err) return console.log(err)
  console.log(msg);

  var Streams = {};

  config.plots.forEach(function(plot){
    var newstream =  plotly.stream(plot.token, function(err, res){
        console.log(err,res)
    });
    Streams[plot.name] = newstream;
  });

  plothelp = function(stream, TimeStamp, data){
      var dataObj = {x:TimeStamp, y:data}
       , datastring = JSON.stringify(dataObj);
      stream.write(datastring + "\n")
  };

  exports.plot = function(Data){
    for (key in Data){
        if (_.has(Streams, key)){
            plothelp(Streams[key], Data.TimeStamp, Data[key]);
        };
    };
  };
});

// function getDateString (){
//   var time = new Date();
//   // 14400000 is (GMT-4 Montreal)
//   var datestr = new Date(time - 14400000).toISOString().replace(/T/, ' ').replace(/Z/, '');
//   return datestr;
// }
