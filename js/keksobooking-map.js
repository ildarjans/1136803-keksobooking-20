'use strict';

(function () {
  var mapSection = window.commonElements.getMapSection();
  var mainPin = window.commonElements.getMainPin();
  var activateForm = window.guestNoticeForm.activateForm;
  var deactivateForm = window.guestNoticeForm.deactivateForm;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var renderHotelCard = window.hotelsCards.renderCards;
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
    // renderHotelsCards(hotels);
    activatePins();
  }

  function mainPinKeydownHandler(event) {
    if (event.key === 'Enter') {
      log('i am here!!!');
      enableKeksobooking();
    }
  }

  function mainPinMousedownHandler(event) {
    if (event.button === 0) {
      enableKeksobooking();
    }
  }

  disableKeksobooking();

  // #####################################
  // ######     MODULE4-TASK3       ######
  // #####################################

  var log = console.log;

  function activatePins() {
    var mapPins = Array.from(mapSection.querySelectorAll('.map__pin'));
    for (var i = 0; i < mapPins.length; i++) {
      if (mapPins[i].classList.contains('map__pin--main')) {
        mapPins.splice(i, i + 1);
        break;
      }
    }
    mapPins.forEach(function (pin) {
      pin.addEventListener('click', function (event) {
        renderPinAssociatedCard(event);
      });

      pin.addEventListener('keydown', function (event) {
        event.preventDefault();
        if (event.key === 'Enter') {
          log(event);
          renderPinAssociatedCard(event);
        }
      });
    });
  }

  function renderPinAssociatedCard(event) {
    var authorAvatar = getAuthorAvatar(event.target);
    var hotelName = getHotelName(event.target);
    var clickedHotel = findHotel(authorAvatar, hotelName);
    removeDisplayedHotelsCards();
    renderHotelCard(clickedHotel);
  }

  function getHotelName(target) {
    return target.matches('button') ? target.firstChild.alt : target.alt;
  }

  function getAuthorAvatar(target) {
    var regex = new RegExp(/(\/img[\s\S]*)/, 'g');
    var authorAvatar = target.matches('button') ? target.firstChild.src : target.src;
    return authorAvatar.match(regex)[0].slice(1);
  }

  function findHotel(avatar, hotelName) {
    for (var i = 0; i < hotels.length - 1; i++) {
      if (hotels[i].author.avatar === avatar && hotels[i].offer.title === hotelName) {
        break;
      }
    }
    return [hotels[i]];
  }

  function removeDisplayedHotelsCards() {
    var mapCards = mapSection.querySelectorAll('.map__card.popup');
    mapCards.forEach(function (card) {
      card.remove();
    });
  }

})();
