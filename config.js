const fs = require('fs');

module.exports = {
    load: function (callback) {
        var filename = "./config.json";
        var rawdata = "";
        try {
            //case "node main.js" not standalone executable
            if (fs.existsSync(__dirname + "/config.json")) {
                filename = __dirname + "/config.json";
                console.log("Use config: " + filename);
                rawdata = fs.readFileSync(filename);
                let config = JSON.parse(rawdata);
                callback(config);
            }
            else {
                //production case standalone executable
                try {
                    rawdata = fs.readFileSync(filename);
                    let config = JSON.parse(rawdata);
                    callback(config);
                } catch (err) {
                    console.log("Use config: " + filename);
                    console.log("Config file is not present");
                }
            }
        } catch (err) {
            console.log("Use config: " + filename);
            console.log("Config file is not present");
        }


    }
}