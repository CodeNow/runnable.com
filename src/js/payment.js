// get params
function getParameterByName(name,url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);

  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// events
window.addEventListener('load', function(){
  var orgName = getParameterByName('org');
  var email = getParameterByName('email');
  // ensure price has two decimal digits
  var price = parseFloat(getParameterByName('price')).toFixed(2);

  if (orgName && email && price) {
    // hide query params
    window.history.pushState('object or string', 'Title', '/private/setup-payment' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split('?')[0]);
  } else {
    // redirect if url is invalid
    window.location.replace('https://runnable.com');
  }
});
