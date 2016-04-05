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
  e.preventDefault();
  if (e.target.checkValidity()) {
    fbq('track', 'Lead');

    ga('send', 'event', 'signUp', 'submit', {
      hitCallback: function() {
        e.target.submit();
      }
    });
  }
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
