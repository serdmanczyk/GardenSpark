"use strict"

var includes = module.exports = {};

includes.db = require('./db_mongo');
includes.bodyParser = require('body-parser');
includes.express = require('express');
includes.morgan = require('morgan');
includes._ = require('underscore');
includes.name = require('figlet').textSync("GardenSpark");
includes.readings = require('./routes/readings');
includes.index = require('./routes/index');