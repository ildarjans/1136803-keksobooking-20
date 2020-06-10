'use strict';

var hotelDefaultProperties = {
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
var pinRenderProperties = {
  OFFSETX: -25,
  OFFSETY: -70
};

var hotelTitles = ['Hotel Yamanote Otsuka Eki Tower',
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

var featuresOptions = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var hotelTypes = ['palace', 'flat', 'house', 'bungalo'];
var checkInOptions = ['12:00', '13:00', '14:00'];
var checkOutOptions = ['12:00', '13:00', '14:00'];

var mapSection = document.querySelector('section.map');
mapSection.classList.remove('map--faded');

var cardTemplate = document.querySelector('template#card').content.querySelector('.map__card.popup');
var pinTemplate = document.querySelector('template#pin').content.querySelector('.map__pin');

renderHotels(cardTemplate, pinTemplate);

function renderHotels(card, pin) {
  var mapPins = mapSection.querySelector('.map__pins');
  var hotels = generateHotelsArray(8, hotelTitles);
  for (var i = 0; i < hotels.length; i++) {
    renderCardTemplate(mapPins, card, hotels[i]);
    renderPinTemplate(mapPins, pin, hotels[i]);
  }
}
function generateHotelsArray(quantity, titles) {
  var data = [];

  for (var i = 1; i <= quantity; i++) {
    var obj = {};
    obj.author = {avatar: 'img/avatars/user0' + i + '.png'};
    obj.location = {
      x: getRandomInteger(hotelDefaultProperties.location.X_MIN, hotelDefaultProperties.location.X_MAX),
      y: getRandomInteger(hotelDefaultProperties.location.Y_MIN, hotelDefaultProperties.location.Y_MAX)
    };
    obj.offer = {
      title: titles[i - 1],
      address: obj.location.x + ', ' + obj.location.y,
      price: getRandomInteger(hotelDefaultProperties.price.MIN, hotelDefaultProperties.price.MAX),
      type: getRandomHotelType(),
      rooms: getRandomInteger(hotelDefaultProperties.rooms.MIN, hotelDefaultProperties.rooms.MAX),
      guests: getRandomInteger(hotelDefaultProperties.guests.MIN, hotelDefaultProperties.guests.MAX),
      checkin: getRandomCheckInTime(),
      checkout: getRandomCheckOutTime(),
      features: getRandomFeatures(),
      description: 'Великолепная квартира-студия в центре Токио. Подходит как туристам, так и бизнесменам. Квартира полностью укомплектована и недавно отремонтирована.',
      photos: getRandomPhotos()
    };
    data.push(obj);
  }
  return data;
}
function renderCardTemplate(parent, card, hotel) {
  var cardClone = card.cloneNode(true);

  cardClone.querySelector('.popup__avatar').src = hotel.author.avatar;
  cardClone.querySelector('.popup__title').textContent = hotel.offer.title;
  cardClone.querySelector('.popup__text--address').textContent = hotel.offer.address;
  cardClone.querySelector('.popup__text--price').innerHTML = hotel.offer.price + '&#x20bd;<span>/ночь</span>';
  cardClone.querySelector('.popup__type').textContent = hotel.offer.type;
  cardClone.querySelector('.popup__text--capacity').textContent = hotel.offer.rooms + ' комнаты для ' + hotel.offer.guests + ' гостей';
  cardClone.querySelector('.popup__text--time').textContent = 'Заезд после' + hotel.offer.checkin + ', выезд до ' + hotel.offer.checkout;
  cardClone.querySelector('.popup__description').textContent = hotel.offer.description;

  renderCardFeatures(cardClone, hotel);
  renderCardPhotos(cardClone, hotel);

  parent.append(cardClone);
}
function renderPinTemplate(parent, pin, hotel) {
  var pinClone = pin.cloneNode(true);
  pinClone.children[0].src = hotel.author.avatar;
  pinClone.children[0].alt = hotel.offer.title;
  pinClone.style = 'left:' + (hotel.location.x + pinRenderProperties.OFFSETX) + 'px; top: ' + (hotel.location.y + pinRenderProperties.OFFSETY) + 'px;';
  parent.append(pinClone);
}
function renderCardFeatures(card, hotel) {
  var features = card.querySelectorAll('.popup__feature');
  var regex = new RegExp(hotel.offer.features.join('|'), 'gi');
  features.forEach(function (feature) {
    return !feature.classList.value.match(regex) ? feature.remove() : '';
  });
}
function renderCardPhotos(card, hotel) {
  var photosContainer = card.querySelector('.popup__photos');
  var photo = card.querySelector('.popup__photo');
  for (var i = 0; i < hotel.offer.photos.length; i++) {
    var nextPhoto = i === 0 ? photo : photo.cloneNode();
    nextPhoto.src = hotel.offer.photos[i];
    photosContainer.append(nextPhoto);
  }
}
function getRandomPhotos() {
  return hotelPhotos.slice(0, getRandomInteger(1, hotelPhotos.length - 1));
}
function getRandomFeatures() {
  return featuresOptions.slice(0, getRandomInteger(1, featuresOptions.length - 1));
}
function getRandomHotelType() {
  return hotelTypes[getRandomInteger(0, hotelTypes.length - 1)];
}
function getRandomCheckInTime() {
  return checkInOptions[getRandomInteger(0, checkInOptions.length - 1)];
}
function getRandomCheckOutTime() {
  return checkOutOptions[getRandomInteger(0, checkOutOptions.length - 1)];
}
function getRandomInteger(min, max) {
  return min + Math.floor(Math.random() * (max + 1 - min));
}
