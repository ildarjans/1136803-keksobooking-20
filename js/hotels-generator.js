'use strict';

(function () {
  var getRandomInteger = window.utilities.getRandomInteger;
  var getShuffledArray = window.utilities.getShuffledArray;

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

  function generateHotelsArray(quantity) {
    quantity = quantity === undefined ? 8 : quantity;
    var data = [];

    for (var i = 1; i <= quantity; i++) {
      var obj = {};
      obj.author = {avatar: 'img/avatars/user0' + i + '.png'};
      obj.location = {
        x: getRandomInteger(hotelProperties.location.X_MIN, hotelProperties.location.X_MAX),
        y: getRandomInteger(hotelProperties.location.Y_MIN, hotelProperties.location.Y_MAX)
      };
      obj.offer = {
        title: hotelNames[i - 1],
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

  function getRandomHotelType() {
    return hotelTypes[getRandomInteger(0, hotelTypes.length - 1)];
  }

  function getRandomTime(timesArray) {
    return timesArray[getRandomInteger(0, timesArray.length - 1)];
  }

  window.hotelsGenerator = {
    generateHotelsArray: generateHotelsArray
  };

})();
