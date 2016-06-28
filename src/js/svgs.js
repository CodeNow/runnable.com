// polyfill for svgs with base element
(function(document, window) {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    // Current URL, without the hash
    var baseUrl = window.location.href.replace(window.location.hash, '');
      [].slice.call(document.querySelectorAll("use[*|href]"))
        .filter(function(element) {
          return (element.getAttribute('xlink:href').indexOf('#') === 0);
        })
        .forEach(function(element) {
          element.setAttribute('xlink:href', baseUrl + element.getAttribute('xlink:href'));
        });
  }, false);
}(document, window));
