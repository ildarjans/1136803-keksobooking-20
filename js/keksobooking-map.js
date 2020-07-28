'use strict';

(function () {
  var MainPinOffset = {
    X: 32.5,
    Y: 84
  };

  var MainPinDefaultPosition = {
    X: '570px',
    Y: '375px'
  };

  var mapSection = document.querySelector('section.map');

  var MainPinMoveArea = {
    Y_MIN: 46,
    Y_MAX: 546,
    X_MIN: MainPinOffset.X * (-1),
    X_MAX: mapSection.offsetWidth - MainPinOffset.X
  };

  var pinsContainer = document.querySelector('.map__pins');
  var mainPin = mapSection.querySelector('.map__pin--main');
  var mapFilters = mapSection.querySelector('.map__filters');

  mainPin.style.zIndex = 2;
  window.addEventListener('resize', windowResizeHandler);

  mainPin.addEventListener('mousedown', function () {
    mainPin.addEventListener('mousemove', mainPinMousemoveHandler);
    mainPin.addEventListener('mouseup', mainPinMouseupHandler);
    mainPin.addEventListener('mouseleave', mainPinMouseleaveHandler);
  });

  function getMainPinArrowCoordinates() {
    return {
      x: Math.floor(mainPin.offsetLeft + MainPinOffset.X),
      y: Math.floor(mainPin.offsetTop + MainPinOffset.Y)
    };
  }

  function getMainPinCenterCoordinates() {
    return {
      x: Math.floor(mainPin.offsetLeft + (mainPin.offsetWidth / 2)),
      y: Math.floor(mainPin.offsetTop + (mainPin.offsetHeight / 2))
    };
  }

  function setMainPinDefaultPosition() {
    mainPin.style.left = MainPinDefaultPosition.X;
    mainPin.style.top = MainPinDefaultPosition.Y;
  }

  function activateMap() {
    mapSection.classList.remove('map--faded');
    mapFilters.classList.remove('ad-form--disabled');
    pinsContainer.addEventListener('focus', pinsFocusHandler, true);
    pinsContainer.addEventListener('blur', pinsBlurHandler, true);
  }

  function deactivateMap() {
    mapSection.classList.add('map--faded');
    mapFilters.classList.add('ad-form--disabled');
    pinsContainer.removeEventListener('focus', pinsFocusHandler, true);
    pinsContainer.removeEventListener('blur', pinsBlurHandler, true);
    setMainPinDefaultPosition();
    mapFilters.reset();
  }

  function windowResizeHandler() {
    MainPinMoveArea.X_MAX = mapSection.offsetWidth - MainPinOffset.X;
  }

  function mainPinMousemoveHandler(evt) {
    var position = {
      x: mainPin.offsetLeft + evt.movementX,
      y: mainPin.offsetTop + evt.movementY
    };

    if (position.x > MainPinMoveArea.X_MAX) {
      position.x = MainPinMoveArea.X_MAX;
    } else if (position.x < MainPinMoveArea.X_MIN) {
      position.x = MainPinMoveArea.X_MIN;
    }

    if (position.y > MainPinMoveArea.Y_MAX) {
      position.y = MainPinMoveArea.Y_MAX;
    } else if (position.y < MainPinMoveArea.Y_MIN) {
      position.y = MainPinMoveArea.Y_MIN;
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
    window.bookingForm.addressInput.value = pinArrowCoordinates.x + ', ' + pinArrowCoordinates.y;
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
    activate: activateMap,
    deactivate: deactivateMap,
    getMainPinCenterCoordinates: getMainPinCenterCoordinates,
    getMainPinArrowCoordinates: getMainPinArrowCoordinates,
    mapFilters: mapFilters,
    mainPin: mainPin,
    mapSection: mapSection,
    pinsContainer: pinsContainer,
  };

})();
