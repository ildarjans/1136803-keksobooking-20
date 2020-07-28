'use strict';

(function () {
  var HOTELS_LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var MAX_PINS_DISPLAY = 5;

  var activateMap = window.keksobookingMap.activate;
  var activateForm = window.bookingForm.activate;
  var enableFilterForm = window.filterForm.enable;
  var deactivateForm = window.bookingForm.deactivate;
  var deactivateMap = window.keksobookingMap.deactivate;
  var convertHotelsResponse = window.hotelsCards.convertHotelsResponse;
  var mainPin = window.keksobookingMap.mainPin;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelCard = window.hotelsCards.renderCard;
  var removeRenderedPins = window.hotelsPins.removeRenderedPins;
  var removeCurrentCard = window.hotelsCards.removeCurrentCard;

  var hotels;

  function disableKeksobooking() {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
    deactivateMap();
    deactivateForm();
    removeRenderedPins();
    removeCurrentCard();
  }

  function enableKeksobooking() {
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinKeydownHandler);
    window.ajax.load(HOTELS_LOAD_URL, applySuccessResponse, showErrorPopup);
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

  function applySuccessResponse(responseAsHotelsArray) {
    hotels = convertHotelsResponse(responseAsHotelsArray);
    var ids = Object.keys(hotels).slice(0, MAX_PINS_DISPLAY);
    renderHotelsPins(ids, hotels);
    enableFilterForm(hotels, MAX_PINS_DISPLAY);
  }

  function showErrorPopup(message) {
    window.popupMessage.show(message);
  }

  function renderCardById(id) {
    renderHotelCard(hotels[id]);
  }

  disableKeksobooking();

  window.main = {
    disableKeksobooking: disableKeksobooking,
    renderCardById: renderCardById,
  };

})();
