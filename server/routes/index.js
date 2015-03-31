"use strict"
var incl = require('../includes'),
    db = incl.db,
    _ = incl._;
    
var router = module.exports = incl.express.Router();

router.get('/', function(req, res){
    res.render('index');
});