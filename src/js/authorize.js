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

      // Get variables we need
      var org;
      try {
        org = user.userOptions.uiState.previousLocation.org;
      } catch (e) {
        return
      }
      var prevInstance;
      try {
        prevInstance = user.userOptions.uiState.previousLocation.instance;
      } catch (e) {
        return
      }

      // Show/Hide all elements
      var els = document.getElementsByClassName('js-if-not-signed-in')
      for (var i = 0; i < els.length; i++) {
        els[i].style.display = 'none';
      }
      var els = document.getElementsByClassName('js-if-signed-in')
      for (var i = 0; i < els.length; i++) {
        els[i].style.display = 'flex';
      }

      // Populate sign-in url
      var newURL = '{{angularUrl}}/' + org;
      if (prevInstance) {
        newURL += '/' + prevInstance;
      }
      var els = document.getElementsByClassName('btn-sandbox')
      for (var i = 0; i < els.length; i++) {
        els[i].href = newURL;
      }
      console.log('newUrl', newURL)
    });
}())
