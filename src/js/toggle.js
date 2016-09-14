// toggles
function toggle(e) {
  var i;
  var eventType = e.type;
  var toggler = e.target;
  var toggleType = toggler.getAttribute('data-toggler');
  var toggleElements = document.getElementsByClassName('js-toggle');

  for (i = 0; i < toggleElements.length; i ++) {
    toggleElements[i].classList.add('hide');
    if (toggleType === toggleElements[i].getAttribute('data-toggle')) {
      toggleElements[i].classList.remove('hide');
    }
  }
}

// events
window.addEventListener('load', function(){
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
