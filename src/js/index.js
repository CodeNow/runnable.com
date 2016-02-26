var whitelisted = window.location.search !== '?whitelist=false';
var app = angular.module('homeApp', []);

app.controller('MainCtrl', function ($scope, $window, $http) {
  $scope.loginUrl = '{{{apiHost}}}/auth/github?redirect={{{angularHost}}}/?auth';
  $scope.data = {
    embedActive: false,
    hideUnauthorizedModal: whitelisted
  };

  // scroll to
  if (!whitelisted) {
    location.hash = '#sign-up';
  }

  $http.get('{{{apiHost}}}/users/me', {
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
      var newURL = '{{{angularHost}}}/' + org;
      if (prevInstance) {
        newURL += '/' + prevInstance
      }
      $window.location = newURL;
    });

  // confirming form submit
  // var articleSignUp = document.getElementsByClassName('article-sign-up')[0];
  var formSignUp = document.getElementsByClassName('form-sign-up')[0];
  var inputEmail = document.getElementById('mce-EMAIL');
  var inputOrg = document.getElementById('mce-GH_ORG');

  function markInvalid(e) {
    var thisForm = e.target.getElementsByTagName('input');

    for (i = 0; i < thisForm.length; i++) {
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
      // articleSignUp.classList.add('submitted');
    } else {
      markInvalid(e);
      e.preventDefault();
    }
  }

  window.onload = function(){
    formSignUp.addEventListener('change', makeDirty);
    formSignUp.addEventListener('submit', formSubmit);
  };
});
