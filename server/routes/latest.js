"use strict"
var incl = require('../includes'),
    db = incl.db,
    _ = incl._,
    spewer = incl.spewer;

var router = module.exports = incl.express.Router();

router.get('/', function(req,res){
	if (req.query.one == 'true') {
	    db.getLatest(function(data){
			res.end(JSON.stringify(data));
	    });
	    return;
	}

	req.socket.setTimeout(Infinity);

	var genEvent = (function () {
		var messageCount = 0;
		return function(data) {
			var event = [
				'event: newdata',
				'id: ' + messageCount,
				'data: ' + JSON.stringify(data),
			].join('\n') + '\n\n';
			
			messageCount++;
			console.log(event);
			return event;
		}
	})()

	spewer.on('data', function(data){
		res.write(genEvent(data));
    });

	// Uncomment for testing EventSource on local
	// var t = setInterval(function() {
	    db.getLatest(function(data){
			res.write(genEvent(data));
	    });
	// }, 1000);

	res.writeHead(200, {
		'Content-Type': 'text/event-stream',
		'Cache-Control': 'no-cache',
		'Connection': 'keep-alive'
	});
	res.write('\n');
});
