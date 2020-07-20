'use strict';

(function () {

  var activatePins = window.hotelsPins.activatePins;
  var removeCurrentCard = window.hotelsCards.removeCurrentCard;
  var removeRenderedPins = window.hotelsPins.removeRenderedPins;
  var renderHotelsPins = window.hotelsPins.renderPins;

  var hotelsInputFilters = {
    'housing-type': filterByType,
    'housing-price': filterByPrice,
    'housing-guests': filterByGuests,
    'housing-rooms': filterByRooms,

  };

  var hotelsFeaturesFilter = {
    'features': filterByFeatures
  };

  var priceRangeDescription = {
    'low': {
      min: 0,
      max: 10000,
    },
    'middle': {
      min: 10000,
      max: 50000,
    },
    'high': {
      min: 50000,
      max: 1000000000,
    },
  };

  var mapFilters = window.keksobookingMap.mapFilters;

  function applyFormFilters(hotels, maxPins) {
    var filteredIds = getFilteredHotelsIds(mapFilters, hotels).slice(0, maxPins);
    removeRenderedPins();
    removeCurrentCard();
    renderHotelsPins(filteredIds, hotels);
    activatePins();
  }

  function getFilteredHotelsIds(form, hotels) {
    var formData = getFilterFormObject(form);
    var hotelsId = Object.keys(hotels);
    Object.keys(hotelsInputFilters).forEach(function (name) {
      if (formData[name] !== 'any' &&
          formData[name][0] !== undefined) {
        hotelsId = hotelsInputFilters[name](hotels, hotelsId, formData[name]);
      }
    });
    return hotelsId;
  }

  function filterByType(hotels, hotelsId, value) {
    return hotelsId.filter(function (id) {
      return hotels[id].offer.type === value;
    });
  }

  function filterByPrice(hotels, hotelsId, value) {
    var min = priceRangeDescription[value].min;
    var max = priceRangeDescription[value].max;

    return hotelsId.filter(function (id) {
      return hotels[id].offer.price >= min && hotels[id].offer.price < max;
    });
  }

  function filterByRooms(hotels, hotelsId, value) {
    return hotelsId.filter(function (id) {
      return hotels[id].offer.rooms === +value;
    });
  }

  function filterByGuests(hotels, hotelsId, value) {
    return hotelsId.filter(function (id) {
      return hotels[id].offer.guests === +value;
    });
  }

  function filterByFeatures(hotels, hotelsId, features) {
    if (features[0] === undefined) {
      return hotelsId;
    }
    return hotelsId.filter(function (id) {
      var matched = true;
      for (var i = 0; i < features.length; i++) {
        if (!hotels[id].offer.features.includes(features[i])) {
          matched = false;
          break;
        }
      }
      return matched;
    });
  }

  function getFilterFormObject(form) {
    var formData = new FormData(form);
    var result = {};
    Object.keys(hotelsInputFilters).forEach(function (name) {
      result[name] = formData.get(name);
    });
    Object.keys(hotelsFeaturesFilter).forEach(function (name) {
      result[name] = formData.getAll(name);
    });
    return result;
  }

  window.filterForm = {
    applyPinsFilters: applyFormFilters
  };

})();
