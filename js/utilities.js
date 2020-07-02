'use strict';

(function () {
  function getRandomInteger(min, max) {
    return min + Math.floor(Math.random() * (max + 1 - min));
  }

  function getShuffledArray(arr) {
    if (arr.length < 1) {
      return arr;
    }
    var quantity = getRandomInteger(1, arr.length - 1);
    var randomNames = [];
    while (randomNames.length < quantity) {
      var guess = arr[getRandomInteger(0, arr.length - 1)];
      if (randomNames.indexOf(guess) < 0) {
        randomNames.push(guess);
      }
    }
    return randomNames;
  }

  window.utilities = {
    getRandomInteger: getRandomInteger,
    getShuffledArray: getShuffledArray
  };

})();
