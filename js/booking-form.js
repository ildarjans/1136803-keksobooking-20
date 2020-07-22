'use strict';

(function () {
  var FORM_UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var ROOMS_MESSAGE = 'Для заданного количества комнат выбранно не допустимое количество гостей';
  var MIN_PRICE_MESSAGE = 'Для выбранного типа жилья цена не может быть ниже ';
  var INVALID_COLOR = '#a82929';
  var VALID_COLOR = '#000000';
  var minPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var getMainPinArrowCoordinates = window.keksobookingMap.getMainPinArrowCoordinates;
  var getMainPinCenterCoordinates = window.keksobookingMap.getMainPinCenterCoordinates;
  var filtersForm = window.keksobookingMap.mapSection.querySelector('.map__filters');
  var guestNoticeForm = document.querySelector('.notice form.ad-form');
  var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
  var addressInput = guestNoticeForm.querySelector('#address');
  var roomsQuantity = guestNoticeForm.querySelector('#room_number');
  var roomsCapacity = guestNoticeForm.querySelector('#capacity');
  var accomodationType = guestNoticeForm.querySelector('#type');
  var accomodationPrice = guestNoticeForm.querySelector('#price');
  var checkinTime = guestNoticeForm.querySelector('#timein');
  var checkoutTime = guestNoticeForm.querySelector('#timeout');

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var successPopup;
  var errorPopup;

  guestNoticeForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(guestNoticeForm);
    window.ajax.upload(FORM_UPLOAD_URL, successCallback, errorCallback, formData);
  });

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
    accomodationType.addEventListener('change', changeAccomodationType);
    accomodationPrice.addEventListener('change', changeAccomodationPrice);
    checkinTime.addEventListener('change', syncronizeCheckinTime);
    checkoutTime.addEventListener('change', syncronizeCheckoutTime);
    roomsQuantity.addEventListener('change', changeRoomsQuantity);
    roomsCapacity.addEventListener('change', changeRoomsCapacity);
    addressInput.value = 'x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y;
    validateRooms();
    enableFormFields();
  }

  function deactivateForm() {
    var pinCoordinates = getMainPinCenterCoordinates();
    guestNoticeForm.classList.add('ad-form--disabled');
    filtersForm.classList.add('ad-form--disabled');
    accomodationType.removeEventListener('change', changeAccomodationType);
    accomodationPrice.removeEventListener('change', changeAccomodationPrice);
    checkinTime.removeEventListener('change', syncronizeCheckinTime);
    checkoutTime.removeEventListener('change', syncronizeCheckoutTime);
    roomsQuantity.removeEventListener('change', changeRoomsQuantity);
    roomsCapacity.removeEventListener('change', changeRoomsCapacity);
    addressInput.value = 'x: ' + pinCoordinates.x + ', y: ' + pinCoordinates.y;
    disableFormFields();
  }

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

  function changeRoomsQuantity() {
    validateRooms();
  }

  function changeRoomsCapacity() {
    validateRooms();
  }

  function successCallback() {
    var pinClickHandler = window.main.pinClickHandler;
    var pinKeyEnterHandler = window.main.pinKeyEnterHandler;
    showPopup(successPopup);
    window.addEventListener('click', successClickHandler);
    window.addEventListener('keydown', successEscapeHandler);
    window.main.disableKeksobooking();
    window.hotelsPins.removeRenderedPins(pinClickHandler, pinKeyEnterHandler);
    window.hotelsCards.removeCurrentCard();
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

  function successClickHandler() {
    hidePopup(successPopup);
    removeSuccessListeners(successPopup);
  }

  function successEscapeHandler(evt) {
    if (evt.key === 'Escape') {
      hidePopup(successPopup);
      removeSuccessListeners(successPopup);
    }
  }

  function errorClickHandler() {
    hidePopup(errorPopup);
    removeErrorListeners();
  }

  function errorEscapeHandler(evt) {
    if (evt.key === 'Escape') {
      hidePopup(errorPopup);
      removeErrorListeners();
    }
  }

  function removeSuccessListeners() {
    window.removeEventListener('click', successClickHandler);
    window.removeEventListener('keydown', successEscapeHandler);
  }

  function removeErrorListeners() {
    window.removeEventListener('click', errorClickHandler);
    window.removeEventListener('keydown', errorEscapeHandler);
  }

  renderSuccessPopup(successTemplate);
  renderErrorPopup(errorTemplate);


  window.guestNoticeForm = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    addressInput: addressInput
  };

})();
