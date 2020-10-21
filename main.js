
const https = require('https');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const statistics = require('./statistics.js');
const config = require('./config.js');
const routes = require("./routes.js");
const logger=require("./logger.js");

config.load(function (conf) {
    console.log("Init server.");
    logger.init(conf);
    logger.log("info","Firewall Command Server started.");

    var appCommand = express();
    appCommand.listen(conf.port);
    appCommand.use(cors());
    appCommand.use(bodyParser.json({ limit: '200000kb' }));
    
    statistics.startStatistics(conf);
    
    routes.load(appCommand,logger,statistics,conf);
    logger.log("info","Command server is listening on port " + conf.port);
});

process.on('SIGINT', function() {
    logger.log("info","Received SIGINT signal");
    setTimeout(function() {
        console.log("\nExit from server.");
        logger.log("info","Exit");
        process.exit(0);
    }, 500);
});