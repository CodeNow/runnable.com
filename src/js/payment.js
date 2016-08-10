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

// replace org name
function replaceOrgName(replaceOrg,orgName) {
  for (i = 0; i < replaceOrg.length; i++) {
    replaceOrg[i].textContent = orgName;
  }
}

// replace price
function replacePriceAmount(replacePrice,price) {
  price = price.replace('/','');
  for (i = 0; i < replacePrice.length; i++) {
    replacePrice[i].textContent = price;
  }
}

// set up stripe
function setUpStripe(email,orgName,stripeButton) {
  var paymentCard = document.getElementsByClassName('card-flipper')[0];
  var checkImage = paymentCard.getElementsByClassName('icons-check')[0];
  var handler = StripeCheckout.configure({
    key: 'pk_live_5yYYZlYIwY3LwvKFaXY0jNlm',
    locale: 'auto',
    email: email,
    name: 'Runnable Preview',
    description: 'For ' + orgName + '.',
    panelLabel: 'Add Payment Info',
    token: function(token) {
      // You can access the token ID with `token.id`.
      // Get the token ID to your server-side code for use.
      paymentCard.classList.add('flip');
      checkImage.classList.add('in');
    }
  });

  stripeButton.addEventListener('click',function(e) {
    handler.open();
    e.preventDefault();
  });

  // Close Checkout on page navigation:
  window.onpopstate = function() {
    handler.close();
  };
}

// events
window.addEventListener('load', function(){
  var orgName = getParameterByName('org');
  var email = getParameterByName('email');
  var price = getParameterByName('price');

  if (orgName && email && price) {
    var stripeButton = document.getElementsByClassName('btn-stripe')[0];
    var replaceOrg = document.getElementsByClassName('js-replace-org');
    var replacePrice = document.getElementsByClassName('js-replace-price');
    var spinner = document.getElementsByClassName('spinner-wrapper')[0];

    // hide query params
    window.history.pushState('object or string', 'Title', '/private/setup-payment' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split('?')[0]);

    setUpStripe(email,orgName,stripeButton);
    replaceOrgName(replaceOrg,orgName);
    replacePriceAmount(replacePrice,price);

    stripeButton.removeChild(spinner);
    stripeButton.disabled = false;
    stripeButton.textContent = 'Add Payment Info';
  } else {
    // redirect if url is invalid
    window.location.replace('https://runnable.com');
  }
});
