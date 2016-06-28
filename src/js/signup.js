// modals
function openModal(dragging) {
  event.preventDefault();
  if (!dragging) {
    var modalName = event.target.getAttribute('href').substring(1);
    var modal = document.getElementById(modalName);
    var closeTrigger = modal.getElementsByClassName('js-modal-close')[0];

    // show modal
    modal.classList.add('in');
    // stop scrolling
    document.body.classList.add('modal-open');
    // triggers for close button
    closeTrigger.addEventListener('click', closeModal);
    closeTrigger.addEventListener('touchend', closeModal);
    // trigger for esc key
    document.addEventListener('keydown', escModal);
    // bind sign up events
    if (modalName === 'sign-up') {
      setupSignUp();
    }
  }
}

function escModal() {
  if (event.keyCode == 27) {
    closeModal();
  }
}

function closeModal() {
  var modal = document.getElementsByClassName('modal-backdrop in')[0];
  var closeTrigger = modal.getElementsByClassName('js-modal-close')[0];

  event.preventDefault();
  // hide modal
  modal.classList.remove('in');
  // resume scrolling
  document.body.classList.remove('modal-open');
  // remove triggers
  closeTrigger.removeEventListener('click', closeModal);
  closeTrigger.removeEventListener('touchend', closeModal);
  document.removeEventListener('keydown', escModal);
}

// sign up
function setupSignUp() {
  var signUpForm = document.getElementsByClassName('form-sign-up')[0];
  var theseInputs = signUpForm.getElementsByTagName('input');

  signUpForm.addEventListener('change', makeDirty);
  signUpForm.addEventListener('submit', submitSignUp);
  for (i = 0; i < theseInputs.length; i++) {
    theseInputs[i].addEventListener('invalid', formInvalid);
    if (theseInputs[i].classList.contains('input-radio')) {
      theseInputs[i].addEventListener('change', updateLabel);
    }
  }
}

function updateLabel(e) {
  var label = document.getElementsByClassName('label-text')[0];

  switch (e.target.getAttribute('value')) {
    case 'GitHub':
      label.innerHTML = 'GitHub Organization';
      break;
    case 'Bitbucket':
      label.innerHTML = 'Bitbucket Team';
      break;
  }
}

function markInvalid(e) {
  var thisTarget = e.target;
  var theseInputs;
  var i;

  if (thisTarget.tagName == 'INPUT') {
    // for invalid event
    theseInputs = thisTarget.classList.add('invalid');
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
  var thisModal = e.target;

  // get modal element
  while ((thisModal = thisModal.parentElement) && !thisModal.classList.contains('modal'));
  thisModal.classList.add('shake');
  thisModal.addEventListener('animationend', function(){
    thisModal.classList.remove('shake');
    thisModal.removeEventListener('animationend', function(){});
  });
}

function makeDirty(e) {
  e.target.classList.remove('pristine', 'invalid');
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
    submitButton.innerHTML += '<div class="spinner-wrapper spinner-md"><svg viewbox="0 0 16 16" class="spinner"><circle cx="8" cy="8" r="7" stroke-linecap="round" class="path"></circle></svg></div>';
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
    spinner[0].parentElement.removeChild(spinner[0]);
  }
}

function xhrSubmit(e, form, formData) {
  var xhr = new XMLHttpRequest();
  var xhrUrl;
  var questionnaireForm = document.getElementsByClassName('form-questionnaire')[0];
  var articleSignUp = document.getElementsByClassName('article-sign-up')[0];
  var articleQuestionnaire = document.getElementsByClassName('article-questionnaire')[0];
  var articleConfirm = document.getElementsByClassName('article-confirm')[0];

  // determine script to submit to
  if (form.classList.contains('form-sign-up')) {
    xhrUrl = 'https://codenow.com/submit';
  } else if (form.classList.contains('form-questionnaire')) {
    xhrUrl = 'https://codenow.com/submitreason';
  }
  // send form
  xhr.open('POST', xhrUrl);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(formData);
  xhr.onreadystatechange = function() {
    if ( xhr.readyState === 4 && xhr.status === 0) {
      shakeForm(e);
      activeCampaignValidation('An unknown error occured. Please send us an email at <a class="link" href="mailto:preview@runnable.com">preview@runnable.com</a> for assistance.', form);
      toggleEditing(form, 'enable'); // re-enables form
    }
  };
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    var resultCode = response.result_code;
    var resultMessage = response.result_message;
    // result_codes:
    // -1 = error from sundip
    // 0 = error from active campaign
    // 1 = success from active campaign
    if (resultCode === -1 || resultCode === 0) {
      shakeForm(e);
      activeCampaignValidation(resultMessage, form);
    }
    if (resultCode === 1) {
      if (!articleSignUp.classList.contains('out')) {
        // attach events
        questionnaireForm.addEventListener('change', makeDirty);
        questionnaireForm.addEventListener('submit', setupSubmitQuestionnaire({
          subscriber_id: response.subscriber_id,
          email: response.email
        }));
        // show questionnaire
        articleSignUp.classList.add('out');
        articleQuestionnaire.classList.add('in');
        // segment tracking
        analytics.ready(function() {
          var data = JSON.parse(formData);
          analytics.track('Signed Up', {clientId: ga.getAll()[0].get('clientId')});
          analytics.identify(data.email, data);
        });
      } else {
        // else show confirmation
        articleQuestionnaire.classList.add('out');
        articleConfirm.classList.add('in');
      }
    }
    toggleEditing(form, 'enable'); // re-enables form
  };
}

function submitSignUp(e) {
  var form = e.target;

  e.preventDefault();
  if (form.checkValidity()) {
    var scm = document.getElementsByName('scm');
    var scmName = '';
    var formData;
    toggleEditing(form, 'disable'); // disables inputs
    // jsonify form data
    for(var i = 0; i < scm.length; i++) {
      if(scm[i].checked) {
        scmName = scm[i].value;
      }
    }
    formData = {
      scm: scmName,
      organization: form[2].value,
      email: form[3].value,
    };
    // Send event to Segment
    analytics.ready(function() {
      analytics.track('Sign Up Attempt', {scm: scmName, org: form[2].value, email: form[3].value, clientId: ga.getAll()[0].get('clientId')});
    });
    formData = JSON.stringify(formData); // convert to JSON
    xhrSubmit(e, form, formData);
  }
}

function setupSubmitQuestionnaire(response) {
  return function (e) {
    var form = e.target;

    e.preventDefault();
    if (form.checkValidity()) {
      var formData;

      toggleEditing(form, 'disable'); // disables inputs
      formData = {
        email: response.email,
        subscriber_id: response.subscriber_id,
        reason: form[0].value
      };
      // Send event to Segment
      analytics.ready(function() {
        var data = {email: response.email,subscriber_id: response.subscriber_id,reason: form[0].value, clientId:ga.getAll()[0].get('clientId')};

        analytics.track('Questionnaire Submit', data);
        analytics.identify(data.email, data);
      });
      formData = JSON.stringify(formData); // convert to JSON
      xhrSubmit(e, form, formData);
    }
  };
}

function activeCampaignValidation(resultMessage, form) {
  var thisArticle = form.parentNode;
  var thisErrorWell = thisArticle.getElementsByClassName('well-error')[0];
  var thisErrorText = thisArticle.getElementsByClassName('well-text')[0];
  var firstSentence = resultMessage.substr(0, resultMessage.indexOf('.'));

  // change error text from active campaign (checks first sentence)
  switch (firstSentence) {
    case 'You selected a list that does not allow duplicates':
      resultMessage = 'That email has already been used to sign up.';
      break;
    case 'Contact Email Address is not valid':
      resultMessage = 'That email address is not valid.';
      break;
    case 'Your Organization or Team is invalid':
      resultMessage = 'We couldn’t find that organization or team.';
      break;
  }
  thisErrorText.innerHTML = resultMessage;
  thisErrorWell.setAttribute('style', 'display: flex !important');
  // segment tracking
  analytics.ready(function() {
    analytics.track('Error submit form', {error: resultMessage, clientId: ga.getAll()[0].get('clientId')});
  });
}

// events
window.addEventListener('load', function(){
  var whitelisted = window.location.search !== '?whitelist=false';
  var modalTriggers = document.getElementsByClassName('js-modal');
  var questionnaireForm = document.getElementsByClassName('form-questionnaire')[0];
  var dBody = document.body;
  var dragging = false;
  var i;

  // prevent drag touch
  dBody.addEventListener('touchmove',function(){dragging = true;});
  dBody.addEventListener('touchstart',function(){dragging = false;});
  // stub fbq
  if (!window.fbq) {
    window.fbq = function () {};
  }
  // modals
  if (modalTriggers) {
    for (i = 0; i < modalTriggers.length; i++) {
      /* jshint loopfunc: true */
      modalTriggers[i].addEventListener('click', function(){openModal(dragging);});
      modalTriggers[i].addEventListener('touchend', function(){openModal(dragging);});
    }
  }
  // show sign up if not whitelisted
  if (!whitelisted) {
    // set sign up form error
    document.getElementsByClassName('well-text')[0].innerHTML = 'You don’t have access to Runnable…yet. Fill out this form and we’ll get in touch!';
    document.getElementsByClassName('well-error')[0].setAttribute('style', 'display: flex !important');
    // open sign up form
    openSignUp(signUpModal);
    // segment tracking
    analytics.ready(function() {
      analytics.track('User not whitelisted', {clientId: ga.getAll()[0].get('clientId')});
    });
  }
});
