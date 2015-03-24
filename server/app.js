"use strict"
var incl = require('./includes'),
	express = incl.express;

var port = process.env.OPENSHIFT_NODEJS_PORT || 8080 ,
    ip = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";

var app = module.exports = express();

app.use(incl.morgan('dev'));
app.use(incl.bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use('/readings', incl.readings);
app.use('/', incl.index);

app.listen(port, ip);
