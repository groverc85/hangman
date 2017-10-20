/*global describe, it */
(function(){
    "use strict";

	describe('guessLetterService factory', function() {
		var guessLetterService;

		beforeEach(angular.mock.module('app'));
		// Before each test set our injected guessLetterService factory (_guessLetterService_) to our local variable
		beforeEach(inject(function(_guessLetterService_) {
			guessLetterService = _guessLetterService_;
		}));

		// A simple test to verify the guessLetterService factory exists
		it('should exist', function() {
			expect(guessLetterService).toBeDefined();
		});
	});


	describe('randomWordService factory', function() {
		var randomWordService;

		beforeEach(angular.mock.module('app'));

	  	// Before each test set our injected guessLetterService factory (_randomWordService_) to our local variable
	  	beforeEach(inject(function(_randomWordService_) {
	    	randomWordService = _randomWordService_;
	  	}));

	  	// A simple test to verify the randomWordService factory exists
	  	it('should exist', function() {
		    expect(randomWordService).toBeDefined();
	  	});
	});


	describe('hangmanController', function () {
		var $controller;

		beforeEach(angular.mock.module('app'));

		beforeEach(angular.mock.inject(function(_$controller_){
		  $controller = _$controller_;
		}));

		it('should exist', function() {
			expect($controller).toBeDefined();
		});
	});

})();