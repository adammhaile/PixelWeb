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
        help: params.help
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

var insertFuncs = {
    "int": insert_int,
    "str": insert_str,
    "combo": insert_combo,
    "bool": insert_bool,
}

var _divider = '<div class="ui hidden divider short"></div>';

$.fn.param_loader = function(config) {
    var $node = $(this);
    var id = $node.attr('id');

    function showParams($n, params) {
        var cfg = $node.data().config;
        cfg.control_map = {};
        $n.empty();

        $n.append(_divider);
        $n.append('<div class="ui styled accordion" id="' + id + '_view"></div>');
        var $accordion = $n.children("#" + id + "_view");

        var basic_html = '\
            <div class="active title" id="@id_basic_title">\
                <i class="dropdown icon"></i> Basic\
            </div>\
            <div class="active content" id="@id_basic_content"></div>\
        ';

        var adv_html = '\
            <div class="active title" id="@id_advanced_title">\
                <i class="dropdown icon"></i> Advanced\
            </div>\
            <div class="content" id="@id_advanced_content"></div>\
        ';

        basic_html = strReplace(basic_html, "@id", id)
        adv_html = strReplace(adv_html, "@id", id)

        var basic_controls = [];
        var adv_controls = [];

        $.each(params, function(i, v) {
            $c = $('<div id="' + v.id + '"></div>');
            $c.addClass("ui_input");
            if (v.advanced) adv_controls.push($c);
            else basic_controls.push($c);
            cfg.control_map[v.id] = insertFuncs[v.type]($c, v);
        });

        var adv = adv_controls.length > 0;

        $accordion.append(basic_html);
        $basic = $accordion.children("#" + id + "_basic_content");
        $.each(basic_controls, function(i, $c) {
            //$basic.append($(_divider));
            $basic.append($c);
        });

        if (adv) {
            $accordion.append(adv_html);
            $adv = $accordion.children("#" + id + "_advanced_content");
            $.each(adv_controls, function(i, $c) {
                //$adv.append($(_divider));
                $adv.append($c);
            });
        }

        $n.children('#' + id + "_view").accordion({
            exclusive: false
        });
    }

    function optionChanged(val) {
        var cfg = $node.data().config;
        showParams($("#" + id + "_params"), cfg.data[val].params);
    }

    $node.val = function(value){
        if(value == null){
            var cfg = $node.data().config;
            var results = {};
            $.each(cfg.control_map, function(k,v){
                results[k] = v.val();
            });
            return {id:$node.children("#" + id + "_combo")._dropdown().val(), config: results};
        }
        else{
            var cfg = $node.data().config;
            $.each(value, function(k,v){
                if(k in cfg.control_map){
                    cfg.control_map[k].val(v);
                }
            });
        }
    };

    if (config) {
        config.control_map = {};
        $node.data("config", config);

        $node.empty();
        $node.append('<div id="' + id + '_combo"></div>\
                      <div id="' + id + '_params"></div>\
                    ');

        var options = {};
        $.each(config.data, function(k, v) {
            options[k] = v.display;
        });

        $node.children("#" + id + "_combo")._dropdown({
            data: options,
            label: config.label,
            placeholder: config.placeholder,
            default: config.default,
            onChange: optionChanged
        });
    }

    return $node;
}
