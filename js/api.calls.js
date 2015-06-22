function _get(action, callback) {
    callAPI({"action": action}, function(result) {
        if (result.status) {
            if (callback) callback(result.data);
        }
    });
}

function getDrivers(callback) { _get("getDrivers", callback); }

function getControllers(callback) { _get("getControllers", callback); }

function getAnims(callback) { _get("getAnims", callback); }

function getConfig(callback) { _get("getConfig", callback); }

