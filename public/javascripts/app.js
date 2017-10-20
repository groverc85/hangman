(function(){
    "use strict";
    var app = angular.module('app', ['LocalStorageModule', 'ui.bootstrap']);

	app.config(function (localStorageServiceProvider) {
	  localStorageServiceProvider
	    .setPrefix('hangman')
	    // .setStorageType('sessionStorage')
	    .setNotify(true, true);
	});
})();
