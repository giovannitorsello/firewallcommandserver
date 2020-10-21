const { exec } = require('child_process');
const fs=require("fs");

function execDevScript(script, dev, res, logger) {
    if (dev && dev.id !== "" && dev.id != "0") {
        exec(script, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                res.send({ status: "error", msg: err.message, result: dev });
                logger.log("error",err.message);
            } else {
                var message="Script executed "+script;
                res.send({ status: "OK", msg: message, result: {script: script, out: stdout} });                
                logger.log("info",message);
            }
        });
    }
    else {
        res.send({ status: "error", msg: "Error in executing script. Check information.", result: dev });
        logger.log("error","Error in executing script. Check information.");
    }
}

function execScript(script, res, logger) {
        exec(script, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                res.send({ status: "error", msg: err.message, result: {err} });
                logger.log("error",err.message);
            } else {
                var message="Script executed "+script;
                res.send({ status: "OK", msg: message, result: {script: script, out: stdout} });                
                logger.log("info",message);
            }
        });
}

module.exports = {
    load(app, logger, stats, conf) {
        app.get("/getStats", function (req, res) {
            res.send({ status: "OK", msg: "Statistics router information", statistics: stats.getStats() })
        });

        //Make file csv for firewall scripts
        app.post("/write/csv/files", function (req, res) {
            var secret = req.body.secret;
            var devs = req.body.devices;
            var nat_file = "", pub_file = "", suspended_file = "";
            devs.forEach((device, index, array) => {
                if (device.state === "active" || device.state === "in esecuzione") {
                    //Pub
                    if (device.ipv4.startsWith("5.83.")) {
                        //5.83.125.5,E4:8D:8C:FD:5F:69,GlocServiceSRL,15000,15000,3000,3000
                        if(device.objData && device.objData.bandwith)
                        pub_file += device.ipv4 + "," +
                            device.mac + "," +
                            device.description + "," +
                            device.objData.bandwith.download_min + "," +
                            device.objData.bandwith.download_max + "," +
                            device.objData.bandwith.upload_min + "," +
                            device.objData.bandwith.upload_max + "\n";
                    }
                    //Nat
                    if (device.ipv4.startsWith("10.")) {
                        //10.21.117.135,74:4D:28:F8:9D:56,EspositoAntonioLuigi,1000,15000,1000,3000
                        if(device.objData && device.objData.bandwith)    
                        nat_file += device.ipv4 + "," +
                                device.mac + "," +
                                device.description + "," +
                                device.objData.bandwith.download_min + "," +
                                device.objData.bandwith.download_max + "," +
                                device.objData.bandwith.upload_min + "," +
                                device.objData.bandwith.upload_max + "\n";
                    }
                }
                else {
                    //Suspended devices
                    if(device.objData && device.objData.bandwith)                            
                    suspended_file += device.ipv4 + "," +
                        device.mac + "," +
                        device.description + "," +
                        device.objData.bandwith.download_min + "," +
                        device.objData.bandwith.download_max + "," +
                        device.objData.bandwith.upload_min + "," +
                        device.objData.bandwith.upload_max + "\n";
                }

                if (index === array.length-1) {
                    fs.writeFile(conf.pathScripts+'csv/pub.csv', pub_file, (err) => {
                        if (err) logger.log(err);
                        else logger.log("pub.csv created.");
                    });
                    fs.writeFile(conf.pathScripts+'csv/nat.csv', nat_file, (err) => {
                        if (err) logger.log(err);
                        else logger.log("nat.csv created.");
                    });
                    fs.writeFile(conf.pathScripts+'csv/suspended.csv', suspended_file, (err) => {
                        if (err) logger.log(err);
                        else logger.log("suspended.csv created.");
                    });
                    logger.log("info","Csv firewall files updated");
                    res.send({ status: "OK", msg: "Csv firewall files updated", result: {} });
                }
            });
        });

        app.post("/reload/firewall/rules", function (req, res) {
            var secret = req.body.secret;
            var script = conf.pathScripts + "InitFirewall.sh";
            execScript(script, res, logger)
        });

        app.post("/reload/firewall/bandwidth", function (req, res) {
            var secret = req.body.secret;
            var script = conf.pathScripts + "InitBandwidth.sh";
            execScript(script, res, logger)
        });

        app.post("/device/enable", function (req, res) {
            var secret = req.body.secret;
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "enable_device.sh " + dev.ipv4 + " " + dev.mac;
            execDevScript(script, dev, res, logger)
        });

        app.post("/device/disable", function (req, res) {
            var secret = req.body.secret;
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "disable_device.sh " + dev.ipv4 + " " + dev.mac;
            execDevScript(script, dev, res, logger)
        });

        app.post("/device/replace_bandwidth", function (req, res) {
            var secret = req.body.secret;
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "replace_bandwidth.sh " + dev.ipv4 + " " + dev.mac;
            execDevScript(script, dev, res, logger)
        });

        app.post("/device/delete_bandwidth", function (req, res) {
            var secret = req.body.secret;
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "/delete_bandwidth.sh " + dev.ipv4 + " " + dev.mac;
            execDevScript(script, dev, res, logger)
        });
    }
}