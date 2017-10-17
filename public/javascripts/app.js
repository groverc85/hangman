var app = angular.module('app', ['LocalStorageModule']);

app.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('hangman')
    // .setStorageType('sessionStorage')
    .setNotify(true, true)
});
