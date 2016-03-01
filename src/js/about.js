var whitelisted = window.location.search !== '?whitelist=false';
var app = angular.module('homeApp', []);

app.controller('MainCtrl', function ($scope, $window, $http) {
  $scope.loginUrl = '{{{apiUrl}}}/auth/github?redirect={{{angularUrl}}}/?auth';
  $scope.data = {
    embedActive: false,
    hideUnauthorizedModal: whitelisted
  };

  // scroll to
  if (!whitelisted) {
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
        newURL += '/' + prevInstance;
      }
      $window.location = newURL;
    });

  // flipping cards on the about page
  var teamCard = document.getElementsByClassName('team-card');

  function flipCard(e) {
    var thisCard = e.target.parentElement.parentElement;
    thisCard.classList.toggle('flip');
  }

  window.onload = function(){
    var imgFlip = document.getElementsByClassName('img-rounded');
    for(i = 0; i < imgFlip.length; i++) {
      imgFlip[i].addEventListener('click', flipCard, false);
    }
  };
});
