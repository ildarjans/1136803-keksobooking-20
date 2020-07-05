'use strict';

(function () {
  var POPUP_DELAY = 5000;
  var HOTELS_LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';

  var mapSection = document.querySelector('section.map');

  var mainPin = window.keksobookingMap.mainPin;
  var activateMap = window.keksobookingMap.activateMap;
  var deactivateMap = window.keksobookingMap.deactivateMap;

  var activateForm = window.guestNoticeForm.activateForm;
  var deactivateForm = window.guestNoticeForm.deactivateForm;

  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelsCards = window.hotelsCards.renderCards;
  var renderPopupMessage = window.popupMessage.renderPopupMessage;


  function disableKeksobooking() {
    deactivateMap();
    deactivateForm();
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
  }

  function enableKeksobooking() {
    activateMap();
    activateForm();
    mainPin.removeEventListener('keydown', mainPinMousedownHandler);
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    window.ajax.load(HOTELS_LOAD_URL, successCallback, errorCallback);
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

  function successCallback(hotels) {
    renderHotelsPins(hotels);
    renderHotelsCards(hotels.splice(0, 1));
  }

  function errorCallback(message) {
    renderPopupMessage(mapSection, message, POPUP_DELAY);
    throw new Error(message);
  }

  disableKeksobooking();
})();
