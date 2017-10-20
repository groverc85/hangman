(function(){
    "use strict";
    angular.module('app').directive('hangmanImage', [function() {
		return {
			restrict: 'E',
			scope: {
				incorrectCount: '@'
			},
			link: function(scope){
	    		var hangmanMapping = {
	    			0: 'images/background.jpg',
		    		1: 'images/hangman0.jpg',
		    		2: 'images/hangman1.jpg',
		    		3: 'images/hangman2.jpg',
		    		4: 'images/hangman3.jpg',
		    		5: 'images/hangman4.jpg',
		    		6: 'images/hangman5.jpg',
		    		7: 'images/hangman6.jpg',
		    		8: 'images/hangman7.jpg',
		    		9: 'images/deaddude.jpg',
		    		10: 'images/graveyard.jpg',
		    	};
		    	
		    	scope.imageSrc = hangmanMapping[scope.incorrectCount];

		    	scope.$watch(
		    		function (scope) {
		    			return scope.incorrectCount;
		    		}, 
		    		function() {
						scope.imageSrc = hangmanMapping[scope.incorrectCount];
			    	});
	      	},
			template: '<img ng-show="imageSrc" src="{{imageSrc}}" />'
		};
	}]);
})();
