'use strict';

(function () {
  var pinOffset = {
    x: -25,
    y: -70
  };

  var pinTemplateContent = document.querySelector('template#pin').content.querySelector('.map__pin');
  var mapSection = window.keksobookingMap.mapSection;
  var pinsContainer = window.keksobookingMap.pinsContainer;
  var removeCard = window.hotelsCards.removeCard;
  var mapPins;

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

  function activatePins() {
    mapPins = pinsContainer.querySelectorAll('[class=map__pin]');
    mapPins.forEach(function (pin) {
      pin.addEventListener('click', pinClickHandler);
      pin.addEventListener('keydown', pinKeyEnterHandler);
    });
  }

  function removeRenderedPins() {
    if (mapPins) {
      mapPins.forEach(function (pin) {
        pin.removeEventListener('click', pinClickHandler);
        pin.removeEventListener('keydown', pinKeyEnterHandler);
        pin.remove();
      });
    }
  }

  function getPinId(target) {
    return target.matches('img') ? target.parentNode.dataset.id : target.dataset.id;
  }

  function pinClickHandler(evt) {
    var pinId = getPinId(evt.target);
    var currentCard = mapSection.querySelector('.map__card.popup');
    if (currentCard && currentCard.dataset.id === pinId) {
      return;
    }
    if (currentCard && currentCard.dataset.id !== pinId) {
      removeCard(currentCard);
    }
    window.main.renderCardById(pinId);
  }

  function pinKeyEnterHandler(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      var pinId = getPinId(evt.target);
      var currentCard = mapSection.querySelector('.map__card.popup');
      if (currentCard && currentCard.dataset.id === pinId) {
        return;
      }
      if (currentCard && currentCard.dataset.id !== pinId) {
        removeCard(currentCard);
      }
      window.main.renderCardById(pinId);
    }
  }

  window.hotelsPins = {
    activatePins: activatePins,
    renderPins: renderHotelsPins,
    removeRenderedPins: removeRenderedPins,
  };

})();
