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
    var pinId = getPinId(event.target);
    var currentCard = mapSection.querySelector('.map__card.popup');
    if (!currentCard) {
      renderPinAssociatedCard(pinId);
    } else if (currentCard.dataset.id === pinId) {
      return;
    } else {
      removeCurrentCard(currentCard);
      renderPinAssociatedCard(pinId);
    }
  }

  function pinKeyEnterHandler(event) {
    if (event.key !== 'Enter') {
      return;
    }
    event.preventDefault();
    var pinId = getPinId(event.target);
    var currentCard = mapSection.querySelector('.map__card.popup');
    if (!currentCard) {
      renderPinAssociatedCard(pinId);
    } else if (currentCard.dataset.id === pinId) {
      return;
    } else {
      removeCurrentCard(currentCard);
      renderPinAssociatedCard(pinId);
    }
  }

  function renderPinAssociatedCard(id) {
    var findedHotel = findHotelById(id);
    renderHotelCard(findedHotel);
  }

  function removeCurrentCard(card) {
    var cardCloseButton = card.querySelector('.popup__close');
    window.hotelsCards.removeClosePopupListeners(cardCloseButton);
    card.remove();
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

  disableKeksobooking();

})();
