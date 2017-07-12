function playPhoto(e,badge) {
  var video = badge.previousElementSibling;
  video.play();
}

function pausePhoto(e,badge) {
  var video = badge.previousElementSibling;
  video.pause();
  video.currentTime = 0;
}

window.addEventListener('DOMContentLoaded', function(){
  var livePhotoBadges = document.getElementsByClassName('live-photos-badge');

  for (i = 0; i < livePhotoBadges.length; i++) {
    livePhotoBadges[i].addEventListener('mouseover', function(e) {
      playPhoto(e,this);
    });
    livePhotoBadges[i].addEventListener('mouseout', function(e) {
      pausePhoto(e,this);
    });
  }
});
