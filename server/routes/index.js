"use strict"
var incl = require('../includes'),
    db = incl.db,
    _ = incl._;

var router = module.exports = incl.express.Router();

router.get('/', function(req,res){
    db.getLatest(function(data){
        if (req.headers['content-type'] === 'application/json'){
            res.json(data);
        }else{
            data.TimeStamp = (new Date(data.TimeStamp));
            var rs = _.map(data, function(v,k,l){
                    return {name:k,value:v};
                });
            res.render('index',{
                title:incl.name
            });
        };

    });
});
