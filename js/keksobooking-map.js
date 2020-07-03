'use strict';

(function () {
  var mainPinOffset = {
    x: -32.5,
    y: -84
  };

  var mapSection = document.querySelector('section.map');
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

  window.keksobookingMap = {
    getMainPinArrowCoordinates: getMainPinArrowCoordinates,
    getMainPinCenterCoordinates: getMainPinCenterCoordinates
  };

})();
