'use strict';

(function () {
  var FORM_UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var ROOMS_MESSAGE = 'Для заданного количества комнат выбранно не допустимое количество гостей';
  var MIN_PRICE_MESSAGE = 'Для выбранного типа жилья цена не может быть ниже ';
  var UPLOAD_IMAGES_MESSAGE = 'Достигнут предел загруженных изображений.\n' +
  'Приносим извинения за доставленные неудобства';
  var INVALID_COLOR = '#a82929';
  var VALID_COLOR = '#000000';
  var AVATAR_IMAGES_LIMIT = 3;
  var OFFER_IMAGES_LIMIT = 5;

  var minPrices = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  var guestNoticeForm = document.querySelector('.notice form.ad-form');
  var avatarPreview = guestNoticeForm.querySelector('.ad-form-header__preview');
  var avatarInput = guestNoticeForm.querySelector('.ad-form-header__input');
  var formFields = guestNoticeForm.querySelectorAll('fieldset[class^=ad-form');
  var addressInput = guestNoticeForm.querySelector('#address');
  var roomsQuantity = guestNoticeForm.querySelector('#room_number');
  var roomsCapacity = guestNoticeForm.querySelector('#capacity');
  var accomodationType = guestNoticeForm.querySelector('#type');
  var accomodationPrice = guestNoticeForm.querySelector('#price');
  var checkinTime = guestNoticeForm.querySelector('#timein');
  var checkoutTime = guestNoticeForm.querySelector('#timeout');
  var offerPhotosContainer = guestNoticeForm.querySelector('.ad-form__photo-container');
  var offerPhotoInput = offerPhotosContainer.querySelector('.ad-form__input');
  var offerPhotoPreview = offerPhotosContainer.querySelector('.ad-form__photo');

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');
  var filtersForm = window.keksobookingMap.mapFilters;
  var getMainPinArrowCoordinates = window.keksobookingMap.getMainPinArrowCoordinates;
  var getMainPinCenterCoordinates = window.keksobookingMap.getMainPinCenterCoordinates;
  var popupMessage = window.popupMessage.show;
  var avatarImagesAdded = 0;
  var offerImagesAdded = 0;
  var successPopup;
  var errorPopup;


  guestNoticeForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(guestNoticeForm);
    window.ajax.upload(FORM_UPLOAD_URL, restorePageToDefault, showErrorPopup, formData);
  });

  guestNoticeForm.addEventListener('reset', function () {
    window.main.disableKeksobooking();
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
    accomodationType.addEventListener('change', accomodationTypeHandler);
    accomodationPrice.addEventListener('change', accomodationPriceHandler);
    checkinTime.addEventListener('change', checkinTimeHandler);
    checkoutTime.addEventListener('change', checkoutTimeHandler);
    roomsQuantity.addEventListener('change', roomsQuantityHandler);
    roomsCapacity.addEventListener('change', roomsCapacityHandler);
    addressInput.value = pinCoordinates.x + ', ' + pinCoordinates.y;
    validateRooms();
    enableFormFields();
    setMinPriceAccomodationType();
  }

  function deactivateForm() {
    var pinCoordinates = getMainPinCenterCoordinates();
    guestNoticeForm.classList.add('ad-form--disabled');
    filtersForm.classList.add('ad-form--disabled');
    accomodationType.removeEventListener('change', accomodationTypeHandler);
    accomodationPrice.removeEventListener('change', accomodationPriceHandler);
    checkinTime.removeEventListener('change', checkinTimeHandler);
    checkoutTime.removeEventListener('change', checkoutTimeHandler);
    roomsQuantity.removeEventListener('change', roomsQuantityHandler);
    roomsCapacity.removeEventListener('change', roomsCapacityHandler);
    addressInput.value = pinCoordinates.x + ', ' + pinCoordinates.y;
    disableFormFields();
  }

  function checkoutTimeHandler() {
    checkinTime.value = checkoutTime.value;
  }

  function checkinTimeHandler() {
    checkoutTime.value = checkinTime.value;
  }

  function setMinPriceAccomodationType() {
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

  function accomodationTypeHandler() {
    setMinPriceAccomodationType();
    validateAccomodationTypeAndPrice();
  }

  function accomodationPriceHandler() {
    setMinPriceAccomodationType();
    validateAccomodationTypeAndPrice();
  }

  function roomsQuantityHandler() {
    validateRooms();
  }

  function roomsCapacityHandler() {
    validateRooms();
  }

  function restorePageToDefault() {
    showPopup(successPopup);
    window.addEventListener('click', successClickHandler);
    window.addEventListener('keydown', successEscapeHandler);
    window.main.disableKeksobooking();
    guestNoticeForm.reset();
  }

  function showErrorPopup() {
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

  avatarInput.addEventListener('change', function (evt) {
    if (AVATAR_IMAGES_LIMIT > avatarImagesAdded) {
      imageUploader(evt.target, avatarImagesHandler);
    } else {
      popupMessage(UPLOAD_IMAGES_MESSAGE);
    }
  });

  offerPhotoInput.addEventListener('change', function (evt) {
    if (OFFER_IMAGES_LIMIT > offerImagesAdded) {
      imageUploader(evt.target, offerPhotosHandler);
    } else {
      popupMessage(UPLOAD_IMAGES_MESSAGE);
    }
  });

  function imageUploader(target, renderImageHandler) {
    var fr = new FileReader();
    var file = target.files[0];
    fr.readAsDataURL(file);
    fr.addEventListener('loadend', renderImageHandler, {once: true});
  }

  function avatarImagesHandler(evt) {
    if (avatarImagesAdded > 0) {
      var nextAvatarPreview = avatarPreview.cloneNode(true);
      nextAvatarPreview.children[0].src = evt.target.result;
      avatarPreview.insertAdjacentElement('afterend', nextAvatarPreview);
    } else {
      avatarPreview.children[0].src = evt.target.result;
    }
    avatarImagesAdded++;
  }

  function offerPhotosHandler(evt) {
    var img = document.createElement('img');
    img.src = evt.target.result;
    if (offerImagesAdded > 0) {
      var nextOfferPhoto = offerPhotoPreview.cloneNode();
      nextOfferPhoto.append(img);
      offerPhotosContainer.append(nextOfferPhoto);
    } else {
      offerPhotoPreview.append(img);
    }
    offerImagesAdded++;
  }

  renderSuccessPopup(successTemplate);
  renderErrorPopup(errorTemplate);

  window.bookingForm = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    addressInput: addressInput
  };

})();
