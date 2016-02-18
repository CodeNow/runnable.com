var whitelisted = window.location.search !== '?whitelist=false';
var app = angular.module('homeApp', []);

app.controller('MainCtrl', function ($scope, $window, $http) {
  $scope.loginUrl = '{{{apiHost}}}/auth/github?redirect=' + $window.location.protocol + '//' + $window.location.host + '/?auth';
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
      $window.location = '/' + org;
    });

  // confirming form submit
  // var articleSignUp = document.getElementsByClassName('article-sign-up')[0];
  var formSignUp = document.getElementsByClassName('form-sign-up')[0];
  var inputEmail = document.getElementById('mce-EMAIL');
  var inputOrg = document.getElementById('mce-GH_ORG');

  function makeDirty(e){
    e.target.classList.remove('pristine');
  }

  function formSubmit(e){
    if (formSignUp.checkValidity()) {
      // articleSignUp.classList.add('submitted');
    } else {
      e.preventDefault();
    }
  }

  window.onload = function(){
    formSignUp.addEventListener('change', makeDirty);
    formSignUp.addEventListener('submit', formSubmit);
  };
});
