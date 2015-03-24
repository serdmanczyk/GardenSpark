var _ = require('underscore');

function split(a, n) {
    var len = a.length,out = [], i = 0;
    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        out.push(a.slice(i, i += size));
    }
    return out;
};

function average(a) {
	return _.reduce(a, function(m, n){
		return m+Number(n); 
	}, 0) / a.length;
};

function averageDate(a,b) {
	var am = new Date(a).getTime();
	var bm = new Date(b).getTime();

	return new Date((am + bm) / 2);
};

var names = {
	'timestamp': null,
	'airtemp' : null,
	'soiltemp' : null,
	'humidity' : null,
	'soilmoist' : null,
	'light' : null
};

module.exports = function(readings) {
	if (readings.length < 100) {
		return readings;
	}

	output = [];
	split(readings, 100).forEach(function(subset, i) {
		output.push(_.mapObject(names, function() {
			return [];
		}));

		subset.forEach(function (reading) {
			for (var name in names) {
				output[i][name].push(reading[name]);
			};
		});

		for (var name in names) {
			if (name == 'timestamp') {
				output[i][name] = averageDate(
					_.first(output[i][name]),
					_.last(output[i][name])
				).getTime();
			}
			else {
				output[i][name] = average(output[i][name]);
			}
		};
	});	

	return output;
};