(function(){
    "use strict";
    var app = angular.module('app', ['LocalStorageModule', 'ui.bootstrap']);

	app.config(function (localStorageServiceProvider) {
	  localStorageServiceProvider
	    .setPrefix('hangman1.0')
	    // .setStorageType('sessionStorage')
	    .setNotify(true, true);
	});
})();
