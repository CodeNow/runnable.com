function openIntercom() {
  Intercom('showNewMessage');
}

window.addEventListener('DOMContentLoaded', function(){
  var intercomTrigger = document.getElementsByClassName('js-intercom-open');

  for (i = 0; i < intercomTrigger.length; i++) {
    intercomTrigger[i].addEventListener('click', openIntercom);
    intercomTrigger[i].addEventListener('touchend', openIntercom);
  }
});
