// modals
function openModal(event,dragging) {
  if (!dragging) {
    var openModal = document.getElementsByClassName('modal-backdrop in')[0];
    var modalName = event.target.getAttribute('data-target').substring(1);
    var modal = document.getElementById(modalName);
    var closeTrigger = modal.getElementsByClassName('js-modal-close')[0];

    // close open modal
    if (openModal) {
      openModal.classList.remove('in');
    }
    // show modal
    modal.classList.add('in');
    // stop scrolling
    document.body.classList.add('modal-open');
    // triggers for close button
    closeTrigger.addEventListener('click', closeModal);
    closeTrigger.addEventListener('touchend', closeModal);
    // trigger for esc key
    document.addEventListener('keydown', escModal);

    if (modalName === 'sign-up') {
      setupForm('signup');
    }

    if (modalName === 'video') {
      addVideo();
    }

    // mixpanel
    mixpanel.track('Open Modal: ' + modalName);
  }
}

function escModal(event) {
  if (event.keyCode == 27) {
    closeModal(event);
  }
}

function closeModal(event) {
  var modal = document.getElementsByClassName('modal-backdrop in')[0];
  var closeTrigger = modal.getElementsByClassName('js-modal-close')[0];
  var iframe;

  event.preventDefault();
  // hide modal
  modal.classList.remove('in');
  // resume scrolling
  document.body.classList.remove('modal-open');
  // remove triggers
  closeTrigger.removeEventListener('click', closeModal);
  closeTrigger.removeEventListener('touchend', closeModal);
  document.removeEventListener('keydown', escModal);
  // delete video if it exists
  if (modal.getElementsByTagName('iframe').length) {
    iframe = modal.getElementsByTagName('iframe')[0];
    iframe.parentNode.removeChild(iframe);
  }
}

// add video player
function addVideo() {
  var player = document.getElementById('video')
  var iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder','0');
  iframe.setAttribute('allowfullscreen','');
  iframe.setAttribute('src', 'https://www.youtube.com/embed/BX5iPEWSrnY?showinfo=0&autoplay=1&rel=0');
  iframe.classList.add('video-player');
  player.appendChild(iframe);
}

// show bitbucket form
function openBitbucketForm() {
  var gitHubForm = document.getElementsByClassName('article-github')[0];
  var gitHubTrigger = document.getElementsByClassName('js-open-github')[0];
  var bitbucketForm = document.getElementsByClassName('article-bitbucket')[0];
  var bitbucketTrigger = document.getElementsByClassName('js-open-bitbucket')[0];

  bitbucketTrigger.classList.add('hide');
  bitbucketForm.classList.remove('out');
  bitbucketForm.classList.add('in');
  gitHubTrigger.classList.remove('hide');
  gitHubForm.classList.remove('in');
  gitHubForm.classList.add('out');
  // mixpanel
  mixpanel.track('Open Bitbucket form');
}

// show github form
function openGitHubForm() {
  var gitHubForm = document.getElementsByClassName('article-github')[0];
  var gitHubTrigger = document.getElementsByClassName('js-open-github')[0];
  var bitbucketForm = document.getElementsByClassName('article-bitbucket')[0];
  var bitbucketTrigger = document.getElementsByClassName('js-open-bitbucket')[0];

  gitHubTrigger.classList.add('hide');
  gitHubForm.classList.remove('out');
  gitHubForm.classList.add('in');
  bitbucketTrigger.classList.remove('hide');
  bitbucketForm.classList.remove('in');
  // mixpanel
  mixpanel.track('Open GitHub form');
}

// set up forms
function setupForm(formName) {
  var formEl;
  if (formName === 'signup') {
    var gitHubForm = document.getElementsByClassName('article-github')[0];
    var bitbucketForm = document.getElementsByClassName('article-bitbucket')[0];
    var openBitbucketFormTrigger = document.getElementsByClassName('js-open-bitbucket')[0];
    var openGitHubFormTrigger = document.getElementsByClassName('js-open-github')[0];
    var linkGitHub = document.getElementsByClassName('track-grant-access-github')[0];

    openGitHubFormTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      openGitHubForm();
    });
    openGitHubFormTrigger.addEventListener('touchend', function(e) {
      e.stopPropagation();
      e.preventDefault();
      openGitHubForm();
    });
    openBitbucketFormTrigger.addEventListener('click', function(e) {
      e.stopPropagation();
      e.preventDefault();
      openBitbucketForm();
    });
    openBitbucketFormTrigger.addEventListener('touchend', function(e) {
      e.stopPropagation();
      e.preventDefault();
      openBitbucketForm();
    });

    if (gitHubForm.classList.contains('in')) {
      formEl = document.getElementsByClassName('form-github');
    } else if (bitbucketForm.classList.contains('in')) {
      formEl = document.getElementsByClassName('form-bitbucket');
    }

    // mixpanel
    linkGitHub.addEventListener('click', function(){
      mixpanel.track('Open URL: GitHub Auth');
    });
    linkGitHub.addEventListener('touchend', function(){
      mixpanel.track('Open URL: GitHub Auth');
    });
  } else if (formName === 'enterprise') {
    formEl = document.getElementsByClassName('form-enterprise');
  }
  for (i = 0; i < formEl.length; i++) {
    formEl[i].addEventListener('change', makeDirty);
    formEl[i].addEventListener('submit', submitForm);
    formEl[i].getElementsByTagName('input')[0].addEventListener('invalid', formInvalid);
    formEl[i].getElementsByTagName('input')[1].addEventListener('invalid', formInvalid);
  }
}

function markInvalid(e) {
  var thisTarget = e.target;
  var theseInputs;
  var i;

  if (thisTarget.tagName == 'INPUT') {
    // for invalid event
    if (thisTarget.type === 'checkbox') {
      while ((thisTarget = thisTarget.parentNode) && !thisTarget.classList.contains('checkbox-group'));
    }
    thisTarget.classList.add('invalid');
  } else {
    // for change event
    theseInputs = thisTarget.getElementsByTagName('input');
    for (i = 0; i < theseInputs.length; i++) {
      if (!theseInputs[i].validity.valid) {
        theseInputs[i].classList.add('invalid');
      }
    }
  }
}

function shakeForm(e) {
  var thisForm = e.target;

  // get shake element
  if (!thisForm.classList.contains('shake-me')) {
    while ((thisForm = thisForm.parentNode) && !thisForm.classList.contains('shake-me'));
  }
  thisForm.classList.add('shake');
  thisForm.addEventListener('animationend', function(){
    thisForm.classList.remove('shake');
    thisForm.removeEventListener('animationend', function(){});
  });
}

function makeDirty(e) {
  var thisTarget = e.target;

  if (thisTarget.type === 'checkbox') {
    var theseInputs;
    var targetParent = thisTarget;

    // get parent
    while ((targetParent = targetParent.parentNode) && !targetParent.classList.contains('checkbox-group'));
    // get all inputs in parent
    theseInputs = targetParent.getElementsByTagName('input');
    // toggle required state
    if (thisTarget.checked) {
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].removeAttribute('required');
      }
    } else {
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].setAttribute('required','required');
      }
    }
  }
  thisTarget.classList.remove('pristine', 'invalid');
}

function formInvalid(e) {
  markInvalid(e);
  shakeForm(e);
}

function toggleEditing(form, state) {
  var i;
  var theseInputs = form.getElementsByTagName('input');
  var theseTextareas = form.getElementsByTagName('textarea')[0];
  var submitButton = form.getElementsByTagName('button')[0];
  var spinner = document.getElementsByClassName('spinner-wrapper');

  if (state === 'disable') {
    if (theseInputs) {
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].disabled = true;
      }
    }
    if (theseTextareas) {
      theseTextareas.disabled = true;
    }
    submitButton.disabled = true;
    if (submitButton.classList.contains('green')) {
      submitButton.children[0].innerHTML += '<div class="grid-content shrink spinner-wrapper spinner-sm spinner-white"><svg viewbox="0 0 16 16" class="spinner"><circle cx="8" cy="8" r="7" stroke-linecap="round" class="path"></circle></svg></div>';
    } else {
      submitButton.children[0].innerHTML += '<div class="grid-content shrink spinner-wrapper spinner-sm spinner-gray"><svg viewbox="0 0 16 16" class="spinner"><circle cx="8" cy="8" r="7" stroke-linecap="round" class="path"></circle></svg></div>';
    }
  }
  if (state === 'enable') {
    if (theseInputs) {
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].disabled = false;
      }
    }
    if (theseTextareas) {
      theseTextareas.disabled = false;
    }
    submitButton.disabled = false;
    spinner[0].parentNode.removeChild(spinner[0]);
  }
}

function xhrSubmit(e, form, formData, formName) {
  var xhr = new XMLHttpRequest();
  var xhrUrl;
  var supportEmail;

  if (formName === 'bitbucket') {
    xhrUrl = 'https://codenow.com:8443/bitbucket';
    supportEmail = 'bitbucket@runnable.com';
  } else if (formName === 'enterprise') {
    xhrUrl = 'https://codenow.com:2096/notify/enterprise';
    supportEmail = 'preview@runnable.com';
  }

  // send form
  xhr.open('POST', xhrUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(formData);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 0) {
      shakeForm(e);
      sundipValidation('An error occured. Send us an email at <a class="link" href="mailto:' + supportEmail + '">' + supportEmail + '</a> for help.', form, formName);
      toggleEditing(form, 'enable'); // re-enables form
      // mixpanel
      mixpanel.track('XHR Submit: ' + formName, {
        'server-side validation': 'fail',
        'error': 'xhr.readyState === 4 && xhr.status === 0'
      });
    }
  };
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    var resultCode = response.result_code;
    var resultMessage = response.result_message;
    var successMsg = form.parentNode.getElementsByClassName('hide')[0];

    // result_codes:
    // -1 = error from sundip
    // 0 = error from active campaign
    // 1 = success from active campaign
    if (resultCode === -1 || resultCode === 0) {
      shakeForm(e);
      sundipValidation(resultMessage, form, formName);
      // mixpanel
      mixpanel.track('XHR Submit: ' + formName, {
        'server-side validation': 'fail',
        'error': (resultCode === -1 ? 'From Sundip’s script' : 'From Active Campaign')
      });
    }
    if (resultCode === 1) {
      // tell the user something nice
      form.classList.add('hide');
      form.classList.remove('show');
      successMsg.classList.add('show');
      successMsg.classList.remove('hide');
      // mixpanel
      mixpanel.track('XHR Submit: ' + formName, {
        'server-side validation': 'pass'
      });
    }
    toggleEditing(form, 'enable'); // re-enables form
  };
}

function submitForm(e) {
  var form = e.target;
  var formName;

  if (form.classList.contains('form-github')) {
    formName = 'github';
  } else if (form.classList.contains('form-bitbucket')) {
    formName = 'bitbucket';
  } else if (form.classList.contains('form-enterprise')) {
    formName = 'enterprise';
  }

  e.preventDefault();

  if (form.checkValidity()) {
    var emailValue = form.querySelectorAll('[name="email"]')[0].value;
    var nameValue = form.querySelectorAll('[name="name"]')[0].value;
    var formData;

    toggleEditing(form, 'disable'); // disables inputs
    // jsonify form data
    formData = {
      email: emailValue,
      name: nameValue
    };

    analytics.ready(function() {
      analytics.track(formName + '-list sign up', {email: emailValue, name: nameValue, clientId: ga.getAll()[0].get('clientId')});
    });
    formData = JSON.stringify(formData); // convert to JSON
    xhrSubmit(e, form, formData, formName);
    // mixpanel
    mixpanel.track('FE Submit: ' + formName, {
      'front-end validation': 'pass'
    });
  }
}

function sundipValidation(resultMessage, form, formName) {
  var prevError = form.getElementsByClassName('red')[0];
  var error = document.createElement('small');
  var submitButton = form.getElementsByTagName('button')[0];

  if (prevError) {
    prevError.parentNode.removeChild(prevError);
  }

  error.classList.add('popover', 'bottom', 'in', 'small','red','text-center');
  error.innerHTML = resultMessage;
  submitButton.appendChild(error);

  analytics.ready(function() {
    analytics.track('Error ' + formName + '-list form', {error: resultMessage, clientId: ga.getAll()[0].get('clientId')});
  });
}

// events
window.addEventListener('DOMContentLoaded', function(){
  var modalTriggers = document.getElementsByClassName('js-modal');
  var dBody = document.body;
  var dragging = false;
  var i;

  // prevent drag touch
  dBody.addEventListener('touchmove',function(){dragging = true;});
  dBody.addEventListener('touchstart',function(){dragging = false;});

  // modals
  if (modalTriggers) {
    for (i = 0; i < modalTriggers.length; i++) {
      /* jshint loopfunc: true */
      modalTriggers[i].addEventListener('click', function(event){
        openModal(event,dragging);
      });
      modalTriggers[i].addEventListener('touchend', function(event){
        openModal(event,dragging);
      });
    }
  }

  // if sign up page
  if (window.location.pathname === '/signup/') {
    setupForm('signup');
  }
  // if pricing page
  if (window.location.pathname === '/pricing/') {
    setupForm('enterprise');
  }
});

window.addEventListener('load', function(){
  // stub fbq
  if (!window.fbq) {
    window.fbq = function () {};
  }
});
