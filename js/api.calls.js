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

//var _statusList = [];
function getStatus(callback) {_get("getStatus", callback);}//function(data){
//     $.each(data, function(i,v){
//         pushMaxQ(_statusList, v, 100);
//     });
//     if(callback) callback(_statusList);
// });}

//var _errorList = [];
function getErrors(callback) {_get("getErrors",  callback);}//function(data){
//     $.each(data, function(i,v){
//         pushMaxQ(_errorList, v, 100);
//     });
//     if(callback) callback(_errorList);
// });}
