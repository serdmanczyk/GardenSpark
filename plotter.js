var config = require('./plotly_config')
 , plotly = require('plotly')(config['username'], config['apitoken'])
 , maxpoints = 12960
 , initData = [
    {x:[],y:[],stream:{token:config['airtemptok'],maxpoints:maxpoints}},
    {x:[],y:[],stream:{token:config['humidtok'],maxpoints:maxpoints}},
    {x:[],y:[],stream:{token:config['soiltemptok'],maxpoints:maxpoints}},
    {x:[],y:[],stream:{token:config['moisturetok'],maxpoints:maxpoints}},
    {x:[],y:[],stream:{token:config['lighttok'],maxpoints:maxpoints}}
  ]
 , initGraphOptions = {fileopt : "overwrite", filename : "GardenSpark"};

// little helper function to get a nicely formatted date string
function getDateString (){
  var time = new Date();
  // 14400000 is (GMT-4 Montreal)
  // for your timezone just multiply +/-GMT by 3600000
  var datestr = new Date(time - 14400000).toISOString().replace(/T/, ' ').replace(/Z/, '');
  return datestr;
}

plotly.plot(initData, initGraphOptions, function(err, msg){
  if (err) return console.log(err)
  console.log(msg);

  errf = function(err, res){console.log(err,res)}

  var AirTempStream = plotly.stream(config['airtemptok'], errf)
   , HumidStream = plotly.stream(config['humidtok'], errf)
   , SoilTempStream = plotly.stream(config['soiltemptok'], errf)
   , MoistureStream = plotly.stream(config['moisturetok'], errf)
   , LightStream = plotly.stream(config['lighttok'], errf);

  plothelp = function(stream, TimeStamp, data){
      var dataObj = {x:TimeStamp, y:data}
       , datastring = JSON.stringify(dataObj);
      stream.write(datastring + "\n")
  };

  exports.plot = function(AirTemp, SoilTemp, Humidity, Moisture, Lux){
    TimeStamp = getDateString()

    plothelp(AirTempStream, TimeStamp, AirTemp);
    plothelp(HumidStream, TimeStamp, Humidity);
    plothelp(SoilTempStream, TimeStamp, SoilTemp);
    plothelp(MoistureStream, TimeStamp, Moisture);
    plothelp(LightStream, TimeStamp, Lux);
  };
});
