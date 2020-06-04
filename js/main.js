'use strict';
var mapSection = document.querySelector('section.map');
mapSection.classList.remove('map--faded');

var templateCard = document.querySelector('template#card').content.querySelector('article');
var templatePin = document.querySelector('template#pin').content.querySelector('.map__pin');

renderTemplates(templateCard, templatePin);

function renderTemplates(cardTemplate, pinTemplate) {
  var mapPins = mapSection.querySelector('.map__pins');
  var hotels = getFakeObjectsArray(8);
  for (var i = 0; i < hotels.length; i++) {
    var cardClone = cardTemplate.cloneNode(true);
    var pinClone = pinTemplate.cloneNode(true);
    renderCardTemplate(cardClone, hotels[i]);
    renderPinTemplate(pinClone, hotels[i]);
    mapPins.appendChild(cardClone);
    mapPins.appendChild(pinClone);
  }
}

function getFakeObjectsArray(quantity) {
  var data = [];
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

  for (var i = 1; i <= quantity; i++) {
    var obj = {};
    obj.author = {avatar: 'img/avatars/user0' + i + '.png'};
    obj.location = {
      x: randomInt(330, 830),
      y: randomInt(130, 630)
    };
    obj.offer = {
      title: hotelTitles[i - 1],
      address: obj.location.x + ', ' + obj.location.y,
      // address: '' + randomInt(100, 800) + ', ' + randomInt(100, 800) + '',
      price: randomInt(100, 800),
      type: ['palace', 'flat', 'house', 'bungalo'][randomInt(0, 3)],
      rooms: randomInt(1, 10),
      guests: randomInt(1, 10),
      checkin: ['12:00', '13:00', '14:00'][randomInt(0, 2)],
      checkout: ['12:00', '13:00', '14:00'][randomInt(0, 2)],
      features: ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'].slice(0, [randomInt(1, 5)]),
      description: 'Best place. Ever!',
      photos: hotelPhotos.slice(0, randomInt(1, 2))
    };

    data.push(obj);
  }
  return data;
}

function renderCardTemplate(card, hotel) {
  var cardChildren = card.querySelectorAll('[class^=popup]');
  var featuresRex = new RegExp(hotel.offer.features.join('|'), 'gi');
  for (var j = 0; j < cardChildren.length; j++) {
    if (cardChildren[j].classList.contains('popup__avatar')) {
      cardChildren[j].src = hotel.author.avatar;
    } else if (cardChildren[j].classList.contains('popup__title')) {
      cardChildren[j].textContent = hotel.offer.title;
    } else if (cardChildren[j].classList.contains('popup__text--address')) {
      cardChildren[j].textContent = hotel.offer.address;
    } else if (cardChildren[j].classList.contains('popup__text--price')) {
      cardChildren[j].innerHTML = '' + hotel.offer.price + '&#x20bd;<span>/ночь</span>';
    } else if (cardChildren[j].classList.contains('popup__type')) {
      cardChildren[j].textContent = hotel.offer.type;
    } else if (cardChildren[j].classList.contains('popup__capacity')) {
      cardChildren[j].textContent = '' + hotel.offer.rooms + ' комнаты для ' + hotel.offer.guests + ' гостей';
    } else if (cardChildren[j].classList.contains('popup__time')) {
      cardChildren[j].textContent = 'Заезд после' + hotel.offer.checkin + ', выезд до ' + hotel.offer.checkout + '';
    } else if (cardChildren[j].classList.value.match(/(feature--)/gi) && !cardChildren[j].classList.value.match(featuresRex)) {
      cardChildren[j].remove();
    } else if (cardChildren[j].classList.contains('popup__description')) {
      cardChildren[j].textContent = hotel.offer.description;
    } else if (cardChildren[j].classList.contains('popup__photos')) {
      cardChildren[j].children[0].src = hotel.offer.photos[0];
      if (hotel.offer.photos.length > 1) {
        for (var k = 1; k < hotel.offer.photos.length; k++) {
          var image = cardChildren[j].children[0].cloneNode();
          image.src = hotel.offer.photos[k];
          cardChildren[j].appendChild(image);
        }
      }
    }
  }
}

function renderPinTemplate(pin, hotel) {
  pin.children[0].src = hotel.author.avatar;
  pin.children[0].alt = hotel.offer.title;
  pin.style = 'left:' + (hotel.location.x - 25) + 'px; top: ' + (hotel.location.y - 70) + 'px;';
}

function randomInt(min, max) {
  var ans = min + Math.floor(Math.random() * (max + 1 - min));
  return ans;
}
