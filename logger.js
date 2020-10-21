const moment = require('moment');
const winston = require('winston');

var wintson_logger = {};

module.exports = {
    init(conf) {
        let ts = moment().format("YYYYMMDD"); 
        var filename_log=conf.logfilepath+conf.logfilecombinedprefix+ts+".log";
        wintson_logger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                //
                // - Write all logs with level `error` and below to `error.log`
                // - Write all logs with level `info` and below to `combined.log`
                //
                //new winston.transports.File({ filename: 'error.log', level: 'error' }),                
                new winston.transports.File({ filename: filename_log}),
            ],
        });
        /*
        if (process.env.NODE_ENV !== 'production') {
            logger.add(new winston.transports.Console({
              format: winston.format.simple(),
            }));
        }*/
    },
    log(level, message) {
        let ts = moment().format();    
        wintson_logger.log({level: level, time: ts, message: message});
    }

}