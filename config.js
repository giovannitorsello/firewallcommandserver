const fs = require('fs');

module.exports = {
    load: function (callback) {
        var filename = process.cwd() + "/config.json";
        var rawdata = "";
        try {
            rawdata = fs.readFileSync(filename);
            let config = JSON.parse(rawdata);
            callback(config);
        } catch (err) {
            console.log("Working directory is " + process.cwd());
            console.log("Use config: " + filename);
            console.log("Config file is not present");
            console.log(err);
        }
    }
}