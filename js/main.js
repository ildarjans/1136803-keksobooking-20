'use strict';

(function () {
  var POPUP_DELAY = 5000;
  var URL = 'https://javascript.pages.academy/keksobooking/data';

  var mapSection = document.querySelector('section.map');
  var mainPin = mapSection.querySelector('.map__pin--main');
  var activateForm = window.guestNoticeForm.activateForm;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelsCards = window.hotelsCards.renderCards;
  var renderPopupMessage = window.popupMessage.renderPopupMessage;
  var hotelsLoader = window.keksobookingAjax.load;
  var hotels = null;

  disableKeksobooking();

  function disableKeksobooking() {
    mapSection.classList.add('map--faded');
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
    deactivateForm();
  }

  function enableKeksobooking() {
    mapSection.classList.remove('map--faded');
    mainPin.removeEventListener('keydown', mainPinMousedownHandler);
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    hotelsLoader(URL, successCallback, errorCallback);
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
    hotels = response;
    renderHotelsPins(hotels);
    renderHotelsCards(hotels.splice(0, 1));
  }

  function errorCallback(message) {
    renderPopupMessage(mapSection, message, POPUP_DELAY);
    throw new Error(message);
  }

})();
