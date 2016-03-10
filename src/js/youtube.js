var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    events: {
      'onReady': onPlayerReady
    }
  });
}

function playVideo() {
  player.playVideo();
}

function pauseVideo() {
  player.pauseVideo();
}

function onPlayerReady(event) {
  var videoStart = document.getElementsByClassName('video-start');
  var videoPause = document.getElementsByClassName('video-pause');
  if (videoStart) {
    for (var i = 0; i < videoStart.length; i++) {
      videoStart[i].addEventListener('click', playVideo);
      videoStart[i].addEventListener('touchstart', playVideo);
    }
    for (var i = 0; i < videoPause.length; i++) {
      videoPause[i].addEventListener('click', pauseVideo);
      videoPause[i].addEventListener('touchstart', pauseVideo);
    }
  }

  if (window.location.hash === '#player') {
    playVideo();
  }
}

