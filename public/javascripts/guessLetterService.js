(function(){
    "use strict";
    angular.module('app').factory("guessLetterService", ["$http", function($http){
    
        var bestGuess = function(guessedLetter, wordId){
            var word = $http.post('/api/letter/guess', {
                guessedLetter: guessedLetter,
                wordId: wordId
            });
            return word;
        };

        var correctGuess = function(wordId){
             var word = $http.post('/api/letter/answer', {
                wordId: wordId
            });
            return word;
        };

        return {
            bestGuess: bestGuess,
            correctGuess: correctGuess
        };
    }]);

})();
