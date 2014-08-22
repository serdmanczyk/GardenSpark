"use strict"
var SparkParser = require('./SparkParser'),
    plotter = require('./plotter'),
    mongo = require('./db_mongo'),
    config = require('./config'),
    http = require('http'),
    url = require('url'),
    port = process.env.OPENSHIFT_NODEJS_PORT || 8080 ,
    ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var SparkCloud = new SparkParser({}, config.spark);
var mong = new mongo();
var plotter = new plotter(config.plotly);

SparkCloud.init(function(){
    console.log("SparkCloud connection initialized");
})

mong.init(function(){
    console.log("database connection initialized");
    mong.updateBadTimeStamps();
    SparkCloud.on('data', function(data){
        mong.insert(data)
    });
});

plotter.init(function(plot){
    console.log("plotly initialized");
    SparkCloud.on('data', function(data){
        plot(data);
    });
});

http.createServer(function (req, res) {
    if (req.method == "GET"){
        var u = url.parse(req.url, true);

        if (u.pathname === "/favicon.ico"){
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end("Nope");
            return;
        };

        // console.log(u.query);
        res.writeHead(200, {'Content-Type': 'text/plain'});
        mong.getReadings(function(readings){
            res.end(readings);
        });
        return;
    };
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('resource does not exist');
}).listen(port, ip);
