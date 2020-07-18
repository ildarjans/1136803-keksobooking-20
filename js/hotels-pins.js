'use strict';

(function () {
  var pinOffset = {
    x: -25,
    y: -70
  };

  var pinTemplateContent = document.querySelector('template#pin').content.querySelector('.map__pin');
  var mapPins = window.keksobookingMap.mapPins;
  var pinsContainer = window.keksobookingMap.pinsContainer;

  function renderHotelsPins(ids, hotelsObj) {
    var fragment = document.createDocumentFragment();
    ids.forEach(function (id) {
      renderPinTemplate(fragment, pinTemplateContent, hotelsObj[id]);
    });
    pinsContainer.append(fragment);
  }

  function renderPinTemplate(parent, pinTemplate, hotel) {
    var pin = pinTemplate.cloneNode(true);
    pin.children[0].src = hotel.author.avatar;
    pin.children[0].alt = hotel.offer.title;
    pin.style.left = hotel.location.x + pinOffset.x + 'px';
    pin.style.top = hotel.location.y + pinOffset.y + 'px';
    pin.dataset.id = hotel.id;
    parent.append(pin);
  }

  function activatePins(clickHandler, keyEnterHandler) {
    mapPins = pinsContainer.querySelectorAll('[class=map__pin]');
    mapPins.forEach(function (pin) {
      pin.addEventListener('click', clickHandler);
      pin.addEventListener('keydown', keyEnterHandler);
    });
  }

  function removeRenderedPins(clickHandler, keyEnterHandler) {
    if (mapPins) {
      mapPins.forEach(function (pin) {
        pin.removeEventListener('click', clickHandler);
        pin.removeEventListener('keydown', keyEnterHandler);
        pin.remove();
      });
    }
  }

  function getPinId(target) {
    return target.matches('img') ? target.parentNode.dataset.id : target.dataset.id;
  }

  window.hotelsPins = {
    activatePins: activatePins,
    renderPins: renderHotelsPins,
    removeRenderedPins: removeRenderedPins,
    getPinId: getPinId
  };

})();
