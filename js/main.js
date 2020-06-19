'use strict';

var hotelProperties = {
  location: {
    X_MIN: 330,
    X_MAX: 830,
    Y_MIN: 130,
    Y_MAX: 630
  },
  price: {
    MIN: 100,
    MAX: 800
  },
  rooms: {
    MIN: 1,
    MAX: 10
  },
  guests: {
    MIN: 1,
    MAX: 10
  }
};
var pinProperties = {
  OFFSETX: -25,
  OFFSETY: -70
};

var hotelNames = ['Hotel Yamanote Otsuka Eki Tower',
  'HOTEL FELICE Akasaka by RELIEF',
  'GrandPalace Allamanda Aoyama',
  'Rixos Premium Kazan JBR',
  'Shah Palace yamne uren',
  'Brandisimo Millennium Super Flat',
  'Jumeirah Al Naseem',
  'Mövenpick Jumeirah Lakes'];
var hotelPhotos = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var hotelTypes = ['palace', 'flat', 'house', 'bungalo'];
var timeOptions = ['12:00', '13:00', '14:00'];

var mapSection = document.querySelector('section.map');
// mapSection.classList.remove('map--faded');

var cardTemplateContent = document.querySelector('template#card').content.querySelector('.map__card.popup');
var pinTemplateContent = document.querySelector('template#pin').content.querySelector('.map__pin');

// renderHotels(cardTemplateContent, pinTemplateContent);

function renderHotels(card, pin) {
  var mapPins = mapSection.querySelector('.map__pins');
  var hotels = generateHotelsArray(8, hotelNames);
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < hotels.length; i++) {
    renderCardTemplate(fragment, card, hotels[i]);
    renderPinTemplate(fragment, pin, hotels[i]);
  }
  mapPins.append(fragment);
}

function generateHotelsArray(quantity, titles) {
  var data = [];

  for (var i = 1; i <= quantity; i++) {
    var obj = {};
    obj.author = {avatar: 'img/avatars/user0' + i + '.png'};
    obj.location = {
      x: getRandomInteger(hotelProperties.location.X_MIN, hotelProperties.location.X_MAX),
      y: getRandomInteger(hotelProperties.location.Y_MIN, hotelProperties.location.Y_MAX)
    };
    obj.offer = {
      title: titles[i - 1],
      address: obj.location.x + ', ' + obj.location.y,
      price: getRandomInteger(hotelProperties.price.MIN, hotelProperties.price.MAX),
      type: getRandomHotelType(),
      rooms: getRandomInteger(hotelProperties.rooms.MIN, hotelProperties.rooms.MAX),
      guests: getRandomInteger(hotelProperties.guests.MIN, hotelProperties.guests.MAX),
      checkin: getRandomTime(timeOptions),
      checkout: getRandomTime(timeOptions),
      features: getShuffledArray(features),
      description: 'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.',
      photos: getShuffledArray(hotelPhotos)
    };
    data.push(obj);
  }
  return data;
}

function renderCardTemplate(parent, cardTemplate, hotel) {
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__avatar').src = hotel.author.avatar;
  card.querySelector('.popup__title').textContent = hotel.offer.title;
  card.querySelector('.popup__text--address').textContent = hotel.offer.address;
  card.querySelector('.popup__text--price').innerHTML = hotel.offer.price + '&#x20bd;<span>/ночь</span>';
  card.querySelector('.popup__type').textContent = hotel.offer.type;
  card.querySelector('.popup__text--capacity').textContent = hotel.offer.rooms + ' комнаты для ' + hotel.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + hotel.offer.checkin + ', выезд до ' + hotel.offer.checkout;
  card.querySelector('.popup__description').textContent = hotel.offer.description;

  renderCardFeatures(card, hotel.offer.features);
  renderCardPhotos(card, hotel.offer.photos);

  parent.append(card);
}

function renderPinTemplate(parent, pinTemplate, hotel) {
  var pin = pinTemplate.cloneNode(true);
  pin.children[0].src = hotel.author.avatar;
  pin.children[0].alt = hotel.offer.title;
  pin.style = 'left:' + (hotel.location.x + pinProperties.OFFSETX) + 'px; top: ' + (hotel.location.y + pinProperties.OFFSETY) + 'px;';
  parent.append(pin);
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

function getRandomHotelType() {
  return hotelTypes[getRandomInteger(0, hotelTypes.length - 1)];
}

function getRandomTime(timesArray) {
  return timesArray[getRandomInteger(0, timesArray.length - 1)];
}

function getRandomInteger(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}

function getShuffledArray(arr) {
  if (arr.length < 1) {
    return arr;
  }
  var quantity = getRandomInteger(1, arr.length - 1);
  var randomNames = [];
  while (randomNames.length < quantity) {
    var guess = arr[getRandomInteger(0, arr.length - 1)];
    if (randomNames.indexOf(guess) < 0) {
      randomNames.push(guess);
    }
  }
  return randomNames;
}

// ############################################################
// ######               MODULE4-TASK2                    ######
// ############################################################

var mainPinProperties = {
  OFFSETX: -32.5,
  OFFSETY: -84
};
var validationProperties = {
  MESSAGE_ROOMS: 'Для заданного количества комнат выбранно не допустимое количество гостей',
  COLOR_INVALID: '#a82929'
};

var guestNoticeForm = document.querySelector('.notice form.ad-form');
var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
var filtersForm = mapSection.querySelector('.map__filters');
var mainPin = mapSection.querySelector('.map__pin--main');
var roomsQuantity = guestNoticeForm.querySelector('#room_number');
var roomsCapacity = guestNoticeForm.querySelector('#capacity');


mainPin.addEventListener('mousedown', mainPinMousedownHandler);
mainPin.addEventListener('keydown', mainPinKeydownHandler);


pageInactiveState();

function pageInactiveState() {
  mapSection.classList.add('map--faded');
  guestNoticeForm.classList.add('ad-form--disabled');
  filtersForm.classList.add('ad-form--disabled');
  var mainPinCoordinates = calcMainPinCenterCoordinates();
  fillFormAddressInput(mainPinCoordinates);
  setFormFieldsDisabledState(true);
  roomsQuantity.removeEventListener('change', roomsValidationHandler);
  roomsCapacity.removeEventListener('change', roomsValidationHandler);
}

function pageActiveState() {
  mapSection.classList.remove('map--faded');
  guestNoticeForm.classList.remove('ad-form--disabled');
  filtersForm.classList.remove('ad-form--disabled');
  var mainPinCoordinates = calcMainPinEdgeCoordinates();
  fillFormAddressInput(mainPinCoordinates);
  setFormFieldsDisabledState(false);
  roomsValidationHandler();
  renderHotels(cardTemplateContent, pinTemplateContent);
  roomsQuantity.addEventListener('change', roomsValidationHandler);
  roomsCapacity.addEventListener('change', roomsValidationHandler);
}

function mainPinKeydownHandler(event) {
  if (event.key === 'Enter') {
    pageActiveState();
    mainPin.removeEventListener('keydown', mainPinMousedownHandler);
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
  }
}

function mainPinMousedownHandler(event) {
  if (event.button === 0) {
    pageActiveState();
    mainPin.removeEventListener('keydown', mainPinMousedownHandler);
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
  }
}

function fillFormAddressInput(pinCoordinates) {
  guestNoticeForm.querySelector('#address').value =
    'x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y;
}

function calcMainPinEdgeCoordinates() {
  return {
    x: mainPin.offsetLeft + mainPinProperties.OFFSETX,
    y: mainPin.offsetTop + mainPinProperties.OFFSETY
  };
}

function calcMainPinCenterCoordinates() {
  return {
    x: mainPin.offsetLeft + (mainPin.offsetWidth / 2),
    y: mainPin.offsetTop + (mainPin.offsetHeight / 2)
  };
}

function setFormFieldsDisabledState(isDisabled) {
  isDisabled = isDisabled === undefined ? true : isDisabled;
  formFields.forEach(function (field) {
    field.disabled = isDisabled;
  });
}

function roomsValidationHandler() {
  var selectedRoom = roomsQuantity.selectedOptions[0].value;
  var roomsCapacityOptions = Array.from(roomsCapacity.options);
  var selectedAndDisabled = false;

  roomsCapacityOptions.forEach(function (option) {
    if (selectedRoom > 3) {
      option.disabled = option.value > 0 ? true : false;
    } else {
      option.disabled = option.value <= selectedRoom && option.value > 0 ? false : true;
    }
    if (option.selected && option.disabled) {
      selectedAndDisabled = true;
    }
  });
  roomsCustomValidity(selectedAndDisabled);
}

function roomsCustomValidity(valid) {
  if (valid) {
    roomsCapacity.setCustomValidity(validationProperties.MESSAGE_ROOMS);
    roomsCapacity.style.color = validationProperties.COLOR_INVALID;
  } else {
    roomsCapacity.setCustomValidity('');
    roomsCapacity.style.color = 'unset';
  }
}
