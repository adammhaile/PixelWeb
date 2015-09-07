function setLogAll() {
    log.enableAll();
}

function setLogDebug() {
    log.setLevel(log.levels.DEBUG);
}

function setLogInfo() {
    log.setLevel(log.levels.INFO);
}

function setLogWarn() {
    log.setLevel(log.levels.WARN);
}

function setLogError() {
    log.setLevel(log.levels.ERROR);
}

function setLogNone() {
    log.disableAll();
}

function showHideByID(id, state) {
  $('#' + id).css('display', state ? 'block' : 'none');
}

function showLoading(state, msg) {
  if (!msg) {
    msg = "";
  }

  $("#loadingText").html(msg);

  if (state)
    $('#loading').show();
  else
    $('#loading').hide();
}

function setHeaderTitle(title) {
  $('#headerTitle').text(title);
}


function _enable(id, state) {
    if(state === undefined) state = true;
    if(state)
        $(id).removeClass('disabled');
    else
        $(id).addClass('disabled');
}

function _inArray(array, val) {
  return array.indexOf(val) >= 0;
}

function _clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function _ISOTimestamp() {
  return (new Date()).toISOString();
}

function pushMaxQ(array, val, max) {
  if (array == null) {
    return;
  }

  if (array.length >= max) {
    array.shift();
  }
  array.push(val);
}

function pushMaxUniqueQ(array, val, max) {
  if (array.indexOf(val) >= 0) return;
  pushMaxQ(array, val, max);
}

function _def(obj, def){
  return typeof obj !== 'undefined' ? obj : def;
}

function range(stop,start,step){
    start = _def(start, 0);
    step = _def(step, 1);
    stop -= step;

    var arr = [],
    c = stop - start + 1;
    while ( c-- ) {
        arr[c] = stop--
    }
    return arr;
}

function _min(array){return Math.min.apply(null, array);}
function _max(array){return Math.max.apply(null, array);}

function guid() {
    function _p8(s) {
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}
