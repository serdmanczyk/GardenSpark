var Tenacious = require('tenacious-http');
var https = require('https');
var parser = require('./parse')
var sparkinfo = require('./config').spark;

var tenacious = Tenacious.create(function(){
    req =  https.request({
        host: 'api.spark.io',
        method: "GET",
        headers: {
            "Transfer-Encoding":"Chunked",
            "Authorization": "Bearer " + sparkinfo['AccessToken']
        },
        path: '/v1/devices/' + sparkinfo['DeviceId'] + '/events',
    });
    req.end();
    return req;
});

tenacious.on('data', parser)
tenacious.start().then(function(){
    console.log('connected spark api')
}, function(err){
    console.log("error connecting spark api")
    console.log(err)
});
