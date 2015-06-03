function getDrivers(callback) {
    // var drivers = {
    //     "serial": {
    //         "display": "Serial (AllPixel)",
    //         "params": [{
    //             "id": "type",
    //             "label": "LED Type",
    //             "type": "combo",
    //             "options": {
    //                 0: "GENERIC",
    //                 1: "LPD8806",
    //                 2: "WS2801",
    //                 3: "WS281x",
    //                 4: "WS2811_400",
    //                 5: "TM1804",
    //                 6: "TM1803",
    //                 7: "UCS1903",
    //                 8: "SM16716",
    //                 9: "APA102",
    //                 10: "LPD1886",
    //                 11: "P98131"
    //             },
    //             "default": 0
    //         }, {
    //             "id": "num",
    //             "label": "# Pixels",
    //             "type": "int",
    //             "default": 1,
    //             "min": 1
    //         }, {
    //             "id": "dev",
    //             "label": "Device Path",
    //             "type": "str",
    //             "default": "",
    //         }, {
    //             "id": "c_order",
    //             "label": "Channel Order",
    //             "type": "combo",
    //             "options": {
    //                 0: "RGB",
    //                 1: "RBG",
    //                 2: "GRB",
    //                 3: "GBR",
    //                 4: "BRG",
    //                 5: "BGR"
    //             },
    //             "options_map": [
    //                 [0, 1, 2],
    //                 [0, 2, 1],
    //                 [1, 0, 2],
    //                 [1, 2, 0],
    //                 [2, 0, 1],
    //                 [2, 1, 0]
    //             ],
    //             "default": 0
    //         }, {
    //             "id": "SPISpeed",
    //             "label": "SPI Speed (MHz)",
    //             "type": "int",
    //             "default": 2,
    //             "min": 1,
    //             "max": 24,
    //             "advanced": true
    //         }, {
    //         	"id":"gamma",
    //         	"label":"Gamma",
    //         	"type":"combo",
    //         	"default":null,
    //         	"options":{

    //         	},
    //         	"options_map":[

    //         	]
    //         },{
    //             "id": "restart_timeout",
    //             "label": "Restart Timeout",
    //             "type": "int",
    //             "default": 3,
    //             "min": 1,
    //             "advanced": true
    //         },{
    //             "id": "deviceID",
    //             "label": "Device ID",
    //             "type": "int",
    //             "default": null,
    //             "min": 0,
    //             "max": 255,
    //             "msg": "AllPixel ID",
    //             "advanced": true
    //         },{
    //             "id": "hardwareID",
    //             "label": "Hardware ID",
    //             "type": "str",
    //             "default": "1D50:60AB",
    //             "advanced": true
    //         },]
    //     },
    //     //(self, num, c_order = ChannelOrder.RGB, use_py_spi = True, 
    //     //dev="/dev/spidev0.0", SPISpeed = 2):
    //     "lpd8806": {
    //         "display": "LPD8806 (SPI)",
    //         "params": [{
    //             "id": "num",
    //             "label": "# Pixels",
    //             "type": "int",
    //             "default": 1,
    //             "min": 1,
    //             "help":"Total pixels to control."
    //         }, {
    //             "id": "dev",
    //             "label": "Device Path",
    //             "type": "str",
    //             "default": "/dev/spidev0.0",
    //             "help": "File path to system SPI device. Default is valid on Raspberry Pi."
    //         }, {
    //             "id": "c_order",
    //             "label": "Channel Order",
    //             "type": "combo",
    //             "options": {
    //                 0: "RGB",
    //                 1: "RBG",
    //                 2: "GRB",
    //                 3: "GBR",
    //                 4: "BRG",
    //                 5: "BGR"
    //             },
    //             "options_map": [
    //                 [0, 1, 2],
    //                 [0, 2, 1],
    //                 [1, 0, 2],
    //                 [1, 2, 0],
    //                 [2, 0, 1],
    //                 [2, 1, 0]
    //             ],
    //             "default": 0,
    //             "help":"This should be obvious."
    //         }, {
    //             "id": "SPISpeed",
    //             "label": "SPI Speed (MHz)",
    //             "type": "int",
    //             "default": 2,
    //             "min": 1,
    //             "max": 30,
    //             //"advanced": true
    //             "help":"Clock speed for SPI bus."
    //         }, {
    //         	"id":"use_py_spi",
    //         	"label":"Use PySPI",
    //         	"type":"bool",
    //         	"default":true,
    //             "help":"Use the python-spidev package for SPI faster access. Must be installed. Uses direct file access if false."
    //         }]
    //     }
    // }

    callAPI({
        "action": "getDrivers"
    }, function(result) {
        if (result.status) {
            if (callback) callback(result.data);
        }
    })
}

