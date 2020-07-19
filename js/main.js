'use strict';

(function () {
  var HOTELS_LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var MAX_PINS_DISPLAY = 5;
  var DEBOUNCE_DELAY = 1000;

  var activateMap = window.keksobookingMap.activateMap;
  var activateFilters = window.keksobookingMap.activateFilters;
  var activateForm = window.guestNoticeForm.activateForm;
  var activatePins = window.hotelsPins.activatePins;
  var applyFormFilters = window.filterForm.applyPinsFilters;
  var deactivateFilters = window.keksobookingMap.deactivateFilters;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var deactivateMap = window.keksobookingMap.deactivateMap;
  var convertHotelsResponse = window.hotelsCards.convertHotelsResponse;
  var mainPin = window.keksobookingMap.mainPin;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelCard = window.hotelsCards.renderCard;
  var removeRenderedPins = window.hotelsPins.removeRenderedPins;

  var debouncedFilters;
  var hotels;

  function disableKeksobooking() {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
    deactivateMap();
    removeRenderedPins();
    deactivateFilters();
    deactivateForm();
  }

  function enableKeksobooking() {
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinKeydownHandler);
    window.ajax.load(HOTELS_LOAD_URL, successCallback, errorCallback);
    activateMap();
    activateFilters();
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
    hotels = convertHotelsResponse(response);
    var ids = Object.keys(hotels).slice(0, MAX_PINS_DISPLAY);
    renderHotelsPins(ids, hotels);
    activatePins();
    applyFormFilters = applyFormFilters.bind(null, hotels, MAX_PINS_DISPLAY);
    debouncedFilters = window.utilities.debounce(applyFormFilters, DEBOUNCE_DELAY);
  }

  function errorCallback(message) {
    window.popupMessage.show(message);
  }

  function renderPinById(id) {
    renderHotelCard(hotels[id]);
  }

  // ####################################
  // #####      MODULE7-TASK2       #####
  // #####            &&            #####
  // #####      MODULE7-TASK3       #####
  // ####################################

  var mapFilters = window.keksobookingMap.mapFilters;
  mapFilters.addEventListener('change', function () {
    debouncedFilters();
  });

  disableKeksobooking();

  window.main = {
    disableKeksobooking: disableKeksobooking,
    renderPinById: renderPinById,
  };

})();
