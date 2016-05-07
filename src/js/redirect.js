var app = angular.module('homeApp', []);

app.controller('MainCtrl', function ($scope, $window, $http) {
  // redirect
  $http.get('{{apiUrl}}/users/me', {
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
      var newURL = '{{angularUrl}}/' + org;
      if (prevInstance) {
        newURL += '/' + prevInstance;
      }
      $window.location = newURL;
    });
});
