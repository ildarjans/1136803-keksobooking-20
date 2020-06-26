'use strict';

(function () {
  var mapSection = document.querySelector('section.map');
  var mainPin = mapSection.querySelector('.map__pin--main');


  function getMapSection() {
    return mapSection;
  }

  function getMainPin() {
    return mainPin;
  }

  window.keksobookingMap = {
    getMapSection: getMapSection,
    getMainPin: getMainPin
  };

})();
