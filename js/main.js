'use strict';

(function () {
  var HOTELS_LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';

  var activateForm = window.guestNoticeForm.activateForm;
  var activateMap = window.keksobookingMap.activateMap;
  var activatePins = window.hotelsPins.activatePins;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var deactivateMap = window.keksobookingMap.deactivateMap;
  var deactivatePins = window.hotelsPins.deactivatePins;
  var getHotelsDictionary = window.hotelsCards.getHotelsDictionary;
  var getPinId = window.hotelsPins.getPinId;
  var mapSection = window.keksobookingMap.mapSection;
  var mainPin = window.keksobookingMap.mainPin;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelCard = window.hotelsCards.renderCard;
  var removeCurrentCard = window.hotelsCards.removeCurrentCard;

  var hotels;

  function disableKeksobooking() {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
    deactivateForm();
    deactivateMap();
    deactivatePins(pinClickHandler, pinKeyEnterHandler);
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
    hotels = getHotelsDictionary(response);
    renderHotelsPins(hotels);
    activatePins(pinClickHandler, pinKeyEnterHandler);
  }

  function errorCallback(message) {
    window.popupMessage.show(message);
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

  disableKeksobooking();

  window.main = {
    disableKeksobooking: disableKeksobooking
  };

})();
