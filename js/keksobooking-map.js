'use strict';

(function () {
  var url = 'https://javascript.pages.academy/keksobooking/data';
  var mapSection = window.commonElements.getMapSection();
  var mainPin = window.commonElements.getMainPin();
  var activateForm = window.guestNoticeForm.activateForm;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelsCards = window.hotelsCards.renderCards;
  var hotelsLoader = window.keksobookingAjax.load;
  var hotels = null;
  hotelsLoader(url, successCallback, errorCallback);

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
    activateForm();
    renderHotelsPins(hotels);
    renderHotelsCards(hotels.slice(0, 1));
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
  }

  function errorCallback(message) {
    console.log(message);
  }

  disableKeksobooking();

})();
