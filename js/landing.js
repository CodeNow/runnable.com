// form submit
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
  var theseInputs;
  if (e.target.tagName == 'INPUT') {
    // for invalid event
    theseInputs = e.target.classList.add('invalid');
  } else {
    // for change event
    theseInputs = e.target.getElementsByTagName('input');
    for (var i = 0; i < theseInputs.length; i++) {
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

function formSubmit(e){
  var form = e.target;
  e.preventDefault();

  if (form.checkValidity()) {
    // facebook tracking
    fbq('track', 'Lead');

    // google analytics tracking
    ga('send', 'event', 'signUp', 'submit');

    // adwords conversion tracking
    goog_report_conversion();

    // jsonify form data
    var scm = document.getElementsByName('scm');
    var scmName = '';

    for(var i = 0; i < scm.length; i++) {
      if(scm[i].checked) {
        scmName = scm[i].value;
      }
    }

    var formData = {
      scm: scmName,
      organization: form[2].value,
      email: form[3].value
    };

    formData = JSON.stringify(formData); // convert to JSON

    // send form
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://marketing-88rbj4hy.cloudapp.net/submit');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(formData);
    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      var resultCode = response.result_code;
      var resultMessage = response.result_message;

      /* result_codes:
         -1 = error from sundip
         0 = error from active campaign
         1 = success from active campaign
      */

      console.log('precheck: ' + resultCode);
      console.log('precheck: ' + resultMessage);

      // if errors
      if (resultCode === -1 || resultCode === 0) {
        activeCampaignValidation(resultCode, resultMessage);
      }
    };
  }
}

function activeCampaignValidation(resultCode, resultMessage) {
  // switch (resultMessage) {
  //   case '':
  //     break;
  // }

  var errorWell = document.getElementsByClassName('well-error')[0];
  var errorText = document.getElementsByClassName('well-text')[0];
  errorText.innerHTML = resultMessage;
  errorWell.setAttribute('style', 'display: flex !important');

  console.log('postcheck: ' + resultCode);
  console.log('postcheck: ' + resultMessage);
}

// flipping cards
function flipCard(e) {
  var i;
  var eventType = e.type;
  var thisCard = e.target;

  // set thisCard to parent card element
  while ((thisCard = thisCard.parentElement) && !thisCard.classList.contains('team-card'));
  var flipTriggers = thisCard.getElementsByClassName('img-rounded');

  // remove and reset touch events
  if (eventType === 'touchend') {
    for (i = 0; i < flipTriggers.length; i++) {
      flipTriggers[i].removeEventListener('touchend', flipCard);
    }
  }

  thisCard.classList.toggle('flip');

  if (eventType === 'touchend') {
    for (i = 0; i < flipTriggers.length; i++) {
      flipTriggers[i].addEventListener('touchend', flipCard);
    }
  }
}

// check scrolling
function checkScroll() {
  var dBody = document.body;
  if (location.hash === '#sign-up' || location.hash === '#confirm') {
    dBody.classList.add('modal-open');
  } else {
    dBody.classList.remove('modal-open');
  }
}

// events
window.onload = function(){
  checkScroll();
  window.addEventListener('hashchange', checkScroll);

  var i;

  // modal forms
  var modalForms = document.getElementsByClassName('modal-backdrop');
  if (modalForms) {
    for (i = 0; i < modalForms.length; i++) {
      modalForms[i].addEventListener('change', makeDirty);
      modalForms[i].addEventListener('submit', formSubmit);

      var theseInputs = modalForms[i].getElementsByTagName('input');
      for (i = 0; i < theseInputs.length; i++) {
        theseInputs[i].addEventListener('invalid', formInvalid);

        if (theseInputs[i].classList.contains('input-radio')) {
          theseInputs[i].addEventListener('change', updateLabel);
        }
      }
    }
  }

  // flipping cards
  var imgFlip = document.getElementsByClassName('img-rounded');
  if (imgFlip) {
    for (i = 0; i < imgFlip.length; i++) {
      imgFlip[i].addEventListener('click', flipCard);
      imgFlip[i].addEventListener('touchend', flipCard);
    }
  }
};
