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

renderHotels(cardTemplateContent, pinTemplateContent);

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
      features: getRandomArray(features),
      description: 'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.',
      photos: getRandomArray(hotelPhotos)
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
  var templateFeatures = cardTemplate.querySelectorAll('.popup__feature');
  var regex = new RegExp(offerFeatures.join('|'), 'gi');
  templateFeatures.forEach(function (feature) {
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

function getRandomArray(arr) {
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

// =============================================================
// =============================================================
// MODULE4-TASK2
// 1) Switch off all fieldset (or their inputs / select) to disable
// 2) Add listener mousedown event to .map__pin--main.
// # all about unactive state https://up.htmlacademy.ru/javascript/20/project/keksobooking#keksobooking-1-1

var mainPinProperties = {
  OFFSETX: -32.5,
  OFFSETY: -84
};

var guestNoticeForm = document.querySelector('.notice form.ad-form');
var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
var filtersForm = mapSection.querySelector('.map__filters');
var mainPin = mapSection.querySelector('.map__pin--main');
var roomsQuantity = guestNoticeForm.querySelector('#room_number');
var roomsCapacity = guestNoticeForm.querySelector('#capacity');


switchPageUnactiveState();
roomsQuantityValidationHandler();
mainPin.addEventListener('mousedown', mainPinMousedownHandler);
mainPin.addEventListener('keydown', mainPinMousedownHandler);
roomsQuantity.addEventListener('change', roomsQuantityValidationHandler);
roomsCapacity.addEventListener('change', roomsQuantityValidationHandler);

function switchPageUnactiveState() {
  mapSection.classList.add('map--faded');
  guestNoticeForm.classList.add('ad-form--disabled');
  filtersForm.classList.add('ad-form--disabled');
  toggleActiveFormFields();
}
function switchPageActiveState() {
  mapSection.classList.remove('map--faded');
  guestNoticeForm.classList.remove('ad-form--disabled');
  filtersForm.classList.remove('ad-form--disabled');
  toggleActiveFormFields();
  fillFormAddressInput();
}

function mainPinMousedownHandler(evt) {
  if (evt.button === 0 || evt.key === 'Enter') {
    switchPageActiveState();
    mainPin.removeEventListener('mousedown', mainPinMousedownHandler);
    mainPin.removeEventListener('keydown', mainPinMousedownHandler);
  }
}

function fillFormAddressInput() {
  var mainPinCoordinates = calcMainPinCoordinates();
  guestNoticeForm.querySelector('#address').value =
    'x: ' + mainPinCoordinates.x + ', y: ' + mainPinCoordinates.y;
}

function calcMainPinCoordinates() {
  return {
    x: +mainPin.style.left.replace('px', '') + mainPinProperties.OFFSETX,
    y: +mainPin.style.top.replace('px', '') + mainPinProperties.OFFSETY
  };
}

function toggleActiveFormFields() {
  formFields.forEach(function (field) {
    field.disabled = field.disabled ? false : true;
  });
}

function roomsQuantityValidationHandler() {
  var selectedValue = roomsQuantity.selectedOptions[0].value;
  var roomsCapacityOptions = Array.from(roomsCapacity.options);
  var selectedDisabled = false;

  if (selectedValue > 3) {
    roomsCapacityOptions.forEach(function (option) {
      option.disabled = option.value < 1 ? false : true;
      if (option.selected && option.disabled) {
        selectedDisabled = true;
      }
    });
  } else {
    roomsCapacityOptions.forEach(function (option) {
      option.disabled = option.value > 0 && option.value <= selectedValue ? false : true;
      if (option.selected && option.disabled) {
        selectedDisabled = true;
      }
    });
  }

  if (selectedDisabled) {
    roomsCapacity.setCustomValidity('Выбрана не допустимая опция');
    roomsCapacity.style.color = '#a82929';
  } else {
    roomsCapacity.setCustomValidity('');
    roomsCapacity.style.color = 'unset';
  }
}


