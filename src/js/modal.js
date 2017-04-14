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
});
