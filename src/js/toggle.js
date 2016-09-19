// toggles
function toggle(e) {
  var i;
  var toggler = e.target;
  var togglerElements = document.getElementsByClassName('js-toggler');
  var toggleType;
  var toggleElements = document.getElementsByClassName('js-toggle');

  // get parent
  if (!toggler.classList.contains('js-toggler')) {
    while ((toggler = toggler.parentElement) && !toggler.classList.contains('js-toggler'));
  }

  // only toggle things if it's not already active
  if (!toggler.classList.contains('active')) {
    toggleType = toggler.getAttribute('data-toggler');

    for (i = 0; i < togglerElements.length; i++) {
      togglerElements[i].classList.remove('active');
    }

    for (i = 0; i < toggleElements.length; i++) {

      if (toggleElements[i].classList.contains('fade')) {
        toggleElements[i].classList.remove('in');

        if (toggleType === toggleElements[i].getAttribute('data-toggle')) {
          toggleElements[i].classList.add('in');
        }
      } else {
        toggleElements[i].classList.add('hide');

        if (toggleType === toggleElements[i].getAttribute('data-toggle')) {
          toggleElements[i].classList.remove('hide');
        }
      }
    }

    toggler.classList.add('active');
  }
}

// events
window.addEventListener('DOMContentLoaded', function(){
  var i;
  var toggler = document.getElementsByClassName('js-toggler');

  // flipping cards
  if (toggler) {
    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener('click', toggle);
      toggler[i].addEventListener('touchend', toggle);
    }
  }
});
