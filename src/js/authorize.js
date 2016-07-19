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
      userAvatar.src = user.gravatar;
      userAvatar.classList.add('avatar');
      userAvatar.height = 21;
      userAvatar.width = 21;

      // set up btn-sandbox in headers
      var headerBtnSandbox = document.createElement('a');
      var overflowMenu = document.getElementsByClassName('btn-overflow')[0];
      headerBtnSandbox.href = newURL;
      headerBtnSandbox.classList.add('grid-block','btn','btn-sm','btn-white','text-white','strong','btn-sandbox','hidden-xs');
      headerBtnSandbox.textContent = 'Your Sandbox';
      headerBtnSandbox.appendChild(userAvatar.cloneNode(true));
      document.getElementsByTagName('nav')[0].insertBefore(headerBtnSandbox,overflowMenu);

      // set up btn-sandbox in menus
      var menuBtnSandbox = document.createElement('a');
      var menuDivider = document.getElementsByClassName('divider')[0];
      menuBtnSandbox.href = newURL;
      menuBtnSandbox.classList.add('btn','btn-sm','grid-block','justify-center','align-center','shrink','btn-sandbox','strong','visible-xs');
      menuDivider.classList.add('visible-xs');
      menuDivider.classList.remove('visible-md');
      menuBtnSandbox.textContent = 'Your Sandbox';
      menuBtnSandbox.appendChild(userAvatar.cloneNode(true));
      document.getElementsByClassName('list text-left')[0].insertBefore(menuBtnSandbox,menuDivider);

      // hide sign in and sign up links
      var signUpButtons = document.querySelectorAll('[data-target="#sign-up"]');
      var signInButtons = document.querySelectorAll('[data-target="#sign-in"]');
      for (var i = 0; i < signUpButtons.length; i++) {
        signUpButtons[i].parentNode.removeChild(signUpButtons[i]);
      }
      for (var i = 0; i < signInButtons.length; i++) {
        signInButtons[i].parentNode.removeChild(signInButtons[i]);
      }
    });
}());
