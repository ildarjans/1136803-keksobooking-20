'use strict';

(function () {
  var HOTELS_LOAD_URL = 'https://javascript.pages.academy/keksobooking/data';
  var MAX_PINS_DISPLAY = 5;
  var DEBOUNCE_DELAY = 1000;

  var activateMap = window.keksobookingMap.activateMap;
  var activateFilters = window.keksobookingMap.activateFilters;
  var activateForm = window.guestNoticeForm.activateForm;
  var activatePins = window.hotelsPins.activatePins;
  var deactivateFilters = window.keksobookingMap.deactivateFilters;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var deactivateMap = window.keksobookingMap.deactivateMap;
  var debounceFilters = window.utilities.debounce(applyPinsFilters, DEBOUNCE_DELAY);
  var convertHotelsResponse = window.hotelsCards.convertHotelsResponse;
  var getPinId = window.hotelsPins.getPinId;
  var mapSection = window.keksobookingMap.mapSection;
  var mainPin = window.keksobookingMap.mainPin;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelCard = window.hotelsCards.renderCard;
  var removeCard = window.hotelsCards.removeCard;
  var removeCurrentCard = window.hotelsCards.removeCurrentCard;
  var removeRenderedPins = window.hotelsPins.removeRenderedPins;
  var hotels;

  function disableKeksobooking() {
    mainPin.addEventListener('mousedown', mainPinMousedownHandler);
    mainPin.addEventListener('keydown', mainPinKeydownHandler);
    deactivateMap();
    removeRenderedPins(pinClickHandler, pinKeyEnterHandler);
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
      removeCard(currentCard);
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
        removeCard(currentCard);
      }
      renderHotelCard(hotels[pinId]);
    }
  }
  // ####################################
  // #####      MODULE7-TASK2       #####
  // #####            &&            #####
  // #####      MODULE7-TASK3       #####
  // ####################################

  var hotelFilters = {
    'housing-type': filterByType,
    'housing-price': filterByPrice,
    'housing-guests': filterByGuests,
    'housing-rooms': filterByRooms,
    'features': filterByFeatures
  };

  var priceRangeDescription = {
    'low': {
      min: 0,
      max: 10000,
    },
    'middle': {
      min: 10000,
      max: 50000,
    },
    'high': {
      min: 50000,
      max: 1000000000,
    },
  };

  var mapFilters = window.keksobookingMap.mapFilters;

  mapFilters.addEventListener('change', function () {
    debounceFilters();
  });


  function applyPinsFilters() {
    var filteredIds = getFilteredHotelsIds(mapFilters).slice(0, MAX_PINS_DISPLAY);
    removeRenderedPins(pinClickHandler, pinKeyEnterHandler);
    removeCurrentCard();
    renderHotelsPins(filteredIds, hotels);
    activatePins(pinClickHandler, pinKeyEnterHandler);
  }

  function getFilteredHotelsIds(form) {
    var formData = getFormObject(form);
    var hotelsId = Object.keys(hotels);
    Object.keys(hotelFilters).forEach(function (name) {
      if (formData[name] !== 'any' &&
          formData[name][0] !== undefined) {
        hotelsId = hotelFilters[name](hotelsId, formData[name]);
      }
    });
    return hotelsId;
  }

  function filterByType(hotelsId, value) {
    return hotelsId.filter(function (id) {
      return hotels[id].offer.type === value;
    });
  }

  function filterByPrice(hotelsId, value) {
    var min = priceRangeDescription[value].min;
    var max = priceRangeDescription[value].max;

    return hotelsId.filter(function (id) {
      return hotels[id].offer.price >= min && hotels[id].offer.price < max;
    });
  }

  function filterByRooms(hotelsId, value) {
    return hotelsId.filter(function (id) {
      return hotels[id].offer.rooms === +value;
    });
  }

  function filterByGuests(hotelsId, value) {
    return hotelsId.filter(function (id) {
      return hotels[id].offer.guests === +value;
    });
  }

  function filterByFeatures(hotelsId, features) {
    if (features[0] === undefined) {
      return hotelsId;
    }
    return hotelsId.filter(function (id) {
      var matched = true;
      for (var i = 0; i < features.length; i++) {
        if (!hotels[id].offer.features.includes(features[i])) {
          matched = false;
          break;
        }
      }
      return matched;
    });
  }

  function getFormObject(form) {
    var formData = new FormData(form);
    var formObj = {};
    Object.keys(hotelFilters).forEach(function (name) {
      formObj[name] = name !== 'features' ? formData.get(name) : formData.getAll(name);
    });
    return formObj;
  }

  // ####################################
  // ######       END MODULE7      ######
  // ####################################

  disableKeksobooking();

  window.main = {
    disableKeksobooking: disableKeksobooking,
    pinClickHandler: pinClickHandler,
    pinKeyEnterHandler: pinKeyEnterHandler,
  };

})();
