'use strict';

(function () {
  var ErrorMessages = {
    UNKNOWN_ERROR: 'Произошла не предвиденная ошибка.\n\nПовторите попытку позже.',
    TIMEOUT_EXPIRED: 'Время ожидания запроса истекло.\n\nПовторите попытку позже.'
  };

  function getStatusErrorMessage(xhr) {
    return 'Код ошибки ' + xhr.status + ', ' + xhr.statusText +
    '!\n\nПовторите попытку позже.';
  }

  function createXHR(url, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', url);
    xhr.send();

    addXHRListeners(xhr, successCallback, errorCallback);
  }

  function uploadXHR(url, successCallback, errorCallback, formData) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.send(formData);

    addXHRListeners(xhr, successCallback, errorCallback);
  }

  function addXHRListeners(xhr, successCallback, errorCallback) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        successCallback(xhr.response);
      } else {
        errorCallback(getStatusErrorMessage(xhr));
      }
    });

    xhr.addEventListener('error', function () {
      errorCallback(ErrorMessages.UNKNOWN_ERROR);
    });

    xhr.addEventListener('timeout', function () {
      errorCallback(ErrorMessages.TIMEOUT_EXPIRED);
    });
  }

  window.ajax = {
    load: createXHR,
    upload: uploadXHR
  };

})();
