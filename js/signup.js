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

function makeDirty(e){
  e.target.classList.remove('pristine', 'invalid');
}

function formInvalid(e) {
  markInvalid(e);
  shakeForm(e);
}

function toggleEditing(form, state) {
  var i;
  var theseInputs = form.getElementsByTagName('input');
  var submitButton = form.getElementsByTagName('button')[0];
  var spinner = document.getElementsByClassName('spinner-wrapper');

  if (state === 'disable') {
    for (i = 0; i < theseInputs.length; i++) {
      theseInputs[i].disabled = true;
    }
    submitButton.disabled = true;
    submitButton.innerHTML += '<div class="spinner-wrapper spinner-md"><svg viewbox="0 0 16 16" class="spinner"><circle cx="8" cy="8" r="7" stroke-linecap="round" class="path"></circle></svg></div>';
  }

  if (state === 'enable') {
    for (i = 0; i < theseInputs.length; i++) {
      theseInputs[i].disabled = false;
    }
    submitButton.disabled = false;
    spinner[0].parentElement.removeChild(spinner[0]);
  }
}

function formSubmit(e){
  var form = e.target;
  e.preventDefault();
  toggleEditing(form, 'disable'); // disables inputs

  if (form.checkValidity()) {
    var scm = document.getElementsByName('scm');
    var scmName = '';
    var formData;
    var xhr = new XMLHttpRequest();

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
    xhr.open('POST', 'https://codenow.com/submit');
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
        document.getElementsByClassName('article-sign-up')[0].classList.add('out');
        document.getElementsByClassName('article-confirm')[0].classList.add('in');
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
  var modalForms = document.getElementsByClassName('modal-backdrop');
  var imgFlip = document.getElementsByClassName('img-rounded');
  var theseInputs;

  checkScroll();
  window.addEventListener('hashchange', checkScroll);

  // modal forms
  if (modalForms) {
    for (i = 0; i < modalForms.length; i++) {
      modalForms[i].addEventListener('change', makeDirty);
      modalForms[i].addEventListener('submit', formSubmit);

      theseInputs = modalForms[i].getElementsByTagName('input');
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].addEventListener('invalid', formInvalid);

        if (theseInputs[i].classList.contains('input-radio')) {
          theseInputs[i].addEventListener('change', updateLabel);
        }
      }
    }
  }
});
