'use strict';

(function () {

  var ROOMS_MESSAGE = 'Для заданного количества комнат выбранно не допустимое количество гостей';
  var INVALID_COLOR = '#a82929';
  var VALID_COLOR = '#000000';

  var mapSection = document.querySelector('section.map');
  var getMainPinArrowCoordinates = window.keksobookingMap.getMainPinArrowCoordinates;
  var getMainPinCenterCoordinates = window.keksobookingMap.getMainPinCenterCoordinates;

  var guestNoticeForm = document.querySelector('.notice form.ad-form');
  var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
  var addressInput = guestNoticeForm.querySelector('#address');
  var filtersForm = mapSection.querySelector('.map__filters');
  var roomsQuantity = guestNoticeForm.querySelector('#room_number');
  var roomsCapacity = guestNoticeForm.querySelector('#capacity');

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
    roomsQuantity.addEventListener('change', validateRooms);
    roomsCapacity.addEventListener('change', validateRooms);
    addressInput.value = 'x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y;
    validateRooms();
    enableFormFields();
  }

  function deactivateForm() {
    var pinCoordinates = getMainPinCenterCoordinates();
    guestNoticeForm.classList.add('ad-form--disabled');
    filtersForm.classList.add('ad-form--disabled');
    roomsQuantity.removeEventListener('change', validateRooms);
    roomsCapacity.removeEventListener('change', validateRooms);
    addressInput.value = 'x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y;
    disableFormFields();
  }

  window.guestNoticeForm = {
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };

})();
