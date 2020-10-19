const config = require("./config");


const si = require('systeminformation');

var ifaces_data={};
var cpu_data= {};

function interfacesStats(iface) {
    si.networkStats(iface)
        .then(data => {
            ifaces_data[iface]=data[0];
        })
        .catch(error => console.error(error));
}

function cpuStats() {
    si.cpuCurrentspeed()
        .then(data => {cpu_data=data;})
        .catch(error => console.error(error));
}

module.exports={
    getStats() {
        return {ifaces: ifaces_data, cpu: cpu_data};
    },
    startStatistics(conf) {
        this.interfacesStatistics(conf);
        this.cpuStatistics();    
    },
    interfacesStatistics(conf) {
        conf.interfaces.forEach(iface => {
            setInterval(interfacesStats, 1000, iface);                
        });
    },
    cpuStatistics(conf) {
        setInterval(cpuStats, 2000);          
    }
}