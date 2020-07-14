'use strict';

(function () {

  var ROOMS_MESSAGE = 'Для заданного количества комнат выбранно не допустимое количество гостей';
  var MIN_PRICE_MESSAGE = 'Для выбранного типа жилья цена не может быть ниже ';
  var INVALID_COLOR = '#a82929';
  var VALID_COLOR = '#000000';

  var getMainPinArrowCoordinates = window.keksobookingMap.getMainPinArrowCoordinates;
  var getMainPinCenterCoordinates = window.keksobookingMap.getMainPinCenterCoordinates;

  var mapSection = document.querySelector('section.map');
  var guestNoticeForm = document.querySelector('.notice form.ad-form');
  var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
  var addressInput = guestNoticeForm.querySelector('#address');
  var filtersForm = mapSection.querySelector('.map__filters');
  var roomsQuantity = guestNoticeForm.querySelector('#room_number');
  var roomsCapacity = guestNoticeForm.querySelector('#capacity');
  var accomodationType = guestNoticeForm.querySelector('#type');
  var accomodationPrice = guestNoticeForm.querySelector('#price');
  var checkinTime = guestNoticeForm.querySelector('#timein');
  var checkoutTime = guestNoticeForm.querySelector('#timeout');

  function disableFormFields() {
    formFields.forEach(function (field) {
      field.disabled = true;
    });
  }

  function enableFormFields() {
    formFields.forEach(function (field) {
      field.disabled = false;
    });
  }

  function validateRooms() {
    var selectedRoom = roomsQuantity.selectedOptions[0].value;
    var roomsCapacityOptions = Array.from(roomsCapacity.options);
    var selectedAndDisabled = false;

    roomsCapacityOptions.forEach(function (option) {
      if (selectedRoom === '100') {
        option.disabled = option.value !== '0';
      } else {
        option.disabled = !(option.value <= selectedRoom && option.value !== '0');
      }

      option.style.color = option.disabled ? 'unset' : VALID_COLOR;
      selectedAndDisabled = option.selected && option.disabled || selectedAndDisabled;

    });

    if (selectedAndDisabled) {
      roomsCapacity.setCustomValidity(ROOMS_MESSAGE);
      roomsCapacity.style.color = INVALID_COLOR;
    } else {
      roomsCapacity.setCustomValidity('');
      roomsCapacity.style.color = 'unset';
    }
  }

  function activateForm() {
    var pinCoordinates = getMainPinArrowCoordinates();
    guestNoticeForm.classList.remove('ad-form--disabled');
    filtersForm.classList.remove('ad-form--disabled');
    roomsQuantity.addEventListener('change', changeRoomsQuantity);
    roomsCapacity.addEventListener('change', changeRoomsCapacity);
    addressInput.value = 'x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y;
    accomodationType.addEventListener('change', changeAccomodationType);
    accomodationPrice.addEventListener('change', changeAccomodationPrice);
    checkinTime.addEventListener('change', syncronizeCheckinTime);
    checkoutTime.addEventListener('change', syncronizeCheckoutTime);
    validateRooms();
    enableFormFields();
  }

  function deactivateForm() {
    var pinCoordinates = getMainPinCenterCoordinates();
    guestNoticeForm.classList.add('ad-form--disabled');
    filtersForm.classList.add('ad-form--disabled');
    roomsQuantity.removeEventListener('change', changeRoomsQuantity);
    roomsCapacity.removeEventListener('change', changeRoomsCapacity);
    addressInput.value = 'x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y;
    accomodationType.removeEventListener('change', changeAccomodationType);
    accomodationPrice.removeEventListener('change', changeAccomodationPrice);
    checkinTime.removeEventListener('change', syncronizeCheckinTime);
    checkoutTime.removeEventListener('change', syncronizeCheckoutTime);
    disableFormFields();
  }

  function changeRoomsQuantity() {
    validateRooms();
  }

  function changeRoomsCapacity() {
    validateRooms();
  }

  // #####################################
  // ######     MODULE4-TASK3       ######
  // #####################################

  var minPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  function syncronizeCheckoutTime() {
    checkinTime.value = checkoutTime.value;
  }

  function syncronizeCheckinTime() {
    checkoutTime.value = checkinTime.value;
  }

  function setMinPriceForAccomodationType() {
    accomodationPrice.min = minPrices[accomodationType.value];
    accomodationPrice.placeholder = minPrices[accomodationType.value];
  }

  function validateAccomodationTypeAndPrice() {
    var selectedType = accomodationType.selectedOptions[0].value;

    if (minPrices[selectedType] > accomodationPrice.value) {
      accomodationPrice.setCustomValidity(MIN_PRICE_MESSAGE + minPrices[selectedType]);
      accomodationPrice.style.color = INVALID_COLOR;
    } else {
      accomodationPrice.setCustomValidity('');
      accomodationPrice.style.color = 'unset';
    }
  }

  function changeAccomodationType() {
    setMinPriceForAccomodationType();
    validateAccomodationTypeAndPrice();
  }

  function changeAccomodationPrice() {
    setMinPriceForAccomodationType();
    validateAccomodationTypeAndPrice();
  }

  window.guestNoticeForm = {
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };

})();
