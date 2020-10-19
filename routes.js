const { exec } = require('child_process');

function execScript(script, dev, res) {
    if (dev && dev.id !== "" && dev.id != "0") {
        exec(script, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                res.send({ status: "error", msg: err, result: dev });
            } else {
                res.send({ status: "OK", msg: "Device enabled", result: {} });s
            }
        });
    }
    else
        res.send({ status: "error", msg: "Check device information", result: dev });
}

module.exports = {
    load(app, stats) {
        app.get("/getStats", function (req, res) {
            res.send({status: "OK", msg: "Statistics router information", statistics: stats.getStats()})
        });

        app.post("/device/enable", function (req, res) {
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "/enable_device.sh "+dev.ipv4+" "+dev.mac;
            execScript(script, dev, res)
        });

        app.post("/device/disable", function (req, res) {
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "/disable_device.sh " +dev.ipv4+" "+dev.mac;
            execScript(script, dev, res)
        });

        app.post("/device/replace_bandwidth", function (req, res) {
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "/replace_bandwidth.sh " +dev.ipv4+" "+dev.mac;
            execScript(script, dev, res)
        });

        app.post("/device/delete_bandwidth", function (req, res) {
            var dev = req.body.deviceCustomer;
            var script = conf.pathScripts + "/delete_bandwidth.sh " +dev.ipv4+" "+dev.mac;
            execScript(script, dev, res)
        });
    }
}