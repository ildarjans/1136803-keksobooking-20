'use strict';

(function () {
  var mainPinOffset = {
    x: -32.5,
    y: -84
  };

  var mapSection = window.commonElements.getMapSection();
  var mainPin = window.commonElements.getMainPin();

  var ROOMS_MESSAGE = 'Для заданного количества комнат выбранно не допустимое количество гостей';
  var INVALID_COLOR = '#a82929';
  var VALID_COLOR = '#000000';

  var guestNoticeForm = document.querySelector('.notice form.ad-form');
  var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
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

  function setAddressInputValue(address) {
    guestNoticeForm.querySelector('#address').value = address;
  }

  function getMainPinArrowCoordinates() {
    return {
      x: mainPin.offsetLeft + mainPinOffset.x,
      y: mainPin.offsetTop + mainPinOffset.y
    };
  }

  function getMainPinCenterCoordinates() {
    return {
      x: mainPin.offsetLeft + (mainPin.offsetWidth / 2),
      y: mainPin.offsetTop + (mainPin.offsetHeight / 2)
    };
  }

  function activateForm() {
    var pinCoordinates = getMainPinArrowCoordinates();
    guestNoticeForm.classList.remove('ad-form--disabled');
    filtersForm.classList.remove('ad-form--disabled');
    roomsQuantity.addEventListener('change', validateRooms);
    roomsCapacity.addEventListener('change', validateRooms);
    accomodationType.addEventListener('change', setPriceForAccomodationType);
    checkinTime.addEventListener('change', equalizeByCheckinTime);
    checkoutTime.addEventListener('change', equalizeByCheckoutTime);
    setAddressInputValue('x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y);
    validateRooms();
    enableFormFields();
  }

  function deactivateForm() {
    var pinCoordinates = getMainPinCenterCoordinates();
    guestNoticeForm.classList.add('ad-form--disabled');
    filtersForm.classList.add('ad-form--disabled');
    roomsQuantity.removeEventListener('change', validateRooms);
    roomsCapacity.removeEventListener('change', validateRooms);
    accomodationType.removeEventListener('change', setPriceForAccomodationType);
    checkinTime.removeEventListener('change', equalizeByCheckinTime);
    checkoutTime.removeEventListener('change', equalizeByCheckoutTime);
    setAddressInputValue('x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y);
    disableFormFields();
  }

  // #####################################
  // ######     MODULE4-TASK3       ######
  // #####################################

  var print = console.log;
  var accomodationTypeMinPrice = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };

  function equalizeByCheckoutTime() {
    checkinTime.value = this.value;
  }

  function equalizeByCheckinTime() {
    checkoutTime.value = this.value;
  }

  function setPriceForAccomodationType() {
    accomodationPrice.min = accomodationTypeMinPrice[this.value];
  }

  window.guestNoticeForm = {
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };

})();
