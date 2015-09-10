function _get(action, callback) {
    callAPI({"action": action}, function(result) {
        if (result.status) {
            if (callback) callback(result.data);
        }
        else {
            showBPError(result.msg);
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
function getErrors(callback) {_get("getErrors",  callback);}

function savePreset(type, name, desc, data, callback) {
    data.desc = desc;
    callAPI({
        action: "savePreset",
        name: name,
        data: data,
        type: type
    }, function(result) {
        if (callback) callback();
    });
}

function deletePreset(type, name, callback) {
    callAPI({
        action: "deletePreset",
        name: name,
        type: type
    }, function(result) {
        if (callback) callback();
    });
}
