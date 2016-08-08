// flipping cards
function flipCard(e) {
  var i;
  var eventType = e.type;
  var thisCard = e.target;
  var flipTriggers;

  // set thisCard to parent card element
  while ((thisCard = thisCard.parentElement) && !thisCard.classList.contains('card-flipper'));
  flipTriggers = thisCard.getElementsByClassName('img-rounded');

  // remove and reset touch events or they can trigger twice
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

// events
window.addEventListener('load', function(){
  var i;
  var imgFlip = document.getElementsByClassName('img-rounded');

  // flipping cards
  if (imgFlip) {
    for (i = 0; i < imgFlip.length; i++) {
      imgFlip[i].addEventListener('click', flipCard);
      imgFlip[i].addEventListener('touchend', flipCard);
    }
  }
});
