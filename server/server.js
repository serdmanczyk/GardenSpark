"use strict"
var SparkCloud = require('./SparkCloud'),
    plotter = require('./plotter'),
    db = require('./db_mongo'),
    config = require('./config'),
    DataCache = require('./DataCache'),
    url = require('url'),
    figlet = require('figlet'),
    express = require('express'),
    morgan = require('morgan'),
    _ = require('underscore'),
    app = express();

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080 ,
    ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var SparkCloud = new SparkCloud({}, config.spark),
    plotter = new plotter(config.plotly),
    cache = new DataCache(),
    name = figlet.textSync("GardenSpark");

cache.setEmitInterval(66667);  //  Fill plot every 24 hrs

SparkCloud.init(function(){
    console.log("SparkCloud connection initialized");
});

SparkCloud.on('data', function(data){
    db.insert(data);
    cache.append(data);
});

plotter.init(function(plot){
    console.log("plotly initialized");
    cache.on('interval',function(data){
        plot(data);
    });
});


app.use(morgan('dev'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'))

app.get('/', function(req,res){
    db.getLatest(function(data){
        if (req.headers['content-type'] === 'application/json'){
            res.send(JSON.stringify(data));
        }else{
            data.TimeStamp = (new Date(data.TimeStamp));
            var rs = _.map(data, function(v,k,l){
                    return {name:k,value:v};
                });
            res.render('index',{
                title:name,
                readings:rs,
                interval:cache.timeout.toString()
            });
        };

    });
});

app.get('/readings', function(req, res){
    function DateDefault(date, defaultdate) {
        var attempt = new Date(date);

        if (attempt.toString() !== "Invalid Date"){
            return attempt;
        }else{
            if (defaultdate === Infinity){
                return new Date();
            }else{
                return new Date(defaultdate)
            };
        };
    };

    var startDate = DateDefault(req.query.start, 0),
        endDate = DateDefault(req.query.end, Infinity);

    db.getReadings(startDate, endDate, function(results){
        if (req.headers['content-type'] === 'application/json'){
            res.send(JSON.stringify(results));
        }else{
            var ret = {
                title:name,
                readings:results || []
            };
            res.render('readings',ret);
        };
    });
});

app.get('/interval', function(req, res){
    function ParsetoMsValue(parameter, conversion){
        if (parameter !== undefined){
            var i = Number(parameter);

            if (i !== NaN){
                return i*conversion;
            }
        }

        return 0;
    };

    var hours = ParsetoMsValue(req.query.hours || 0, 3600000),
        minutes = ParsetoMsValue(req.query.minutes || 0, 60000),
        seconds = ParsetoMsValue(req.query.seconds || 0, 1000),
        adjustment = seconds + minutes + hours;

    if (adjustment > 1000){
        cache.setEmitInterval(seconds + minutes + hours);
    };

    res.redirect('/');
});

app.listen(port, ip);