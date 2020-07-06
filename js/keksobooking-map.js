'use strict';

(function () {
  var mainPinOffset = {
    x: -32.5,
    y: -84
  };

  var mapSection = document.querySelector('section.map');
  var pinsContainer = document.querySelector('.map__pins');
  var mainPin = mapSection.querySelector('.map__pin--main');

  function getMainPinArrowCoordinates() {
    return {
      x: mainPin.offsetLeft + mainPinOffset.x,
      y: mainPin.offsetTop + mainPinOffset.y
    };
  }

  function getMainPinCenterCoordinates() {
    return {
      x: mainPin.offsetLeft + (mainPin.offsetWidth / 2),
      y: mainPin.offsetTop + (mainPin.offsetHeight / 2)
    };
  }

  function activateMap() {
    mapSection.classList.remove('map--faded');
  }

  function deactivateMap() {
    mapSection.classList.add('map--faded');
  }

  function removeRenderedPins() {
    var pins = pinsContainer.querySelectorAll('[class=map__pin]');
    pins.forEach(function (pin) {
      pin.remove();
    });
  }

  function removeRenderedCards() {
    var cards = mapSection.querySelectorAll('article.map__card.popup');
    cards.forEach(function (card) {
      card.remove();
    });
  }

  window.keksobookingMap = {
    mainPin: mainPin,
    mapSection: mapSection,
    pinsContainer: pinsContainer,
    removeRenderedPins: removeRenderedPins,
    removeRenderedCards: removeRenderedCards,
    activateMap: activateMap,
    deactivateMap: deactivateMap,
    getMainPinCenterCoordinates: getMainPinCenterCoordinates,
    getMainPinArrowCoordinates: getMainPinArrowCoordinates
  };

})();
