'use strict';

(function () {
  var mapSection = document.querySelector('section.map');
  var mainPin = mapSection.querySelector('.map__pin--main');
  var activateForm = window.guestNoticeForm.activateForm;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelsCards = window.hotelsCards.renderCards;
  var hotels = window.hotelsGenerator.generateHotelsArray();

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
    renderHotelsCards(hotels);
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

  disableKeksobooking();

})();
