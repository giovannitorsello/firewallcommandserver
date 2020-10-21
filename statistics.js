const config = require("./config");


const si = require('systeminformation');

var ifaces_data = [];
var cpu_data = {};

function interfacesStats(iface) {
    si.networkStats(iface)
        .then(data => {
            if(ifaces_data.length===0) ifaces_data.push(data[0]);
            for (var i = 0; i < ifaces_data.length; i++) {
                if (ifaces_data[i].iface === iface) {
                    ifaces_data[i] = data[0];
                    break;
                }
                if (i === ifaces_data.length - 1) //insert new element
                    ifaces_data.push(data[0]);
            }
        })
        .catch(error => console.error(error));
}

function cpuStats() {
    si.cpuCurrentspeed()
        .then(data => { cpu_data = data; })
        .catch(error => console.error(error));
}

var conf={};

module.exports = {
    getStats() {
        this.interfacesStatistics(conf);
        this.cpuStatistics(conf);
        return { ifaces: ifaces_data, cpu: cpu_data };
    },
    startStatistics(configuration) {
        conf=configuration;
        this.interfacesStatistics(conf);
        this.cpuStatistics();
    },
    interfacesStatistics(configuration) {
        configuration.interfaces.forEach(iface => {
            interfacesStats(iface);
        });
    },
    cpuStatistics(configuration) {
        cpuStats();
    }
}