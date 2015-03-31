"use strict"
var incl = require('./includes'),
	express = incl.express;

var readings = require('./routes/readings');
var latest = require('./routes/latest');
var index = require('./routes/index');

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080 ,
    ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var app = module.exports = express();

app.use(incl.morgan('dev'));
app.use(incl.bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use('/readings', readings);
app.use('/latest', latest);
app.use('/', index);

app.listen(port, ip);
