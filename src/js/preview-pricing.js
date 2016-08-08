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

// set up stripe
function setUpStripe(email,orgName,stripeButton) {
  var paymentCard = document.getElementsByClassName('card-wrapper')[0];
  var checkImage = paymentCard.getElementsByClassName('icons')[0];
  var handler = StripeCheckout.configure({
    key: 'pk_test_sHr5tQaPtgwiE2cpW6dQkzi8',
    locale: 'auto',
    email: email,
    name: 'Runnable Preview',
    description: 'For ' + orgName + '.',
    panelLabel: 'Save Card',
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

  if (orgName && email) {
    var stripeButton = document.getElementsByClassName('btn-stripe')[0];
    var replaceOrg = document.getElementsByClassName('js-replace-org');

    // hide query params
    window.history.pushState('object or string', 'Title', '/preview-pricing' + window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split('?')[0]);

    if (stripeButton) {
      setUpStripe(email,orgName,stripeButton);
    }
    if (replaceOrg) {
      replaceOrgName(replaceOrg,orgName);
    }
  } else {
    // redirect if url is invalid
    window.location.replace('https://runnable.com');
  }
});
