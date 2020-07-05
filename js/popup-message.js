'use strict';

(function () {
  var HIDE_POPUP_DELAY = 3000;
  var containerStyle = [
    'align-items: center',
    'background-color: rgba(0, 0, 0, 0.75)',
    'border-radius: 5px',
    'color: #fff',
    'display: none',
    'font-size: 32px',
    'font-weight: 700',
    'height: 50%',
    'justify-content: center',
    'left: 50%',
    'padding: 20px',
    'position: absolute',
    'top: 50%',
    'transform: translate(-50%, -50%)',
    'transition: all 0.3s',
    'width: 75%',
    'z-index: 100'
  ];
  var closeButtonStyle = [
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
    container.style = containerStyle.join(';');
    closeButton.style = closeButtonStyle.join(';');
    closeButton.innerHTML = '&times;';
    container.append(paragraph);
    container.append(closeButton);
    document.body.append(container);
    closeButton.addEventListener('click', clickСloseButtonHandler);
  }

  function clickСloseButtonHandler() {
    hidePopup();
    container.removeEventListener('click', clickСloseButtonHandler);
  }

  function hidePopup() {
    container.style.display = 'none';
  }

  function showPopup(delay) {
    delay = delay === undefined ? HIDE_POPUP_DELAY : delay;
    container.style.display = 'flex';
    setTimeout(function () {
      closeButton.removeEventListener('click', clickСloseButtonHandler);
      hidePopup();
    }, delay);
  }

  function insertText(message) {
    paragraph.innerText = message;
  }

  renderPopup();

  window.popupMessage = {
    insertText: insertText,
    show: showPopup,
  };

})();

