var _curConfig = null;

var _configs = {};

var driverPickers = [];

var $controller = null;

var _animType = null;
var _animRun = null;
var $anims = null;

var $server_config = null;

function clearDriverChoosers() {
    $("#driver").empty();
    driverPickers = [];
}

function addDriverChooser(params) {
    var id = "driver_" + driverPickers.length;
    $("#driver").append('<div id="' + id + '"></div>');
    $("#driver").append('<div class="ui hidden divider short"></div>');
    var $d = $("#driver").children("#" + id);
    $d = $d.param_loader({
        data: _configs.driver,
        label: "Driver",
        placeholder: "Select Driver...",
        onSaveClick:  function($node){showPresetSaveModal("driver", $node);},
        onLoadClick: function($node){showPresetLoadModal("driver", $node);}
        // default: "visualizer"
    });
    if (params) {
        setTimeout(function() {
            $d.val(params);
        }, 5);
    }

    driverPickers.push($d);
}

function loadAnimOptions(data, run) {
    $anims = $("#anims").param_loader({
        data: data,
        run: run,
        label: "Animation",
        placeholder: "Select Animation...",
        onSaveClick:  function($node){showPresetSaveModal("anim", $node);},
        onLoadClick: function($node){showPresetLoadModal("anim", $node);}
    });
}

function filterAnims(val) {
    _animType = val;
    loadAnimOptions(_configs.anim[val], _animRun);
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
    return config;
}

function displayCurConfig(){
    if (_curConfig.driver) {
        clearDriverChoosers();
        $.each(_curConfig.driver, function(i, d) {
            addDriverChooser(d);
        });
        // $.each(_curConfig.driver, function(i, d){
        //     driverPickers[i].val(d);
        // });
    }
    if (_curConfig.controller) {
        $controller.val(_curConfig.controller);
    }
}

function showBPError(msg){
    $("#bpErrorMsg").html(msg);
    $("#BPError").modal({blurring:true}).modal('show');
}

function showStatusFeed(){
    getStatus(function(result){
        var html = buildFeed(result);
        $("#statusFeed").html(html);
        $("#statusFeedModal").modal({blurring:true, closable:true}).modal('show');
    });
}

function doSaveServerConfig() {
    var config = $server_config.val();
    saveServerConfig(config.config, function(result){
        console.log(result);
        alert("Save Complete! Please restart server.");
        $("#serverConfig").sidebar('toggle');
    });
}

function cancelServerConfig() {
    $("#serverConfig").sidebar('toggle');
}

function showServerConfig(){
    $("#serverConfig").sidebar('toggle');
}

function setLoading(id, state){
    if(state || state === undefined){
        $(id).addClass('loading');
    }
    else {
        $(id).removeClass('loading');
    }
}

function showPresetSaveModal(type, $node){
    $("#presetSaveBtn").removeClass('loading');
    $("#savePresetName").val('');
    $("#savePresetDesc").val('');
    $("#savePresetModal").modal({
        blurring:true,
        closable:false,
        onApprove: function(){
            $("#presetSaveBtn").addClass('loading');
            var name = $("#savePresetName").val();
            var desc = $("#savePresetDesc").val();
            var data = $node.val();
            if(type == "anim"){
                data.type = _animType;
            }
            savePreset(type, name, desc, data, function(){
                $("#savePresetModal").modal('hide');
            })
        },
        onDeny: function(){}
    }).modal('show');
}

function savePreset(type, name, desc, data, callback){
    data.help = desc;
    callAPI({
        action:"savePreset",
        name: name,
        data: data,
        type: type
    }, function(result){
        console.log(result);
        if(callback) callback();
    });
}

function showPresetLoadModal(type, $node){
    var _presets = {};
    var doLoad = function(){
        var n = $(this);
        var name = n.attr('name');
        if(name in _presets){
            console.log($node);
            $node.val(_presets[name]);
            $("#loadPresetModal").modal('hide');
        }
    }
    $("#loadPresetList").empty();
    callAPI({
        action:"getPresets",
        type: type
    }, function(result){
        if(result.status){
            _presets = result.data;
            var html = buildPresetList(result.data, type);
            $("#loadPresetList").html(html);
            $("#loadPresetList .presetLoadBtn").click(doLoad);
            $("#loadPresetModal").modal({
                blurring:true,
                closable:true
                // onApprove: function(){
                //     $("#presetSaveBtn").addClass('loading');
                //     var name = $("#savePresetName").val();
                //     var desc = $("#savePresetDesc").val();
                //     var data = $node.val();
                //     savePreset(type, name, desc, data, function(){
                //         $("#savePresetModal").modal('hide');
                //     })
                // },
                // onDeny: function(){}
            }).modal('show');

        }
        else {
            showBPError(result.msg);
        }
    });


}


$(document)
    .ready(function() {

        $("#loadDimmer").dimmer('show');
        $('.menu .item')
            .tab();

        setLoading("body");
        getDrivers(function(drivers) {
            _configs.driver = drivers;
            clearDriverChoosers();
            addDriverChooser();
            getAnims(function(anims) {
                _configs.anim = anims.anims;
                _animRun = anims.run;
                loadAnimOptions(null);
                getControllers(function(controllers) {
                    _configs.controller = controllers;
                    $controller = $("#controller").param_loader({
                        data: controllers,
                        label: "Controller",
                        placeholder: "Select Controller...",
                        default: "matrix",
                        onChange: filterAnims,
                        onSaveClick: function($node){showPresetSaveModal("controller", $node);},
                        onLoadClick: function($node){showPresetLoadModal("controller", $node);}
                    });

                    getConfig(function(config) {
                        _curConfig = config;
                        setLoading("body", false);

                        setTimeout(function(){$("#loadDimmer").dimmer('hide');}, 1000);
                    });
                });
            });
        });

        setTimeout(displayCurConfig, 1000);

        getServerConfig(function(srv) {
            console.log(srv);
            $server_config = $("#server_config").param_loader({
                data: [srv.setup],
                label: "",
                placeholder: "",
                disable_option: true,
                default: "server_config"
            });

            setTimeout(function(){$server_config.val(srv.config);}, 5);
        });

        $('.ui.accordion').accordion({
            exclusive: false
        });

        $("#startDriver").click(function() {

            setLoading("#startDriver");
            var config = getCurrentConfig();
            console.log(config);
            config.action = "startConfig"
            callAPI(config, function(result) {
                console.log(result);
                if(result.status){

                }
                else {
                    showBPError(result.msg);
                }
                setLoading("#startDriver", false);
            });
        });

        $("#startAnim").click(function() {
            setLoading("#startAnim");
            var params = getAnimConfig();
            callAPI({
                action: "startAnim",
                config: {
                    id: params.id,
                    config: params.config
                },
                run: params.run
            }, function(result) {
                console.log(result);
                if(result.status){

                }
                else {
                    showBPError(result.msg);
                }
                setLoading("#startAnim", false);
            });
        });

        $("#stopAnim").click(function() {
            setLoading("#stopAnim");
            var params = getAnimConfig();
            callAPI({
                action: "stopAnim"
            }, function(result) {
                console.log(result);
                if(result.status){

                }
                else {
                    showBPError(result.msg);
                }
                setLoading("#stopAnim", false);
            });
        });

        $("#btnStatus").click(showStatusFeed);
        $("#btnSettings").click(showServerConfig);
        $("#saveServerConfig").click(doSaveServerConfig);
        $("#cancelServerConfig").click(cancelServerConfig);
    });
