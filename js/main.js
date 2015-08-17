function insert_int($node, params) {
    return $node._nud({
        label: params.label,
        placeholder: params.msg,
        default: params.default,
        min: params.min,
        max: params.max,
        step: params.step,
        help: params.help
    });
}

function insert_str($node, params) {
    return $node._input({
        label: params.label,
        placeholder: params.msg,
        default: params.default,
        help: params.help,
        replace: params.replace
    });
}

function insert_str_multi($node, params) {
    return $node._input_multi({
        label: params.label,
        placeholder: params.msg,
        default: params.default,
        help: params.help,
        replace: params.replace
    });
}

function insert_combo($node, params) {
    return $node._dropdown({
        label: params.label,
        placeholder: params.msg,
        default: params.default,
        data: params.options,
        data_map: params.options_map,
        help: params.help
    });
}

function insert_bool($node, params) {
    return $node._toggle({
        label: params.label,
        default: params.default,
        help: params.help
    });
}

function insert_color($node, params) {
    return $node._color({
        label: params.label,
        default: params.default,
        help: params.help
    });
}

var insertFuncs = {
    "int": insert_int,
    "str": insert_str,
    "combo": insert_combo,
    "bool": insert_bool,
    "color": insert_color,
    "str_multi": insert_str_multi
}

var _divider = '<div class="ui hidden divider short"></div>';

$.fn.param_loader = function(config) {
    var $node = $(this);
    var id = $node.attr('id');
    var _onChanged = null;

    function showParams($n, params, run) {
        var cfg = $node.data().config;
        cfg.control_map = {};
        cfg.run_map = {};
        $n.empty();

        //$n.append(_divider);
        $n.append('<div class="ui styled accordion" id="' + id + '_view"></div>');
        var $accordion = $n.children("#" + id + "_view");

        var _html = '\
            <div class="title" id="@id_@group_title">\
                <i class="dropdown icon"></i> @group\
            </div>\
            <div class="active content ui list" id="@id_@group_content"></div>\
        ';

        var paramMap = {"Basic":[]};

        $.each(params, function(i, v) {
            $c = $('<div id="' + v.id + '"></div>');
            $c.addClass("ui_input");
            $c.addClass("item");
            if(!v.group)
                v.group = "Basic";
            if(!(v.group in paramMap)) paramMap[v.group] = []
            paramMap[v.group].push($c);
            cfg.control_map[v.id] = insertFuncs[v.type]($c, v);
        });

        $.each(paramMap, function(k,v){
            var html = strReplace(_html, "@id", id)
            html = strReplace(html, "@group", k)
            $accordion.append(html);
            $section = $accordion.children("#" + id + "_" + k + "_content");
            $.each(v, function(i, p){
                $section.append(p);
            });
        });

        if(run){
            var run_html = '\
                <div class="title" id="@id_run_title">\
                    <i class="dropdown icon"></i> Run Parameters\
                </div>\
                <div class="active content ui list" id="@id_run_content"></div>\
            ';
            run_html = strReplace(run_html, "@id", id)
            var run_controls = [];
            $.each(run, function(i, v) {
                $c = $('<div id="' + v.id + '"></div>');
                $c.addClass("ui_input");
                $c.addClass("item");
                run_controls.push($c);
                cfg.run_map[v.id] = insertFuncs[v.type]($c, v);
            });
            $accordion.append(run_html);
            $run = $accordion.children("#" + id + "_run_content");
            $.each(run_controls, function(i, $c) {
                //$adv.append($(_divider));
                $run.append($c);
            });
        }

        $n.children('#' + id + "_view").accordion({
            exclusive: false
        });
    }

    function optionChanged(val) {
        var cfg = $node.data().config;
        showParams($("#" + id + "_params"), cfg.data[val].params, cfg.run);
        $desc = $node.children("#" + id + "_desc");
        if(cfg.data[val].desc){
            $desc.html('<p>'+ cfg.data[val].desc + '</p>');
            $desc.show();
        }
        else{
            $desc.empty();
            $desc.hide();
        }
        if(_onChanged) _onChanged(val);
    }

    //TODO - setter should take new id/config format
    $node.val = function(value){
        if(value == null){
            var cfg = $node.data().config;
            var config = {};
            $.each(cfg.control_map, function(k,v){
                config[k] = v.val();
            });
            var run = {};
            $.each(cfg.run_map, function(k,v){
                run[k] = v.val();
            });
            var idval = $node.children("#" + id + "_combo")._dropdown().val();
            if(cfg.disable_option) idval = cfg.data[0].id;
            var result = {id:idval, config: config};
            if(Object.keys(run).length > 0) result.run = run
            return result;
        }
        else{
            var cfg = $node.data().config;
            $node.children("#" + id + "_combo")._dropdown().val(value.id)
            function setParams(){
                if(value.config){
                    $.each(value.config, function(k,v){
                        if(k in cfg.control_map){
                            cfg.control_map[k].val(v);
                        }
                    });
                }
                if(value.run){
                    $.each(value.run, function(k,v){
                        if(k in cfg.run_map){
                            cfg.run_map[k].val(v);
                        }
                    });
                }
            }
            setTimeout(setParams, 0);
        }
    };

    if (config) {
        config.control_map = {};
        config.run_map = {};
        $node.data("config", config);

        $node.empty();
        $node.append('<div id="' + id + '_combo"></div>\
                      <div class="ui inverted segment" id="' + id + '_desc"></div>\
                      <div id="' + id + '_params" class="params_box"></div>\
                    ');

        $node.children("#" + id + "_desc").hide();
        var options = {};
        if(!config.data) config.data = {};
        $.each(config.data, function(k, v) {
            options[k] = {name: v.display, desc: v.desc};
        });

        $node.children("#" + id + "_combo")._dropdown({
            data: options,
            label: config.label,
            placeholder: config.placeholder,
            default: config.default,
            onChange: optionChanged
        });

        if(config.disable_option){
            $node.children("#" + id + "_combo").hide();
            //setTimeout(function(){$node.children("#" + id + "_combo").hide();}, 5);
        }

        _onChanged = config.onChange;
    }

    return $node;
}


function genFeedItem(item){
    var html = "\
    <div class='event'>\
        <div class='content'>\
          <div class='summary'>\
             @summary\
          </div>\
          <div class='date'>\
            @date\
          </div>\
        </div>\
    </div>\
    ";

    html = strReplace(html, "@date", item.timestamp);
    html = strReplace(html, "@summary", item.msg);
    return html;
}

function buildFeed(items){
    var html = '';
    $.each(items, function(i, v){
        html += genFeedItem(v);
    })
    return html;
}
