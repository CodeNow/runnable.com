(function () {
  // Redirect
  console.log('hello')
  Promise.all([
    fetch('{{apiUrl}}/users/me', { credentials: 'include' })
      .then(function (res) { return res.json() }),
    fetch('{{apiUrl}}/auth/whitelist', { credentials: 'include' })
      .then(function (res) { return res.json() }),
  ])
    .then(function (res) {
      var user = res[0]
      var whitelistedOrgs = res[1]
      if (!user || !whitelistedOrgs) {
        return
      }
      var org;
      try {
        org = user.userOptions.uiState.previousLocation.org;
      } catch (e) {}
      var prevInstance;
      try {
        prevInstance = user.userOptions.uiState.previousLocation.instance;
      } catch (e) {}
      newURL = '{{angularUrl}}/' + org;
      if (prevInstance) {
        newURL += '/' + prevInstance;
      }
      console.log('newUrl', newUrl)
      // $window.location = newURL;
    });
}())
