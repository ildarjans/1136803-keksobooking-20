'use strict';

(function () {

  var mapSection = window.keksobookingMap.mapSection;
  var cardTemplateContent = document.querySelector('template#card').content.querySelector('.map__card.popup');

  function renderHotelsCards(hotels) {
    var mapFiltersContainer = mapSection.querySelector('.map__filters-container');
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < hotels.length; i++) {
      renderCardTemplate(fragment, cardTemplateContent, hotels[i]);
    }

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
    card.style.display = 'none';
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

  // #####################################
  // ######     MODULE4-TASK3       ######
  // #####################################
  function setPopupCloseButton(closePopup) {
    closePopup.tabIndex = 0;
    closePopup.addEventListener('click', closePopupClickHandler);
    closePopup.addEventListener('keydown', closePopupEscapeHandler);
  }

  function closePopupClickHandler(event) {
    event.target.offsetParent.remove();
  }

  function closePopupEscapeHandler(event) {
    if (event.key === 'Escape') {
      event.target.offsetParent.remove();
    }
  }

  window.hotelsCards = {
    renderCards: renderHotelsCards
  };

})();
