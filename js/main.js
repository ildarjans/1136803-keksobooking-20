'use strict';

(function () {
  var HOTELS_LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';

  var mapSection = window.keksobookingMap.mapSection;
  var mainPin = window.keksobookingMap.mainPin;
  var pinContainer = window.keksobookingMap.pinContainer;
  var activateMap = window.keksobookingMap.activateMap;
  var deactivateMap = window.keksobookingMap.deactivateMap;
  var activateForm = window.guestNoticeForm.activateForm;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelCard = window.hotelsCards.renderCard;
  var mapPins = null;
  var hotels = {};

  function disableKeksobooking() {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
    deactivateForm();
    deactivateMap();
    deactivatePins();
  }

  function enableKeksobooking() {
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinKeydownHandler);
    window.ajax.load(HOTELS_LOAD_URL, successCallback, errorCallback);
    activateMap();
    activateForm();
  }

  function mainPinKeydownHandler(event) {
    if (event.key === 'Enter') {
      enableKeksobooking();
    }
  }

  function mainPinMousedownHandler(event) {
    if (event.button === 0) {
      enableKeksobooking();
    }
  }

  function successCallback(response) {
    getHotelsDictionary(response);
    renderHotelsPins(hotels);
    activatePins();
  }

  function errorCallback(message) {
    window.popupMessage.show(message);
  }

  function getHotelsDictionary(response) {
    response.forEach(function (hotel) {
      hotel.id = (hotel.location.x * hotel.location.y + hotel.offer.price).toString(16);
      hotels[hotel.id] = hotel;
    });
  }

  // #####################################
  // ######     MODULE4-TASK3       ######
  // #####################################

  function activatePins() {
    mapPins = mapPins || Array.from(pinContainer.querySelectorAll('[class=map__pin]'));
    mapPins.forEach(function (pin) {
      pin.addEventListener('click', pinClickHandler);
      pin.addEventListener('keydown', pinKeyEnterHandler);
    });
  }

  function deactivatePins() {
    if (!mapPins) {
      return;
    }
    mapPins.forEach(function (pin) {
      pin.removeEventListener('click', pinClickHandler);
      pin.removeEventListener('keydown', pinKeyEnterHandler);
    });
  }

  function pinClickHandler(event) {
    var pinId = getPinId(event.target);
    var currentCard = mapSection.querySelector('.map__card.popup');
    if (currentCard && currentCard.dataset.id === pinId) {
      return;
    }
    if (currentCard && currentCard.dataset.id !== pinId) {
      removeCurrentCard(currentCard);
    }
    renderHotelCard(hotels[pinId]);
  }

  function pinKeyEnterHandler(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      var pinId = getPinId(event.target);
      var currentCard = mapSection.querySelector('.map__card.popup');
      if (currentCard && currentCard.dataset.id === pinId) {
        return;
      }
      if (currentCard && currentCard.dataset.id !== pinId) {
        removeCurrentCard(currentCard);
      }
      renderHotelCard(hotels[pinId]);
    }
  }

  function removeCurrentCard(card) {
    var cardCloseButton = card.querySelector('.popup__close');
    window.hotelsCards.removeClosePopupListeners(cardCloseButton);
    card.remove();
  }

  function getPinId(target) {
    return target.matches('img') ? target.parentNode.dataset.id : target.dataset.id;
  }

  disableKeksobooking();

})();
