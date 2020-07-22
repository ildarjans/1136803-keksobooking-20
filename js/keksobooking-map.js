'use strict';

(function () {
  var mainPinOffset = {
    x: 32.5,
    y: 84
  };

  var mapSection = document.querySelector('section.map');
  var pinsContainer = document.querySelector('.map__pins');
  var mainPin = mapSection.querySelector('.map__pin--main');

  var mainPinMoveArea = {
    Y_MIN: 46,
    Y_MAX: 546,
    X_MIN: mainPinOffset.x * (-1),
    X_MAX: mapSection.offsetWidth - mainPinOffset.x
  };

  mainPin.style.zIndex = 2;
  window.addEventListener('resize', mainPinMoveAreaHandle);

  mainPin.addEventListener('mousedown', function () {
    mainPin.addEventListener('mousemove', mainPinMousemoveHandler);
    mainPin.addEventListener('mouseup', mainPinMouseupHandler);
    mainPin.addEventListener('mouseleave', mainPinMouseleaveHandler);
  });

  function getMainPinArrowCoordinates() {
    return {
      x: Math.floor(mainPin.offsetLeft + mainPinOffset.x),
      y: Math.floor(mainPin.offsetTop + mainPinOffset.y)
    };
  }

  function getMainPinCenterCoordinates() {
    return {
      x: Math.floor(mainPin.offsetLeft + (mainPin.offsetWidth / 2)),
      y: Math.floor(mainPin.offsetTop + (mainPin.offsetHeight / 2))
    };
  }

  function activateMap() {
    mapSection.classList.remove('map--faded');
    pinsContainer.addEventListener('focus', pinsFocusHandler, true);
    pinsContainer.addEventListener('blur', pinsBlurHandler, true);
  }

  function deactivateMap() {
    mapSection.classList.add('map--faded');
    pinsContainer.removeEventListener('focus', pinsFocusHandler, true);
    pinsContainer.removeEventListener('blur', pinsBlurHandler, true);
  }

  var mapFilters = mapSection.querySelector('.map__filters');

  function activateFilters() {
    mapFilters.classList.remove('ad-form--disabled');
  }

  function deactivateFilters() {
    mapFilters.classList.add('ad-form--disabled');
  }

  function mainPinMoveAreaHandle() {
    mainPinMoveArea.X_MAX = mapSection.offsetWidth - mainPinOffset.x;
  }

  function mainPinMousemoveHandler(evt) {
    var position = {
      x: mainPin.offsetLeft + evt.movementX,
      y: mainPin.offsetTop + evt.movementY
    };

    if (position.x > mainPinMoveArea.X_MAX) {
      position.x = mainPinMoveArea.X_MAX;
    } else if (position.x < mainPinMoveArea.X_MIN) {
      position.x = mainPinMoveArea.X_MIN;
    }

    if (position.y > mainPinMoveArea.Y_MAX) {
      position.y = mainPinMoveArea.Y_MAX;
    } else if (position.y < mainPinMoveArea.Y_MIN) {
      position.y = mainPinMoveArea.Y_MIN;
    }

    mainPin.style.left = position.x + 'px';
    mainPin.style.top = position.y + 'px';
  }

  function mainPinMouseupHandler() {
    setMainPinAddressInputValue();
    mainPin.removeEventListener('mousemove', mainPinMousemoveHandler);
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    mainPin.removeEventListener('mouseleave', mainPinMouseleaveHandler);
  }

  function mainPinMouseleaveHandler() {
    setMainPinAddressInputValue();
    mainPin.removeEventListener('mousemove', mainPinMousemoveHandler);
    mainPin.removeEventListener('mouseup', mainPinMouseupHandler);
    mainPin.removeEventListener('mouseleave', mainPinMouseleaveHandler);
  }

  function setMainPinAddressInputValue() {
    var pinArrowCoordinates = window.keksobookingMap.getMainPinArrowCoordinates();
    window.guestNoticeForm.addressInput.value = 'x: ' + pinArrowCoordinates.x + ', y: ' + pinArrowCoordinates.y;
  }

  function pinsFocusHandler(evt) {
    evt.target.classList.add('map__pin-active');
  }

  function pinsBlurHandler() {
    removePinActiveClass();
  }

  function removePinActiveClass() {
    var activePin = pinsContainer.querySelector('.map__pin-active');
    if (activePin) {
      activePin.classList.remove('map__pin-active');
    }
  }

  window.keksobookingMap = {
    activateMap: activateMap,
    activateFilters: activateFilters,
    deactivateMap: deactivateMap,
    deactivateFilters: deactivateFilters,
    getMainPinCenterCoordinates: getMainPinCenterCoordinates,
    getMainPinArrowCoordinates: getMainPinArrowCoordinates,
    mapFilters: mapFilters,
    mainPin: mainPin,
    mapSection: mapSection,
    pinsContainer: pinsContainer,
  };


})();
