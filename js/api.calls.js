function getDrivers(callback) {
    callAPI({"action": "getDrivers"}, function(result) {
        if (result.status) {
            if (callback) callback(result.data);
        }
    });
}

function getControllers(callback) {
    callAPI({"action": "getControllers"}, function(result) {
        if (result.status) {
            if (callback) callback(result.data);
        }
    });
}

function getAnims(callback) {
    callAPI({"action": "getAnims"}, function(result) {
        if (result.status) {
            if (callback) callback(result.data);
        }
    });
}
