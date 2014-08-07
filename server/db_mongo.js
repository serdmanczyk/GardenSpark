var mongojs = require('mongojs');

var connection_string = '127.0.0.1:27017/gardenspark';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

var db = mongojs(connection_string, ['readings']);

exports.insert = function(Data){
    db.readings.insert(Data, {safe:true}, function(err, objects) {
        if (err)console.warn(err.message);
  });
};
