var _curConfig = null;

var _configs = {};
var _names = {};

var driverPickers = [];

var $controller = null;

var _animType = null;
var _animRun = null;
var $anims = null;

var $server_config = null;

var _animEditMode = false;
_animEditConfig = null;

var _curQueue = [];
// _curQueue = [{
//     "id": "GameOfLifeRGB",
//     "config": {
//         "toroidal": false
//     },
//     "run": {
//         "amt": 1,
//         "fps": 30,
//         "max_steps": 0,
//         "untilComplete": false,
//         "max_cycles": 1
//     },
//     "desc": "Game of Life"
// }, {
//     "id": "BounceText",
//     "config": {
//         "text": "",
//         "size": 1,
//         "bgcolor": [0, 0, 0],
//         "color": [255, 255, 255],
//         "buffer": 0,
//         "yPos": 0,
//         "xPos": 0
//     },
//     "run": {
//         "amt": 1,
//         "fps": 30,
//         "max_steps": 0,
//         "untilComplete": false,
//         "max_cycles": 1
//     },
//     "desc": "Bouncy Text"
// }, {
//     "id": "TicTacToe",
//     "config": {},
//     "run": {
//         "amt": 1,
//         "fps": 30,
//         "max_steps": 0,
//         "untilComplete": false,
//         "max_cycles": 1
//     },
//     "desc": "The only winning move is not to play."
// }, {
//     "id": "BounceText",
//     "config": {
//         "text": "",
//         "size": 1,
//         "bgcolor": [0, 0, 0],
//         "color": [255, 255, 255],
//         "buffer": 0,
//         "yPos": 0,
//         "xPos": 0
//     },
//     "run": {
//         "amt": 1,
//         "fps": 30,
//         "max_steps": 0,
//         "untilComplete": false,
//         "max_cycles": 1
//     },
//     "desc": "Bouncy Again"
// }];

function clearDriverChoosers() {
    $("#driver").empty();
    driverPickers = [];
}

function addDriverChooser(params) {
    var id = "driver_" + driverPickers.length;
    $("#driver").append('<div id="' + id + '" class="param_loader"></div>');
    // $("#driver").append('<div class="ui hidden divider short"></div>');
    var $d = $("#driver").children("#" + id);
    $d = $d.param_loader({
        data: _configs.driver,
        label: "Driver",
        placeholder: "Select Driver...",
        onSaveClick: function($node) {
                showPresetSaveModal("driver", $node);
            },
        onDeleteClick: function($node, preset) {
                showPresetDeleteModal("driver", preset, $node);
            }
            // default: "visualizer"
    });
    if (params) {
        setTimeout(function() {
            $d.val(params);
        }, 5);
    }

    driverPickers.push($d);
    if (driverPickers.length > 1) $("#btnRemoveDriver").removeClass('disabled');
    else $("#btnRemoveDriver").addClass('disabled');
}

function removeDriverChooser() {
    if (driverPickers.length > 1) {
        var $d = driverPickers.pop();
        $d.remove();
    }

    if (driverPickers.length > 1) $("#btnRemoveDriver").removeClass('disabled');
    else $("#btnRemoveDriver").addClass('disabled');
}

function loadAnimOptions(data, run) {
    _enable("#addQueue", false);
    _enable("#startAnim", false);
    $anims = $("#anims").param_loader({
        data: data,
        run: run,
        label: "Animation",
        placeholder: "Select Animation...",
        onSaveClick: function($node) {
            showPresetSaveModal("anim", $node);
        },
        onDeleteClick: function($node, preset) {
            showPresetDeleteModal("anim", preset, $node);
        },
        onChange: function() {
            var c = getAnimConfig();
            _enable("#addQueue", (c != null));
            _enable("#startAnim", (c != null));
        }
    });
}

function filterAnims(val) {
    var data = $controller.data('config').data;
    _animType = null;
    var anims = [];
    if (val in data) {
        _animType = data[val].control_type;
        anims = _configs.anim[_animType];
    }

    loadAnimOptions(anims, _animRun);
}

function getCurrentConfig() {
    var drivers = [];
    $.each(driverPickers, function(i, d) {
        drivers.push(d.val());
    });
    var cont = $controller.val();

    return {
        drivers: drivers,
        controller: cont
    };
}

function getAnimConfig() {
    var config = $anims.val();
    if (config.id == null) config = null;
    return config;
}

function displayCurConfig() {
    if (_curConfig.driver) {
        clearDriverChoosers();
        $.each(_curConfig.driver, function(i, d) {
            addDriverChooser(d);
        });
    }
    if (_curConfig.controller) {
        $controller.val(_curConfig.controller);
    }
}

function showBPError(msg) {
    $("#bpErrorMsg").html(msg);
    $("#BPError").modal({
        blurring: true
    }).modal('show');
}


function doSaveServerConfig() {
    var config = $server_config.val();
    saveServerConfig(config.config, function(result) {
        alert("Save Complete! Please restart server.");
        $("#serverConfig").sidebar('toggle');
    });
}

function cancelServerConfig() {
    $("#serverConfig").sidebar('toggle');
}

function showServerConfig() {
    $("#serverConfig").sidebar('toggle');
}

function setLoading(id, state) {
    if (state || state === undefined) {
        $(id).addClass('loading');
    } else {
        $(id).removeClass('loading');
    }
}

function showPresetSaveModal(type, $node) {
    $("#presetSaveBtn").removeClass('loading');
    $("#savePresetName").val('');
    $("#savePresetDesc").val('');
    $("#savePresetModal").modal({
        blurring: true,
        closable: false,
        onApprove: function() {
            $("#presetSaveBtn").addClass('loading');
            var name = $("#savePresetName").val();
            var desc = $("#savePresetDesc").val();
            var data = $node.val();
            if (type == "anim") {
                data.type = _animType;
            }
            data.display = name;
            savePreset(type, name, desc, data, function() {
                pushPreset(type, data);
                reloadPresets();
                $("#savePresetModal").modal('hide');
            })
        },
        onDeny: function() {}
    }).modal('show');
}

function showPresetDeleteModal(type, preset, $node){
    var id = $node.val().id;
    var p = findPreset(type, preset, id);
    if(p){
        if(!p[1][p[0]].locked){
            var msg = "Are you sure you want to delete the following preset? <b>" + preset.name + "</b>";
            $("#deletePresetMsg").html(msg);
            $("#deletePresetModal").modal({
                blurring: true,
                closable: false,
                onApprove: function() {
                    deletePreset(type, preset.name, function() {
                        p[1].splice(p[0], 1);
                        reloadPresets();
                        $("#deletePresetModal").modal('hide');
                    });
                },
                onDeny: function() {}
            }).modal('show');
        }
        else{
            $("#noDeleteModal").modal({
                blurring: true,
                closable: true,
            }).modal('show');
        }
    }
}

function showAddQueueModal() {
    if(_animEditMode){
        $("#addQueueHeader").html("Edit Queue Item");
        $("#addQueueBtn").html("Save");
        $("#addQueueDesc").val(_animEditConfig.config.desc);
    }
    else {
        $("#addQueueHeader").html("Add to Queue");
        $("#addQueueBtn").html("Add");
        $("#addQueueDesc").val('');
    }

    $("#addQueueModal").modal({
        blurring: true,
        closable: false,
        onApprove: function() {
            var desc = $("#addQueueDesc").val();

            var params = getAnimConfig();
            params.desc = desc;
            if(_animEditMode){
                _curQueue[_animEditConfig.index] = params;
                activatePane("Queue");
            }
            else {
                _curQueue.push(params);
            }
            $("#addQueueModal").modal('hide');
        },
        onDeny: function() {}
    }).modal('show');
}

function findPreset(t, p, id){
    var c = _configs[t];
    if (t == "anim") {
        c = c[p.data.type];
    }

    if (c != undefined && id in c) {
        if (("presets") in c[id]){
            $.each(c[id].presets, function(i, v){
                if(v.display == p.data.display){
                    index = i;
                    return false;
                }
            })
            if(index >= 0){
                return [index, c[id].presets]
            }
        }
    }

    return null;
}

function pushPreset(t, v) {
    var c = _configs[t];
    if (t == "anim") {
        c = c[v.type];
    }
    if (c != undefined && v.id in c) {
        if (!(("presets") in c[v.id]))
            c[v.id].presets = [];
        c[v.id].presets.push(v);
    }
}



function reloadPresets() {
    $controller.reloadPresets(_configs.controller);
    $.each(driverPickers, function(i, $d) {
        $d.reloadPresets(_configs.driver);
    });
    var data = $controller.data('config').data;
    var val = $controller.val().id;
    var anims = [];
    if (val in data) {
        anims = _configs.anim[data[val].control_type];
        $anims.reloadPresets(anims);
    }

}

function loadPresets() {
    callAPI({
        action: "getPresets"
    }, function(result) {
        if (result.status) {
            $.each(result.data, function(t, v) {
                if (t in _configs) {
                    var cfg = _configs[t];
                    $.each(v, function(p, val) {
                        pushPreset(t, val);
                    });
                }
            });

            reloadPresets();
        } else {
            showBPError(result.msg);
        }
    });
}

function loadConsoleStatus() {
    setLoading("#paneConsole", true);
    getStatus(function(result) {
        var html = buildFeed(result);
        $("#statusFeed").html(html);
        setLoading("#paneConsole", false);
    });
}

function loadAnimQueue() {
    var q_sort = function(event, ui){
        var num = 0;
        var temp = [];
        $.each($("#queueList").children(), function(i,v){
            num = $(v).attr('num');
            temp.push(_curQueue[num]);
        });

        _curQueue = temp;
    };

    $("#queueList").empty();
    _enable("#startQ", false);
    var html = "No animations! Go to the Animation pane and add some.";
    if(_curQueue.length > 0){
        html = buildQueueFeed(_curQueue);
        _enable("#startQ", true);
    }

    $("#queueList").html(html);
    $("#queueList").sortable({
        update: q_sort
    });

    $("#queueList .q_edit").click(function(){
        var n = $(this).closest('.item').attr('num');
        activatePane("Anim", {
            "config":_curQueue[n],
            "index": n
        });
    });

    $("#queueList .q_remove").click(function(){
        var n = $(this).closest('.item').attr('num');
        _curQueue.splice(n, 1);
        loadAnimQueue();
    });
}

function loadAnim(config){
    var isEdit = config != undefined;
    _show("#saveQueueEdit", isEdit);
    _show("#addQueue", !isEdit);
    _show("#startAnim", !isEdit);
    _show("#stopAnim", !isEdit);
    _animEditMode = isEdit;
    _animEditConfig = config;
    if(_animEditMode){
        $anims.val(config.config);
    }
}

var _paneLoadFuncs = {
    "Console": loadConsoleStatus,
    "Queue": loadAnimQueue,
    "Anim": loadAnim
}

function activatePane(id, option) {
    var menu = "mnu" + id;
    var pane = "pane" + id;
    $('.side_menu').removeClass('active');
    $('#' + menu).addClass('active');
    $('.ui_pane').hide();

    if (id in _paneLoadFuncs) {
        _paneLoadFuncs[id](option);
    }

    $('#' + pane).fadeIn();
}

function handleSideMenu() {
    var $m = $(this);
    var id = $m.attr('id').replace("mnu", "");
    activatePane(id);
}

function _startAnim(anim){
    // setLoading("#startAnim");

    callAPI({
        action: "startAnim",
        config: anim
    }, function(result) {
        console.log(result);
        if (result.status) {

        } else {
            showBPError(result.msg);
        }
        // setLoading("#startAnim", false);
    });
}
function startAnim(){
    var params = getAnimConfig();
    _startAnim(params);
}

function stopAnim(){
    setLoading("#stopAnim");
    var params = getAnimConfig();
    callAPI({
        action: "stopAnim"
    }, function(result) {
        console.log(result);
        if (result.status) {

        } else {
            showBPError(result.msg);
        }
        setLoading("#stopAnim", false);
    });
}

function startQ(){
    _startAnim({'queue':_curQueue, 'run':{}});
}

$(document)
    .ready(function() {

        $("#loadDimmer").dimmer('show');
        $('.menu .item')
            .tab();

        setLoading("body");
        getDrivers(function(drivers) {
            _configs.driver = drivers.drivers;
            _names.driver = drivers.names;
            clearDriverChoosers();
            addDriverChooser();
            getAnims(function(anims) {
                _configs.anim = anims.anims;
                _names.anim = anims.names;
                _animRun = anims.run;
                loadAnimOptions(null);
                getControllers(function(controllers) {
                    _configs.controller = controllers.controllers;
                    _names.controller = controllers.names;
                    $controller = $("#controller").param_loader({
                        data: _configs.controller,
                        label: "Controller",
                        placeholder: "Select Controller...",
                        default: null,
                        onChange: filterAnims,
                        onSaveClick: function($node) {
                            showPresetSaveModal("controller", $node);
                        },
                        onDeleteClick: function($node, preset) {
                            showPresetDeleteModal("controller", preset, $node);
                        },
                        onLoadClick: function($node) {
                            showPresetLoadModal("controller", $node);
                        }
                    });
                    loadPresets();
                    getConfig(function(config) {
                        _curConfig = config;
                        setLoading("body", false);

                        setTimeout(function() {
                            $("#loadDimmer").dimmer('hide');
                        }, 1000);
                        displayCurConfig();
                    });
                });
            });
        });

        getServerConfig(function(srv) {
            $server_config = $("#server_config").param_loader({
                data: [srv.setup],
                label: "",
                placeholder: "",
                disable_option: true,
                default: "server_config"
            });

            setTimeout(function() {
                $server_config.val(srv.config);
            }, 5);
        });

        $('.ui.accordion').accordion({
            exclusive: false
        });

        $("#startDriver").click(function() {

            setLoading("#startDriver");
            var config = getCurrentConfig();
            config.action = "startConfig"
            callAPI(config, function(result) {
                console.log(result);
                if (result.status) {

                } else {
                    showBPError(result.msg);
                }
                setLoading("#startDriver", false);
            });
        });

        $("#queueCombo")._dropdown({
            label: "Saved Queues",
            placeholder: "Select Queue...",
            default: null,
            data: null,
            // help: "params.help"
        });

        $("#btnSettings").click(showServerConfig);
        $("#saveServerConfig").click(doSaveServerConfig);
        $("#cancelServerConfig").click(cancelServerConfig);
        $("#btnAddDriver").click(addDriverChooser);
        $("#btnRemoveDriver").click(removeDriverChooser);
        $(".side_menu").click(handleSideMenu);
        $("#addQueue").click(showAddQueueModal);
        $("#startAnim").click(startAnim);
        $("#stopAnim").click(stopAnim);
        $("#startQ").click(startQ);
        $("#stopQ").click(stopAnim);
        $("#saveQueueEdit").click(showAddQueueModal);

        setTimeout(function() {
            activatePane("Queue");
        }, 1000);
    });
