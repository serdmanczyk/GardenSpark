var _ = require('underscore');

function split(a, n, processor) {
    var len = a.length,out = [], i = 0, c = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        processor(a.slice(i, i += size), c++);
    }
};

module.exports = function(readings) {
	if (readings.length < 100) {
		return readings;
	}

	output = [];
	split(readings, 100, function(subset) {
		averaged = {};

		subset.forEach(function (reading, c) {
		    for (var key in reading){
		    	var n;

		        if (key === "timestamp"){
					n = new Date(reading[key]).getTime();
		        } else {
		        	n = Number(reading[key]);
		        }

		        if (key in averaged){
		            var o = averaged[key];

		            averaged[key] = o + ((n-o)/(c+1));
		        }else{
		            averaged[key] = n;
		        }
		    };
		});

		averaged['timestamp'] = new Date(averaged['timestamp']);

		output.push(averaged);
	});	

	return output;
};