'use strict';

(function () {
  var mapSection = document.querySelector('section.map');
  var pinOffset = {
    x: -25,
    y: -70
  };
  var pinTemplateContent = document.querySelector('template#pin').content.querySelector('.map__pin');

  function renderHotelsPins(hotelsArray) {
    var mapPins = mapSection.querySelector('.map__pins');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < hotelsArray.length; i++) {
      renderPinTemplate(fragment, pinTemplateContent, hotelsArray[i]);
    }
    mapPins.append(fragment);
  }

  function renderPinTemplate(parent, pinTemplate, hotel) {
    var pin = pinTemplate.cloneNode(true);
    pin.children[0].src = hotel.author.avatar;
    pin.children[0].alt = hotel.offer.title;
    pin.style = 'left:' + (hotel.location.x + pinOffset.x) + 'px; top: ' + (hotel.location.y + pinOffset.y) + 'px;';
    parent.append(pin);
  }

  window.hotelsPins = {
    renderPins: renderHotelsPins
  };

})();
