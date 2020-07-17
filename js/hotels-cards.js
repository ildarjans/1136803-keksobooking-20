'use strict';

(function () {

  var mapSection = window.keksobookingMap.mapSection;
  var cardTemplateContent = document.querySelector('template#card').content.querySelector('.map__card.popup');
  var mapFiltersContainer = mapSection.querySelector('.map__filters-container');

  function renderHotelCard(hotel) {
    var fragment = document.createDocumentFragment();
    renderCardTemplate(fragment, cardTemplateContent, hotel);
    mapSection.insertBefore(fragment, mapFiltersContainer);
    mapSection.querySelector('.popup__close').focus();
  }

  function renderCardTemplate(parent, cardTemplate, hotel) {
    var card = cardTemplate.cloneNode(true);
    card.querySelector('.popup__avatar').src = hotel.author.avatar;
    card.querySelector('.popup__title').textContent = hotel.offer.title;
    card.querySelector('.popup__text--address').textContent = hotel.offer.address;
    card.querySelector('.popup__text--price').innerHTML = hotel.offer.price + '&#x20bd;<span>/ночь</span>';
    card.querySelector('.popup__type').textContent = translateHotelType(hotel.offer.type);
    card.querySelector('.popup__text--capacity').textContent = hotel.offer.rooms + ' комнаты для ' + hotel.offer.guests + ' гостей';
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + hotel.offer.checkin + ', выезд до ' + hotel.offer.checkout;
    card.querySelector('.popup__description').textContent = hotel.offer.description;
    setPopupCloseButton(card.querySelector('.popup__close'));
    renderCardFeatures(card, hotel.offer.features);
    renderCardPhotos(card, hotel.offer.photos);
    card.dataset.id = hotel.id;
    parent.append(card);
  }

  function renderCardFeatures(cardTemplate, offerFeatures) {
    var templateElement = cardTemplate.querySelectorAll('.popup__feature');
    var regex = new RegExp(offerFeatures.join('|'), 'gi');
    templateElement.forEach(function (feature) {
      return !feature.classList.value.match(regex) ? feature.remove() : '';
    });
  }

  function renderCardPhotos(cardTemplate, offerPhotos) {
    var photosContainer = cardTemplate.querySelector('.popup__photos');
    var photo = cardTemplate.querySelector('.popup__photo');
    photo.remove();
    for (var i = 0; i < offerPhotos.length; i++) {
      var newPhoto = photo.cloneNode();
      newPhoto.src = offerPhotos[i];
      photosContainer.append(newPhoto);
    }
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

  function closePopupClickHandler(event) {
    removeClosePopupListeners(event.target);
    event.target.offsetParent.remove();
  }

  function closePopupEscapeHandler(event) {
    if (event.key === 'Escape') {
      removeClosePopupListeners(event.target);
      event.target.offsetParent.remove();
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
      var cardCloseButton = card.querySelector('.popup__close');
      removeClosePopupListeners(cardCloseButton);
      card.remove();
    }
  }

  function convertHotelsResponse(hotelsArray) {
    var hotels = {};
    hotelsArray.forEach(function (hotel) {
      hotel.id = (hotel.location.x * hotel.location.y + hotel.offer.price).toString(16);
      hotels[hotel.id] = hotel;
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
