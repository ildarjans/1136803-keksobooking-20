'use strict';

(function () {
  var mainPinOffset = {
    x: -32.5,
    y: -84
  };

  var mapSection = document.querySelector('section.map');
  var mainPin = mapSection.querySelector('.map__pin--main');
  var pinContainer = mapSection.querySelector('.map__pins');

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


  window.keksobookingMap = {
    mainPin: mainPin,
    mapSection: mapSection,
    pinContainer: pinContainer,
    activateMap: activateMap,
    deactivateMap: deactivateMap,
    getMainPinCenterCoordinates: getMainPinCenterCoordinates,
    getMainPinArrowCoordinates: getMainPinArrowCoordinates
  };


})();
