// sign up form
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

function submitSignUp(e) {
  var form = e.target;
  e.preventDefault();

  if (form.checkValidity()) {
    var scm = document.getElementsByName('scm');
    var scmName = '';
    var formData;
    var xhr = new XMLHttpRequest();

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
      email: form[3].value
    };

    formData = JSON.stringify(formData); // convert to JSON

    // send form
    xhr.open('POST', 'https://marketing-88rbj4hy.cloudapp.net/submit');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(formData);

    xhr.onreadystatechange = function() {
      if ( xhr.readyState === 4 && xhr.status === 0) {
        shakeForm(e);
        activeCampaignValidation('An unknown error occured. Please send us an email at support@runnable.com for assistance.');
      }

      toggleEditing(form, 'enable'); // re-enables form
    };

    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      var resultCode = response.result_code;
      var resultMessage = response.result_message;
      var subscriberId = response.subscriber_id;
      var subscriberEmail = response.subscriberEmail;

      // result_codes:
      // -1 = error from sundip
      // 0 = error from active campaign
      // 1 = success from active campaign

      if (resultCode === -1 || resultCode === 0) {
        shakeForm(e);
        activeCampaignValidation(resultMessage);
      }

      if (resultCode === 1) {
        document.getElementsByClassName('article-sign-up')[0].classList.add('out');
        document.getElementsByClassName('article-questionnaire')[0].classList.add('in');
      }

      toggleEditing(form, 'enable'); // re-enables form
    };

    // facebook tracking
    fbq('track', 'Lead');

    // google analytics tracking
    ga('send', 'event', 'signUp', 'submit');

    // adwords conversion tracking
    goog_report_conversion();
  }
}

function submitQuestionnaire(e) {
  var form = e.target;
  e.preventDefault();

  if (form.checkValidity()) {
    var formData;
    var xhr = new XMLHttpRequest();
    var subscriberId;
    var subscriberEmail;

    toggleEditing(form, 'disable'); // disables inputs

    formData = {
      subscriberId: subscriberId,
      subscriberEmail: subscriberEmail,
      questionnaire: form[0].value
    };

    formData = JSON.stringify(formData); // convert to JSON

    // send form
    xhr.open('POST', 'https://marketing-88rbj4hy.cloudapp.net/submit2');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(formData);

    xhr.onreadystatechange = function() {
      if ( xhr.readyState === 4 && xhr.status === 0) {
        shakeForm(e);
        activeCampaignValidation('An unknown error occured. Please send us an email at support@runnable.com for assistance.');
      }

      toggleEditing(form, 'enable'); // re-enables form
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
        activeCampaignValidation(resultMessage);
      }

      if (resultCode === 1) {
        document.getElementsByClassName('article-questionnaire')[0].classList.add('out');
        document.getElementsByClassName('article-confirm')[0].classList.add('in');
      }

      toggleEditing(form, 'enable'); // re-enables form
    };
  }
}

function activeCampaignValidation(resultMessage) {
  var errorWell = document.getElementsByClassName('well-error')[0];
  var errorText = document.getElementsByClassName('well-text')[0];
  var firstSentence = resultMessage.substr(0, resultMessage.indexOf('.'));

  // change error text from active campaign
  switch (firstSentence) {
    case 'You selected a list that does not allow duplicates':
      resultMessage = 'That email has already been used to sign up.';
      break;
    case 'Contact Email Address is not valid':
      resultMessage = 'That email address is not valid.';
      break;
  }

  errorText.innerHTML = resultMessage;
  errorWell.setAttribute('style', 'display: flex !important');
}

// check scrolling
function checkScroll() {
  var dBody = document.body;
  if (location.hash === '#sign-up') {
    dBody.classList.add('modal-open');
  } else {
    dBody.classList.remove('modal-open');
  }
}

// events
window.addEventListener('load', function(){
  var i;
  var signUpForm = document.getElementsByClassName('form-sign-up')[0];
  var questionnaireForm = document.getElementsByClassName('form-questionnaire')[0];
  var imgFlip = document.getElementsByClassName('img-rounded');
  var theseInputs;

  checkScroll();
  window.addEventListener('hashchange', checkScroll);

  // modal forms
  if (signUpForm) {
    signUpForm.addEventListener('change', makeDirty);
    signUpForm.addEventListener('submit', submitSignUp);
    questionnaireForm.addEventListener('change', makeDirty);
    questionnaireForm.addEventListener('submit', submitQuestionnaire);

    theseInputs = signUpForm.getElementsByTagName('input');
    for (i = 0; i < theseInputs.length; i++) {
      theseInputs[i].addEventListener('invalid', formInvalid);

      if (theseInputs[i].classList.contains('input-radio')) {
        theseInputs[i].addEventListener('change', updateLabel);
      }
    }
  }
});
