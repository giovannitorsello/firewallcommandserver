const fs = require('fs');

module.exports= {
    load: function(callback) {
        filename=__dirname+"/config.json";
        let rawdata = fs.readFileSync(filename);
        let config = JSON.parse(rawdata);
        callback(config);
    }
}