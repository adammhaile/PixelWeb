function getDrivers(callback) {
    var drivers = {
        "serial": {
            "display": "Serial (AllPixel)",
            "params": [{
                "id": "type",
                "label": "LED Type",
                "type": "combo",
                "options": {
                    0: "GENERIC",
                    1: "LPD8806",
                    2: "WS2801",
                    3: "WS281x",
                    4: "WS2811_400",
                    5: "TM1804",
                    6: "TM1803",
                    7: "UCS1903",
                    8: "SM16716",
                    9: "APA102",
                    10: "LPD1886",
                    11: "P98131"
                },
                "default": null,
            }, {
                "id": "num",
                "label": "# Pixels",
                "type": "int",
                "default": 1,
                "min": 1
            }, {
                "id": "dev",
                "label": "Device Path",
                "type": "str",
                "default": "",
            }, {
                "id": "SPISpeed",
                "label": "SPI Speed (MHz)",
                "type": "int",
                "default": 2,
                "min": 1,
                "max": 24,
            }, ]
        }
    }
    if (callback) callback(drivers);
}
