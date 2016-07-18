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
    // bind sign up events
    if (modalName === 'sign-up') {
      setupBitbucket();
    }
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
function setupBitbucket() {
  var bitbucketForm = document.getElementsByClassName('form-bitbucket');

  for (i = 0; i < bitbucketForm.length; i++) {
    bitbucketForm[i].addEventListener('change', makeDirty);
    bitbucketForm[i].addEventListener('submit', submitBitbucket);
    bitbucketForm[i].getElementsByTagName('input')[0].addEventListener('invalid', formInvalid);
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
  var thisForm = e.target;

  // get shake element
  while ((thisForm = thisForm.parentNode) && !thisForm.classList.contains('shake-me'));
  thisForm.classList.add('shake');
  thisForm.addEventListener('animationend', function(){
    thisForm.classList.remove('shake');
    thisForm.removeEventListener('animationend', function(){});
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
    spinner[0].parentNode.removeChild(spinner[0]);
  }
}

function xhrSubmit(e, form, formData) {
  var xhr = new XMLHttpRequest();
  var xhrUrl = 'https://codenow.com/submit';

  // send form
  xhr.open('POST', xhrUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(formData);
  xhr.onreadystatechange = function() {
    if ( xhr.readyState === 4 && xhr.status === 0) {
      shakeForm(e);
      activeCampaignValidation('An error occured. Send us an email at <a class="link" href="mailto:bitbucket@runnable.com">bitbucket@runnable.com</a> for help.', form);
      toggleEditing(form, 'enable'); // re-enables form
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
      activeCampaignValidation(resultMessage, form);
    }
    if (resultCode === 1) {
      // tell the user something nice
      form.classList.add('hide');
      form.classList.remove('show');
      successMsg.classList.add('show');
      successMsg.classList.remove('hide');
    }
    toggleEditing(form, 'enable'); // re-enables form
  };
}

function submitBitbucket(e) {
  var form = e.target;

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
    // Send event to Segment
    analytics.ready(function() {
      analytics.track('Sign Up Attempt', {email: emailValue, clientId: ga.getAll()[0].get('clientId')});
    });
    formData = JSON.stringify(formData); // convert to JSON
    xhrSubmit(e, form, formData);
  }
}

function activeCampaignValidation(resultMessage, form) {
  var prevError = form.getElementsByClassName('red')[0];
  var error = document.createElement('small');

  if (prevError) {
    prevError.parentNode.removeChild(prevError);
  }
  error.classList.add('small','red','text-center');
  error.innerHTML = resultMessage;
  form.appendChild(error);
  // segment tracking
  analytics.ready(function() {
    analytics.track('Error submit form', {error: resultMessage, clientId: ga.getAll()[0].get('clientId')});
  });
}

// events
window.addEventListener('load', function(){
  var modalTriggers = document.getElementsByClassName('js-modal');
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
    setupBitbucket();
  }
});
