
const https = require('https');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const statistics = require('./statistics.js');
const config = require('./config.js');
const routes = require("./routes.js");



process.chdir(__dirname);

config.load(function (conf) {
    var appCommand = express();
    appCommand.listen(conf.port);
    appCommand.use(cors());
    appCommand.use(bodyParser.json());
    appCommand.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies.
    appCommand.use(bodyParser.json({ limit: '2000kb' }));

    statistics.startStatistics(conf);
    
    routes.load(appCommand,statistics,conf);

    


});