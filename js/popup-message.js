'use strict';

(function () {
  var HIDE_POPUP_DELAY = 5000;
  var containerStyles = [
    'align-items: center',
    'background-color: rgba(0, 0, 0, 0.75)',
    'color: #fff',
    'display: none',
    'font-size: 32px',
    'font-weight: 700',
    'height: 100%',
    'justify-content: center',
    'left: 0%',
    'padding: 20px',
    'position: fixed',
    'top: 0%',
    'transition: all 0.3s',
    'width: 100%',
    'z-index: 100'
  ];
  var closeButtonStyles = [
    'cursor: pointer',
    'font-size: 64px',
    'font-weight: 100',
    'position: absolute',
    'right: 30px',
    'top: 20px'
  ];

  var container = document.createElement('div');
  var closeButton = document.createElement('span');
  var paragraph = document.createElement('p');

  function renderPopup() {
    container.style = containerStyles.join(';');
    closeButton.style = closeButtonStyles.join(';');
    closeButton.innerHTML = '&times;';
    container.append(paragraph);
    container.append(closeButton);
    document.body.append(container);
  }

  function clickСloseButtonHandler() {
    hidePopup();
  }

  function clickWindowHandler(evt) {
    if (evt.target !== container) {
      hidePopup();
    }
  }

  function hidePopup() {
    container.style.display = 'none';
    closeButton.removeEventListener('click', clickСloseButtonHandler);
    window.removeEventListener('click', clickWindowHandler);
  }

  function showPopup(message) {
    container.style.display = 'flex';
    paragraph.innerText = message;
    closeButton.addEventListener('click', clickСloseButtonHandler);
    window.addEventListener('click', clickWindowHandler);
    setTimeout(function () {
      hidePopup();
    }, HIDE_POPUP_DELAY);
  }

  renderPopup();

  window.popupMessage = {
    show: showPopup,
  };

})();

