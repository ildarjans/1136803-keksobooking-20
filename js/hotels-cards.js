'use strict';

(function () {
  var DEFAULT_AVATAR = 'img/avatars/default.png';
  var mapSection = window.keksobookingMap.mapSection;
  var cardTemplateContent = document.querySelector('template#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = mapSection.querySelector('.map__filters-container');
  var imgRegex = new RegExp(/([a-z\-_0-9\/\:\.()]*\.(jpg|jpeg|png|gif|webp))/, 'gi');

  function renderHotelCard(hotel) {
    var fragment = document.createDocumentFragment();
    renderCardTemplate(fragment, cardTemplateContent, hotel);
    mapSection.insertBefore(fragment, mapFiltersContainer);
    mapSection.querySelector('.popup__close').focus();
  }

  function renderCardTemplate(parent, cardTemplate, hotel) {
    var card = cardTemplate.cloneNode(true);
    setPopupCloseButton(card.querySelector('.popup__close'));
    var cardElements = {
      'avatar': card.querySelector('.popup__avatar'),
      'title': card.querySelector('.popup__title'),
      'address': card.querySelector('.popup__text--address'),
      'price': card.querySelector('.popup__text--price'),
      'type': card.querySelector('.popup__type'),
      'capacity': card.querySelector('.popup__text--capacity'),
      'time': card.querySelector('.popup__text--time'),
      'description': card.querySelector('.popup__description'),
      'features': card.querySelector('.popup__features'),
      'photos': card.querySelector('.popup__photos'),
    };

    cardElements.avatar.src = hotel.author.avatar;
    cardElements.title.textContent = hotel.offer.title || hideElement(cardElements.title);
    cardElements.address.textContent = hotel.offer.address || hideElement(cardElements.address);
    cardElements.description.textContent = hotel.offer.description || hideElement(cardElements.description);
    renderCardCapacity(cardElements.capacity, hotel);
    renderCardFeatures(cardElements.features, hotel);
    renderCardType(cardElements.type, hotel);
    renderCardTime(cardElements.time, hotel);
    renderCardPrice(cardElements.price, hotel);
    renderCardPhotos(cardElements.photos, hotel);
    card.dataset.id = hotel.id;
    parent.append(card);
  }

  function renderCardType(cardType, hotel) {
    var type = translateHotelType(hotel.offer.type);
    if (type) {
      cardType.textContent = type;
      return;
    }
    hideElement(cardType);
  }

  function renderCardTime(cardTime, hotel) {
    if (hotel.offer.checkin && hotel.offer.checkout) {
      cardTime.textContent = 'Заезд после ' + hotel.offer.checkin +
      ', выезд до ' + hotel.offer.checkout;
      return;
    }
    hideElement(cardTime);
  }

  function renderCardPrice(cardPrice, hotel) {
    if (hotel.offer.price && +hotel.offer.price !== 0) {
      cardPrice.textContent = hotel.offer.price + ' Р/ночь';
      return;
    }
    hideElement(cardPrice);
  }

  function renderCardCapacity(cardCapacity, hotel) {
    if (hotel.offer.rooms && hotel.offer.guests) {
      cardCapacity.textContent = hotel.offer.rooms + ' комнаты для ' +
      hotel.offer.guests + ' гостей';
      return;
    }
    hideElement(cardCapacity);
  }

  function renderCardFeatures(cardFeatures, hotel) {
    var offerFeatures = hotel.offer.features;
    if (offerFeatures.length === 0) {
      hideElement(cardFeatures);
      return;
    }
    var templateElements = cardFeatures.querySelectorAll('.popup__feature');
    var regex = new RegExp(offerFeatures.join('|'), 'gi');
    templateElements.forEach(function (feature) {
      return !feature.classList.value.match(regex) ? feature.remove() : '';
    });
  }

  function renderCardPhotos(cardPhotos, hotel) {
    var offerPhotos = hotel.offer.photos;
    if (offerPhotos.length === 0) {
      hideElement(cardPhotos);
      return;
    }
    var img = cardPhotos.querySelector('.popup__photo');
    img.remove();
    offerPhotos.forEach(function (photo) {
      if (photo.match(imgRegex)) {
        var newPhoto = img.cloneNode();
        newPhoto.src = photo;
        cardPhotos.append(newPhoto);
      }
    });
  }

  function hideElement(element) {
    element.style.display = 'none';
  }

  function translateHotelType(type) {
    switch (type) {
      case 'palace':
        return 'Дворец';
      case 'flat':
        return 'Квартира';
      case 'house':
        return 'Дом';
      case 'bungalo':
        return 'Бунгало';
    }
    return type;
  }

  function setPopupCloseButton(closePopup) {
    closePopup.tabIndex = 0;
    closePopup.addEventListener('click', closePopupClickHandler);
    closePopup.addEventListener('keydown', closePopupEscapeHandler);
  }

  function closePopupClickHandler(evt) {
    removeClosePopupListeners(evt.target);
    evt.target.offsetParent.remove();
  }

  function closePopupEscapeHandler(evt) {
    if (evt.key === 'Escape') {
      removeClosePopupListeners(evt.target);
      evt.target.offsetParent.remove();
    }
  }

  function removeClosePopupListeners(closePopup) {
    closePopup.removeEventListener('click', closePopupClickHandler);
    closePopup.removeEventListener('keydown', closePopupEscapeHandler);
  }

  function removeCard(card) {
    var cardCloseButton = card.querySelector('.popup__close');
    removeClosePopupListeners(cardCloseButton);
    card.remove();
  }

  function removeCurrentCard() {
    var card = mapSection.querySelector('.map__card.popup');
    if (card) {
      removeCard(card);
    }
  }

  function convertHotelsResponse(hotelsArray) {
    var hotels = {};
    hotelsArray.forEach(function (hotel) {
      if (hotel.offer) {
        hotel.id = (hotel.location.x * hotel.location.y + hotel.offer.price).toString(16);
        hotels[hotel.id] = hotel;
        hotel.author.avatar = hotel.author.avatar || DEFAULT_AVATAR;
      }
    });
    return hotels;
  }

  window.hotelsCards = {
    convertHotelsResponse: convertHotelsResponse,
    renderCard: renderHotelCard,
    removeCurrentCard: removeCurrentCard,
    removeCard: removeCard,
  };

})();
