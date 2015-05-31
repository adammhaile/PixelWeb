//from jquery.numeric.min.js
(function(factory){if(typeof define === 'function' && define.amd){define(['jquery'], factory);}else{factory(window.jQuery);}}(function($){$.fn.numeric=function(config,callback){if(typeof config==="boolean"){config={decimal:config,negative:true,decimalPlaces:-1}}config=config||{};if(typeof config.negative=="undefined"){config.negative=true}var decimal=config.decimal===false?"":".";var negative=config.negative===true?true:false;var decimalPlaces=typeof config.decimalPlaces=="undefined"?-1:config.decimalPlaces;callback=typeof callback=="function"?callback:function(){};return this.data("numeric.decimal",decimal).data("numeric.negative",negative).data("numeric.callback",callback).data("numeric.decimalPlaces",decimalPlaces).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur)};$.fn.numeric.keypress=function(e){var decimal=$.data(this,"numeric.decimal");var negative=$.data(this,"numeric.negative");var decimalPlaces=$.data(this,"numeric.decimalPlaces");var key=e.charCode?e.charCode:e.keyCode?e.keyCode:0;if(key==13&&this.nodeName.toLowerCase()=="input"){return true}else if(key==13){return false}var allow=false;if(e.ctrlKey&&key==97||e.ctrlKey&&key==65){return true}if(e.ctrlKey&&key==120||e.ctrlKey&&key==88){return true}if(e.ctrlKey&&key==99||e.ctrlKey&&key==67){return true}if(e.ctrlKey&&key==122||e.ctrlKey&&key==90){return true}if(e.ctrlKey&&key==118||e.ctrlKey&&key==86||e.shiftKey&&key==45){return true}if(key<48||key>57){var value=$(this).val();if($.inArray("-",value.split(""))!==0&&negative&&key==45&&(value.length===0||parseInt($.fn.getSelectionStart(this),10)===0)){return true}if(decimal&&key==decimal.charCodeAt(0)&&$.inArray(decimal,value.split(""))!=-1){allow=false}if(key!=8&&key!=9&&key!=13&&key!=35&&key!=36&&key!=37&&key!=39&&key!=46){allow=false}else{if(typeof e.charCode!="undefined"){if(e.keyCode==e.which&&e.which!==0){allow=true;if(e.which==46){allow=false}}else if(e.keyCode!==0&&e.charCode===0&&e.which===0){allow=true}}}if(decimal&&key==decimal.charCodeAt(0)){if($.inArray(decimal,value.split(""))==-1){allow=true}else{allow=false}}}else{allow=true;if(decimal&&decimalPlaces>0){var dot=$.inArray(decimal,$(this).val().split(""));if(dot>=0&&$(this).val().length>dot+decimalPlaces){allow=false}}}return allow};$.fn.numeric.keyup=function(e){var val=$(this).val();if(val&&val.length>0){var carat=$.fn.getSelectionStart(this);var selectionEnd=$.fn.getSelectionEnd(this);var decimal=$.data(this,"numeric.decimal");var negative=$.data(this,"numeric.negative");var decimalPlaces=$.data(this,"numeric.decimalPlaces");if(decimal!==""&&decimal!==null){var dot=$.inArray(decimal,val.split(""));if(dot===0){this.value="0"+val;carat++;selectionEnd++}if(dot==1&&val.charAt(0)=="-"){this.value="-0"+val.substring(1);carat++;selectionEnd++}val=this.value}var validChars=[0,1,2,3,4,5,6,7,8,9,"-",decimal];var length=val.length;for(var i=length-1;i>=0;i--){var ch=val.charAt(i);if(i!==0&&ch=="-"){val=val.substring(0,i)+val.substring(i+1)}else if(i===0&&!negative&&ch=="-"){val=val.substring(1)}var validChar=false;for(var j=0;j<validChars.length;j++){if(ch==validChars[j]){validChar=true;break}}if(!validChar||ch==" "){val=val.substring(0,i)+val.substring(i+1)}}var firstDecimal=$.inArray(decimal,val.split(""));if(firstDecimal>0){for(var k=length-1;k>firstDecimal;k--){var chch=val.charAt(k);if(chch==decimal){val=val.substring(0,k)+val.substring(k+1)}}}if(decimal&&decimalPlaces>0){var dot=$.inArray(decimal,val.split(""));if(dot>=0){val=val.substring(0,dot+decimalPlaces+1);selectionEnd=Math.min(val.length,selectionEnd)}}this.value=val;$.fn.setSelection(this,[carat,selectionEnd])}};$.fn.numeric.blur=function(){var decimal=$.data(this,"numeric.decimal");var callback=$.data(this,"numeric.callback");var negative=$.data(this,"numeric.negative");var val=this.value;if(val!==""){var re=new RegExp(negative?"-?":""+"^\\d+$|^\\d*"+decimal+"\\d+$");if(!re.exec(val)){callback.apply(this)}}};$.fn.removeNumeric=function(){return this.data("numeric.decimal",null).data("numeric.negative",null).data("numeric.callback",null).data("numeric.decimalPlaces",null).unbind("keypress",$.fn.numeric.keypress).unbind("keyup",$.fn.numeric.keyup).unbind("blur",$.fn.numeric.blur)};$.fn.getSelectionStart=function(o){if(o.type==="number"){return undefined}else if(o.createTextRange&&document.selection){var r=document.selection.createRange().duplicate();r.moveEnd("character",o.value.length);if(r.text=="")return o.value.length;return Math.max(0,o.value.lastIndexOf(r.text))}else{try{return o.selectionStart}catch(e){return 0}}};$.fn.getSelectionEnd=function(o){if(o.type==="number"){return undefined}else if(o.createTextRange&&document.selection){var r=document.selection.createRange().duplicate();r.moveStart("character",-o.value.length);return r.text.length}else return o.selectionEnd};$.fn.setSelection=function(o,p){if(typeof p=="number"){p=[p,p]}if(p&&p.constructor==Array&&p.length==2){if(o.type==="number"){o.focus()}else if(o.createTextRange){var r=o.createTextRange();r.collapse(true);r.moveStart("character",p[0]);r.moveEnd("character",p[1]-p[0]);r.select()}else{o.focus();try{if(o.setSelectionRange){o.setSelectionRange(p[0],p[1])}}catch(e){}}}}}));


function strReplace(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

$.fn.dropdownAdd = function(key, value) {
    $drop = $(this)
    $.each($drop, function(i, d) {
        $d = $(d);
        $menu = $d.children(".menu");
        $menu.append('<div class="item" data-value="' + key + '">' + value + '</div>');
    });
}

$.fn.dropdownLoad = function(data) {
    $drop = $(this)
    $.each($drop, function(i, d) {
        $d = $(d);
        $d.dropdown("restore defaults");
        $menu = $d.children(".menu");
        $menu.empty();
        $.each(data, function(k, v) {
            $menu.append('<div class="item" data-value="' + k + '">' + v + '</div>');
        });
    });
};

$.fn.nud = function(config) {
    var html = '\
        <div class="ui small error message hidden" id="@id_error"><i class="close icon"></i><p id="@id_err_msg"><p></div>\
        <div class="ui labeled @action input">\
            <div class="ui label">@label</div>\
            <input type="text" style="" id="@id_input" placeholder="@placeholder">\
            @default\
        </div>\
        <div class="ui icon buttons">\
            <div class="ui button" id="@id_minus"><i class="minus icon"></i></div>\
            <div class="ui button" id="@id_plus"><i class="plus icon"></i></div>\
        </div>\
        ';

    var $node = $(this);
    var id = $node.attr('id');

    $node.val = function(value) {
        $input = $node.find("#" + id + "_input");
        var cfg = $node.data().config;

        function rangeError(state) {
            var dir = "";
            $error = $node.find("#" + id + "_error");
            if(state){
                //$($node.children(".ui.input")).addClass("error");
                var msg = "Value must be in range: " + cfg.min + " to " + cfg.max;
                $node.find("#" + id + "_err_msg").text(msg);
                dir = "in";
            }
            else
            {
                //$($node.children(".ui.input")).removeClass("error");
                if(!$error.hasClass("hidden")) dir = "out";
            }


            if(dir != "") $error.transition('scale ' + dir);
        }

        if (value != undefined) {
            rangeError(false);
            if (value != "") value = Math.floor(value);
            if(cfg.max && value > cfg.max) {
                value = cfg.max;
                rangeError(true);
            }
            if(cfg.min && value < cfg.min) {
                value = cfg.min;
                rangeError(true);
            }
            return $input.val(value);
        } else {
            var v = $input.val();
            return v == "" ? null : parseInt(v);
        }
    };

    $node.add = function(value) {
        var v = $node.val();
        v += value;
        $node.val(v);
        return value;
    };

    $node.up = function() {
        var cfg = $node.data().config;
        $node.add(cfg.step);
    };

    $node.down = function() {
        var cfg = $node.data().config;
        $node.add(cfg.step * -1);
    };

    $node.undo = function() {
        var cfg = $node.data().config;
        $node.val(cfg.default);
    };

    function onKey(){
        $node.val($node.val());
    }

    if (config) {
        var def = 'default' in config && config.default != null;
        if (!def) config.default = "";
        if (!('step' in config)) config.step = 1;
        if (!('min' in config)) config.min = null;
        if (!('max' in config)) config.max = null;

        $node.data("config", config)

        html = strReplace(html, "@action", "action");
        html = strReplace(html, "@default", '<button class="ui icon button" id="@id_undo"><i class="undo icon"></i></button>');

        html = strReplace(html, "@label", config.label)
        html = strReplace(html, "@placeholder", config.placeholder)
        html = strReplace(html, "@id", $node.attr('id'))

        $node.html(html);
        $node.find("#" + id + "_minus").click($node.down);
        $node.find("#" + id + "_plus").click($node.up);
        $node.find("#" + id + "_undo").click($node.undo);

        $node.find("#" + id + "_input").numeric(false);
        $node.find("#" + id + "_input").keyup(onKey);

        $node.find("#" + id + "_error")
          .on('click', function() {
            $(this).transition('scale out');
          });

        if (def) {
            $node.val(config.default);
        }
    }

    return $node;
};

