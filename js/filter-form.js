'use strict';

(function () {
  var DEBOUNCE_DELAY = 500;

  var removeCurrentCard = window.hotelsCards.removeCurrentCard;
  var removeRenderedPins = window.hotelsPins.removeRenderedPins;
  var renderHotelsPins = window.hotelsPins.renderPins;
  var mapFilters = window.keksobookingMap.mapFilters;

  var hotelsInputFilters = {
    'housing-type': matchedHotelByType,
    'housing-price': matchedHotelByPrice,
    'housing-guests': matchedHotelByGuests,
    'housing-rooms': matchedHotelByRooms,
  };

  var hotelsFeaturesFilter = {
    features: filterByFeatures
  };

  var priceRangeDescription = {
    low: {
      min: 0,
      max: 10000,
    },
    middle: {
      min: 10000,
      max: 50000,
    },
    high: {
      min: 50000,
      max: 1000000000,
    },
  };

  var hotels;
  var hotelsIds = [];
  var maxPinsDisplay;

  function enableFilterForm(hotelsObj, maxPins) {
    hotels = hotelsObj;
    maxPinsDisplay = maxPins;
    var debouncedFilters = window.utilities.debounce(applyFormFilters, DEBOUNCE_DELAY);
    mapFilters.addEventListener('change', function () {
      debouncedFilters();
    });
  }

  function applyFormFilters() {
    var appliedFilters = getSelectedFilters(mapFilters);
    hotelsIds = filterHotelsIds(appliedFilters, maxPinsDisplay);
    removeRenderedPins();
    removeCurrentCard();
    renderHotelsPins(hotelsIds, hotels);
  }

  function getSelectedFilters(form) {
    var formData = new FormData(form);
    var result = [];
    Object.keys(hotelsInputFilters).forEach(function (name) {
      var selectedValue = formData.get(name);
      if (selectedValue !== 'any') {
        result.push({
          filterName: hotelsInputFilters[name],
          value: selectedValue
        });
      }
    });
    Object.keys(hotelsFeaturesFilter).forEach(function (name) {
      var selectedFeatures = formData.getAll(name);
      if (selectedFeatures.length > 0) {
        result.push({
          filterName: hotelsFeaturesFilter[name],
          value: selectedFeatures
        });
      }
    });
    return result;
  }

  function filterHotelsIds(selectedFilters, maxPins) {
    var resultIds = [];
    hotelsIds = Object.keys(hotels);
    for (var i = 0; i < hotelsIds.length; i++) {
      if (resultIds.length >= maxPins) {
        break;
      }
      var id = hotelsIds[i];
      var matched = true;
      for (var j = 0; j < selectedFilters.length; j++) {
        var matchSelectedFilter = selectedFilters[j].filterName;
        var value = selectedFilters[j].value;
        if (!matchSelectedFilter(hotels[id], value)) {
          matched = false;
          break;
        }
      }
      if (matched) {
        resultIds.push(hotelsIds[i]);
      }
    }
    return resultIds;
  }

  function matchedHotelByType(hotel, value) {
    return hotel.offer.type === value;
  }

  function matchedHotelByPrice(hotel, value) {
    var min = priceRangeDescription[value].min;
    var max = priceRangeDescription[value].max;
    return hotel.offer.price >= min && hotel.offer.price < max;
  }

  function matchedHotelByRooms(hotel, value) {
    return hotel.offer.rooms === +value;
  }

  function matchedHotelByGuests(hotel, value) {
    return hotel.offer.guests === +value;
  }

  function filterByFeatures(hotel, features) {
    var featuresMatched = true;
    for (var i = 0; i < features.length; i++) {
      if (!hotel.offer.features.includes(features[i])) {
        featuresMatched = false;
        break;
      }
    }
    return featuresMatched;
  }

  window.filterForm = {
    enableFilterForm: enableFilterForm
  };

})();
