'use strict';

(function () {
  var FORM_UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var ROOMS_MESSAGE = 'Для заданного количества комнат выбранно не допустимое количество гостей';
  var INVALID_COLOR = '#a82929';
  var VALID_COLOR = '#000000';

  var getMainPinArrowCoordinates = window.keksobookingMap.getMainPinArrowCoordinates;
  var getMainPinCenterCoordinates = window.keksobookingMap.getMainPinCenterCoordinates;

  var guestNoticeForm = document.querySelector('.notice form.ad-form');
  var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
  var addressInput = guestNoticeForm.querySelector('#address');
  var filtersForm = window.keksobookingMap.mapSection.querySelector('.map__filters');
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
  // ###################################
  // ######     MODULE6-TASK3     ######
  // ###################################
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successPopup;
  var errorPopup;
  renderSuccessPopup(successTemplate);
  renderErrorPopup(errorTemplate);

  guestNoticeForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var formData = new FormData(guestNoticeForm);
    window.ajax.upload(FORM_UPLOAD_URL, successCallback, errorCallback, formData);
  });

  function successCallback() {
    showPopup(successPopup);
    window.addEventListener('click', successClickHandler);
    window.addEventListener('keydown', successEscapeHandler);
    window.main.disableKeksobooking();
    window.keksobookingMap.removeRenderedPins();
    window.keksobookingMap.removeRenderedCards();
    guestNoticeForm.reset();
  }

  function errorCallback() {
    showPopup(errorPopup);
    window.addEventListener('click', errorClickHandler);
    window.addEventListener('keydown', errorEscapeHandler);
  }

  function renderSuccessPopup(template) {
    var templateClone = template.cloneNode(true);
    successPopup = templateClone;
    hidePopup(templateClone);
    document.querySelector('main').append(templateClone);
  }

  function renderErrorPopup(template) {
    var templateClone = template.cloneNode(true);
    errorPopup = templateClone;
    hidePopup(templateClone);
    document.querySelector('main').append(templateClone);
  }

  function showPopup(element) {
    element.style.display = 'block';
  }

  function hidePopup(element) {
    element.style.display = 'none';
  }

  // EVENT HANDLERS
  // -------------------------------------------------
  function successClickHandler() {
    hidePopup(successPopup);
    removeSuccessListeners(successPopup);
  }

  function successEscapeHandler(event) {
    if (event.key === 'Escape') {
      hidePopup(successPopup);
      removeSuccessListeners(successPopup);
    }
  }

  function errorClickHandler() {
    hidePopup(errorPopup);
    removeErrorListeners();
  }

  function errorEscapeHandler(event) {
    if (event.key === 'Escape') {
      hidePopup(errorPopup);
      removeErrorListeners();
    }
  }

  // EVENT REMOVERS
  // -------------------------------------------------
  function removeSuccessListeners() {
    window.removeEventListener('click', successClickHandler);
    window.removeEventListener('keydown', successEscapeHandler);
  }

  function removeErrorListeners() {
    window.removeEventListener('click', errorClickHandler);
    window.removeEventListener('keydown', errorEscapeHandler);
  }

  // END MODULE6-TASK3    ##############
  // ###################################

  window.guestNoticeForm = {
    activateForm: activateForm,
    deactivateForm: deactivateForm
  };

})();
