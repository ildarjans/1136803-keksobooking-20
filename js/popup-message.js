'use strict';

(function () {
  var divStyle = {
    'align-items': 'center',
    'background-color': 'rgba(0, 0, 0, 0.4)',
    'border-radius': '5px',
    'color': '#fff',
    'display': 'flex',
    'font-size': '32px',
    'font-weight': '700',
    'height': '50%',
    'justify-content': 'center',
    'left': '50%',
    'padding': '20px',
    'position': 'absolute',
    'top': '50%',
    'transform': 'translate(-50%, -50%)',
    'width': '75%',
    'z-index': '100',
  };
  var spanStyle = {
    'cursor': 'pointer',
    'position': 'absolute',
    'right': '30px',
    'top': '20px'
  };

  function converObjectToStringCSS(style) {
    return Object.keys(style).reduce(function (accum, value) {
      accum += value + ': ' + style[value] + ';';
      return accum;
    }, '');
  }

  function renderPopupMessage(parent, message, delay) {
    var div = document.createElement('div');
    var span = document.createElement('span');
    div.style = converObjectToStringCSS(divStyle);
    span.style = converObjectToStringCSS(spanStyle);
    div.innerText = message;
    span.innerHTML = '&times;';
    div.append(span);
    parent.append(div);

    span.addEventListener('click', function () {
      div.remove();
    });

    setTimeout(function () {
      div.remove();
    }, delay);
  }

  window.popupMessage = {
    renderPopupMessage: renderPopupMessage
  };

})();
