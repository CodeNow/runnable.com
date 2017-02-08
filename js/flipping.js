// flipping cards
function flipCard(e) {
  var i;
  var eventType = e.type;
  var thisCard = e.target;
  var flipTriggers;

  // set thisCard to parent card element
  while ((thisCard = thisCard.parentElement) && !thisCard.classList.contains('card-flipper'));
  flipTriggers = thisCard.getElementsByClassName('js-flipper');

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
window.addEventListener('DOMContentLoaded', function(){
  var i;
  var flipper = document.getElementsByClassName('js-flipper');

  // flipping cards
  if (flipper) {
    for (i = 0; i < flipper.length; i++) {
      flipper[i].addEventListener('click', flipCard);
      flipper[i].addEventListener('touchend', flipCard);
    }
  }
});
