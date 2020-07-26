'use strict';

(function () {
  var FORM_UPLOAD_URL = 'https://javascript.pages.academy/keksobooking';
  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
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
  var userAddedAvatarImages = [];
  var userAddedOfferPhotos = [];
  var avatarImagesAdded = 0;
  var offerImagesAdded = 0;
  var successPopup;
  var errorPopup;

  function formResetHandler() {
    window.main.disableKeksobooking();
  }

  function formSubmitHandler(evt) {
    evt.preventDefault();
    var formData = new FormData(guestNoticeForm);
    window.ajax.upload(FORM_UPLOAD_URL, restorePageToDefault, showErrorPopup, formData);
  }

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
    addressInput.value = pinCoordinates.x + ', ' + pinCoordinates.y;
    addFormEventListeners();
    validateRooms();
    enableFormFields();
    setMinPriceAccomodationType();
  }

  function deactivateForm() {
    var pinCoordinates = getMainPinCenterCoordinates();
    guestNoticeForm.classList.add('ad-form--disabled');
    filtersForm.classList.add('ad-form--disabled');
    addressInput.value = pinCoordinates.x + ', ' + pinCoordinates.y;
    removeFormEventListeners();
    restoreToDefaultAvatarImages();
    restoreToDefaultOfferPhotos();
    disableFormFields();
  }

  function addFormEventListeners() {
    avatarInput.addEventListener('change', avatarChangeHandler);
    accomodationType.addEventListener('change', accomodationTypeChangeHandler);
    accomodationPrice.addEventListener('change', accomodationPriceChangeHandler);
    checkinTime.addEventListener('change', checkinTimeChangeHandler);
    checkoutTime.addEventListener('change', checkoutTimeChangeHandler);
    guestNoticeForm.addEventListener('submit', formSubmitHandler);
    guestNoticeForm.addEventListener('reset', formResetHandler);
    roomsQuantity.addEventListener('change', roomsQuantityChangeHandler);
    roomsCapacity.addEventListener('change', roomsCapacityChangeHandler);
    offerPhotoInput.addEventListener('change', offerPhotoChangeHandler);
  }

  function removeFormEventListeners() {
    accomodationType.removeEventListener('change', accomodationTypeChangeHandler);
    accomodationPrice.removeEventListener('change', accomodationPriceChangeHandler);
    avatarInput.removeEventListener('change', avatarChangeHandler);
    checkinTime.removeEventListener('change', checkinTimeChangeHandler);
    checkoutTime.removeEventListener('change', checkoutTimeChangeHandler);
    guestNoticeForm.removeEventListener('submit', formSubmitHandler);
    guestNoticeForm.removeEventListener('reset', formResetHandler);
    roomsQuantity.removeEventListener('change', roomsQuantityChangeHandler);
    roomsCapacity.removeEventListener('change', roomsCapacityChangeHandler);
    offerPhotoInput.removeEventListener('change', offerPhotoChangeHandler);
  }

  function checkoutTimeChangeHandler() {
    checkinTime.value = checkoutTime.value;
  }

  function checkinTimeChangeHandler() {
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

  function accomodationTypeChangeHandler() {
    setMinPriceAccomodationType();
    validateAccomodationTypeAndPrice();
  }

  function accomodationPriceChangeHandler() {
    setMinPriceAccomodationType();
    validateAccomodationTypeAndPrice();
  }

  function roomsQuantityChangeHandler() {
    validateRooms();
  }

  function roomsCapacityChangeHandler() {
    validateRooms();
  }

  function restorePageToDefault() {
    showPopup(successPopup);
    window.addEventListener('click', windowSuccessClickHandler);
    window.addEventListener('keydown', windowSuccessEscapeHandler);
    window.main.disableKeksobooking();
    guestNoticeForm.reset();
  }

  function showErrorPopup() {
    showPopup(errorPopup);
    window.addEventListener('click', windowErrorClickHandler);
    window.addEventListener('keydown', windowErrorEscapeHandler);
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

  function windowSuccessClickHandler() {
    hidePopup(successPopup);
    removeWindowSuccessListeners(successPopup);
  }

  function windowSuccessEscapeHandler(evt) {
    if (evt.key === 'Escape') {
      hidePopup(successPopup);
      removeWindowSuccessListeners(successPopup);
    }
  }

  function windowErrorClickHandler() {
    hidePopup(errorPopup);
    removeWindowErrorListeners();
  }

  function windowErrorEscapeHandler(evt) {
    if (evt.key === 'Escape') {
      hidePopup(errorPopup);
      removeWindowErrorListeners();
    }
  }

  function removeWindowSuccessListeners() {
    window.removeEventListener('click', windowSuccessClickHandler);
    window.removeEventListener('keydown', windowSuccessEscapeHandler);
  }

  function removeWindowErrorListeners() {
    window.removeEventListener('click', windowErrorClickHandler);
    window.removeEventListener('keydown', windowErrorEscapeHandler);
  }

  function avatarChangeHandler(evt) {
    if (AVATAR_IMAGES_LIMIT > avatarImagesAdded) {
      imageUploader(evt.target, loadendAvatarImageHandler);
    } else {
      popupMessage(UPLOAD_IMAGES_MESSAGE);
    }
  }

  function offerPhotoChangeHandler(evt) {
    if (OFFER_IMAGES_LIMIT > offerImagesAdded) {
      imageUploader(evt.target, loadendOfferPhotoHandler);
    } else {
      popupMessage(UPLOAD_IMAGES_MESSAGE);
    }
  }

  function imageUploader(target, renderImageHandler) {
    if (target.files.length === 1) {
      var fr = new FileReader();
      var file = target.files[0];
      fr.readAsDataURL(file);
      fr.addEventListener('loadend', renderImageHandler, {once: true});
    }
  }

  function loadendAvatarImageHandler(evt) {
    if (avatarImagesAdded > 0) {
      var nextAvatarPreview = avatarPreview.cloneNode(true);
      nextAvatarPreview.children[0].src = evt.target.result;
      avatarPreview.insertAdjacentElement('afterend', nextAvatarPreview);
      userAddedAvatarImages.push(nextAvatarPreview);
    } else {
      avatarPreview.children[0].src = evt.target.result;
      userAddedAvatarImages.push(avatarPreview);
    }
    avatarImagesAdded++;
  }

  function loadendOfferPhotoHandler(evt) {
    var img = document.createElement('img');
    img.src = evt.target.result;
    if (offerImagesAdded > 0) {
      var nextOfferPhoto = offerPhotoPreview.cloneNode();
      nextOfferPhoto.append(img);
      offerPhotosContainer.append(nextOfferPhoto);
      userAddedOfferPhotos.push(nextOfferPhoto);
    } else {
      offerPhotoPreview.append(img);
      userAddedOfferPhotos.push(offerPhotoPreview);
    }
    offerImagesAdded++;
  }

  function restoreToDefaultAvatarImages() {
    avatarImagesAdded = 0;
    userAddedAvatarImages.forEach(function (avatar) {
      if (avatar !== avatarPreview) {
        avatar.remove();
      } else {
        avatarPreview.children[0].src = DEFAULT_AVATAR;
      }
    });
  }

  function restoreToDefaultOfferPhotos() {
    offerImagesAdded = 0;
    userAddedOfferPhotos.forEach(function (photo) {
      if (photo !== offerPhotoPreview) {
        photo.remove();
      } else {
        offerPhotoPreview.children[0].remove();
      }
    });
  }

  renderSuccessPopup(successTemplate);
  renderErrorPopup(errorTemplate);

  window.bookingForm = {
    activateForm: activateForm,
    deactivateForm: deactivateForm,
    addressInput: addressInput
  };

})();
