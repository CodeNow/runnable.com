function slide(e) {
  var photos = document.getElementsByClassName('js-slide');
  var thisEl = e.target;

  for (i = 0; i < photos.length; i++) {
    photos[i].classList.remove('active');
  }

  thisEl.classList.add('active');
}

window.addEventListener('DOMContentLoaded', function() {
  var photos = document.getElementsByClassName('js-slide');

  for (i = 0; i < photos.length; i++) {
    photos[i].addEventListener('click', slide);
    photos[i].addEventListener('touchend', slide);
  }
});
