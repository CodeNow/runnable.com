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
    window.fbq = function () {};
  }

  // scroll to
  if (!whitelisted) {
    fbq('track', 'ViewContent', {
      action: 'notWhitelisted'
    });
    location.hash = '#sign-up-modal';
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
        newURL += '/' + prevInstance;
      }
      $window.location = newURL;
    });
});
