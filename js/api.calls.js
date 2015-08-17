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

function getServerConfig(callback) { _get("getServerConfig", callback); }

function saveServerConfig(config, callback) {
    callAPI({action: "saveServerConfig", config: config}, function(result) {
        if (result.status) {
            if (callback) callback(result.data);
        }
    });
}

function getStatus(callback) {_get("getStatus", callback);}

function getErrors(callback) {_get("getErrors", callback);}
