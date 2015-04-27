var $currentPage = null;

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
  $(id).prop('disabled', !state);
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
