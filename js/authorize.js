(function () {
  // Redirect
  Promise.all([
    fetch('{{apiUrl}}/users/me', { credentials: 'include' })
      .then(function (res) { return res.json(); }),
    fetch('{{apiUrl}}/auth/whitelist', { credentials: 'include' })
      .then(function (res) { return res.json(); }),
  ])
    .then(function (res) {
      var user = res[0];
      var whitelistedOrgs = res[1];

      // Get variables we need
      var org;
      try {
        org = user.userOptions.uiState.previousLocation.org;
      } catch (e) {
        return;
      }
      var prevInstance;
      try {
        prevInstance = user.userOptions.uiState.previousLocation.instance;
      } catch (e) {
        return;
      }

      // Populate sign-in url
      var newURL = '{{angularUrl}}/' + org;
      if (prevInstance) {
        newURL += '/' + prevInstance;
      }
      var els = document.getElementsByClassName('btn-sandbox');
      for (var i = 0; i < els.length; i++) {
        els[i].href = newURL;
      }

      // set up avatar
      var userAvatar = document.createElement('img');
      userAvatar.src = whitelistedOrgs[0].org.avatar_url;
      userAvatar.classList.add('grid-content','shrink','avatar');
      userAvatar.height = 21;
      userAvatar.width = 21;

      // set up org name
      var userOrg = document.createElement('div');
      userOrg.classList.add('text-overflow');
      userOrg.textContent = org;

      // set up btn-sandbox in headers
      var headerBtnSandbox = document.createElement('a');
      var overflowMenu = document.getElementsByClassName('btn-overflow')[0];
      headerBtnSandbox.href = newURL;
      headerBtnSandbox.classList.add('grid-block','btn','btn-sm','btn-white','text-white','strong','btn-sandbox','hidden-xs');
      headerBtnSandbox.appendChild(userAvatar.cloneNode(true));
      headerBtnSandbox.appendChild(userOrg.cloneNode(true));
      document.getElementsByTagName('nav')[0].insertBefore(headerBtnSandbox,overflowMenu);

      // set up btn-sandbox in menus
      var menuBtnSandbox = document.createElement('a');
      var menuDivider = document.getElementsByClassName('divider')[0];
      menuBtnSandbox.href = newURL;
      menuBtnSandbox.classList.add('btn','btn-sm','grid-block','justify-center','align-center','shrink','btn-sandbox','strong','visible-xs');
      menuDivider.classList.add('visible-xs');
      menuDivider.classList.remove('visible-md');
      menuBtnSandbox.appendChild(userAvatar.cloneNode(true));
      menuBtnSandbox.appendChild(userOrg.cloneNode(true));
      document.getElementsByClassName('list text-left')[0].insertBefore(menuBtnSandbox,menuDivider);

      // hide sign in and sign up links
      var hideIfSignedIn = document.getElementsByClassName('js-hide-if-signed-in');
      for (var z = hideIfSignedIn.length; z > 0; z--) {
        var i = z - 1;
        if (hideIfSignedIn[i].parentNode) {
          hideIfSignedIn[i].parentNode.removeChild(hideIfSignedIn[i]);
        }
      }
    });
}());