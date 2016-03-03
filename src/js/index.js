var whitelisted = window.location.search !== '?whitelist=false';
var app = angular.module('homeApp', []);

app.controller('MainCtrl', function ($scope, $window, $http) {
  $scope.loginUrl = '{{{apiUrl}}}/auth/github?redirect={{{angularUrl}}}/?auth';
  $scope.data = {
    embedActive: false,
    hideUnauthorizedModal: whitelisted
  };

  if (!window.fbq) {
    // Stub fbq
    window.fbq = function () {}
  }

  // scroll to
  if (!whitelisted) {
    fbq('track', 'ViewContent', {
      action: 'notWhitelisted'
    });
    location.hash = '#sign-up';
  }

  $http.get('{{{apiUrl}}}/users/me', {
      withCredentials: true
    })
    .then(function (user) {
      var org;
      try {
        org = user.data.userOptions.uiState.previousLocation.org;
      } catch (e) {
        org = user.data.accounts.github.username;
      }
      var prevInstance;
      try {
        prevInstance = user.data.userOptions.uiState.previousLocation.instance;
      } catch (e) {
      }
      var newURL = '{{{angularUrl}}}/' + org;
      if (prevInstance) {
        newURL += '/' + prevInstance
      }
      $window.location = newURL;
    });

  // form submit
  var formSignUp = document.getElementsByClassName('form-sign-up')[0];

  function markInvalid(e) {
    var thisForm = e.target.getElementsByTagName('input');

    for (var i = 0; i < thisForm.length; i++) {
      if (!thisForm[i].validity.valid) {
        thisForm[i].classList.add('invalid');
      }
    }
  }

  function makeDirty(e){
    e.target.classList.remove('pristine', 'invalid');
  }

  function formSubmit(e){
    if (formSignUp.checkValidity()) {
      fbq('track', 'Lead');
    } else {
      markInvalid(e);
      e.preventDefault();
    }
  }

  // flipping cards
  function flipCard(e) {
    e.target.parentElement.parentElement.classList.toggle('flip');
  }

  // events
  window.onload = function(){
    if (formSignUp) {
      //sign up form
      formSignUp.addEventListener('change', makeDirty);
      formSignUp.addEventListener('submit', formSubmit);
    }

    // flipping cards
    var imgFlip = document.getElementsByClassName('img-rounded');

    if (imgFlip) {
      for (var i = 0; i < imgFlip.length; i++) {
        imgFlip[i].addEventListener('click', flipCard, false);
      }
    }
  };
});
