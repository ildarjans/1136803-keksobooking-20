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
  var renderHotelsCards = window.hotelsCards.renderCards;
  var mapCards = null;
  var mapPins = null;
  var hotels = null;

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
    hotels = response;
    setHotelId();
    renderHotelsPins(hotels);
    renderHotelsCards(hotels);
    activatePins();
  }

  function errorCallback(message) {
    window.popupMessage.show(message);
  }

  function setHotelId() {
    hotels.forEach(function (hotel) {
      var id = (hotel.location.x * hotel.location.y * hotel.offer.price || 1).toString(16);
      hotel.id = id;
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
    showPinAssociatedCard(event);
  }

  function pinKeyEnterHandler(event) {
    event.preventDefault();
    if (event.key === 'Enter') {
      showPinAssociatedCard(event);
    }
  }

  function showPinAssociatedCard(event) {
    var pinId = getPinId(event.target);
    var findedHotel = findHotelById(pinId);
    showSingleHotelCard(findedHotel);
  }

  function getPinId(target) {
    return target.matches('img') ? target.parentNode.dataset.id : target.dataset.id;
  }

  function findHotelById(id) {
    for (var i = 0; i < hotels.length - 1; i++) {
      if (hotels[i].id === id) {
        break;
      }
    }
    return hotels[i];
  }

  function showSingleHotelCard(hotel) {
    mapCards = mapCards || mapSection.querySelectorAll('.map__card.popup');
    mapCards.forEach(function (card) {
      if (card.dataset.id === hotel.id) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  disableKeksobooking();

})();
