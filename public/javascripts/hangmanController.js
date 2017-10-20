(function(){
    "use strict";

    angular.module('app').controller('hangmanController',
        ['$scope', '$uibModal', 'randomWordService', 'guessLetterService', 'localStorageService', function($scope, $uibModal,  randomWordService, guessLetterService, localStorageService){

            //Object that initializes guess and guessError as being blank and false
            $scope.form={
                guess: "",
                // version 1: guessError is used to indicate whether the input is valid or not(length == 1)
                // version 2: guessError is deprecated since we validate the input right after user input value, instead of on submit.
                guessError: false,
                level: 'random',
                wins: 0,
                loses: 0,
                points: 100,
            };

            $scope.resetGame = resetGame;
            $scope.resetGame();

            $scope.setLevel = setLevel;
            $scope.setLevel();

            //Function that sets spaces for the random word chosen by the randomWordService
            function setSpaces(){
                var spaces = "";
                for (var i=0; i < $scope.lengthOfWord; i++){
                    spaces+="_ ";
                }
                return spaces.trim();
            }

            //Function that validates user's input and clear out input window
            $scope.submit = function () {
                if ($scope.form.guess.length != 1) {
                    $scope.form.guessError = true;
                } else {  
                    $scope.form.guessError = false;
                    var guessPromise = guessLetterService.bestGuess($scope.form.guess, $scope.randomId);
                    guessPromise.success(function(data){
                        $scope.hiddenArray = data.hiddenArray;
                        $scope.correct = data.correct;
                        guess($scope.form.guess);
                        $scope.form.guess = "";
                        localStorageService.set('form', $scope.form);
                    });
                }    
            };

            $scope.Confirm = function () {
                var alertModalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'confirmAlert.html',
                    scope: $scope
                });
                $scope.ok = function () {
                    alertModalInstance.close(true);
                };
            };

            // Function for updating correct guess
            function guess(){
                var space = $scope.wordSpace.split(' ');
                if ($scope.correct){
                    for (var i = 0; i < $scope.lengthOfWord; i++){
                        if($scope.hiddenArray[i] !== 0){
                            space[i] = $scope.hiddenArray[i].toLowerCase();
                        }
                    }
                } 
                else {
                    wrongGuess($scope.form.guess);
                }
                if (space.indexOf('_') == -1){
                    $scope.gameInfo = "You won!";
                    $scope.form.wins += 1;
                    $scope.showRestart = true;
                    $scope.showSubmit = false;

                    // bonus from winning the game 
                    switch ($scope.form.level) {
                        case 'easy':
                            $scope.form.points += 200;
                            break;
                        case 'medium':
                            $scope.form.points += 300;
                            break;
                        case 'hard':
                            $scope.form.points += 400;
                            break;
                        case 'random':
                            $scope.form.points += 300;
                            break;
                        default:
                            break;
                    }
                } 
                $scope.wordSpace=space.join(' ');
            }


            //Function that updates the array of wrong letters if the user guesses incorrectly
            function wrongGuess(){
                if ($scope.wrongGuesses.indexOf($scope.form.guess) == -1){
                    // each wrong guess would cost user 10 points.
                    $scope.form.points -= 10;
                    $scope.wrongGuesses.push($scope.form.guess.toLowerCase());
                    
                    if ($scope.wrongGuesses.length == 10){
                        // show correct answer
                        var correctGuessPromise = guessLetterService.correctGuess($scope.randomId);
                        correctGuessPromise.success(function(data){
                            $scope.hiddenArray = data.letterArray;

                            var spaceArray = $scope.wordSpace.split(' ');
                            for (var i = 0; i < $scope.lengthOfWord; i++){
                                if($scope.hiddenArray[i] !== 0){
                                    spaceArray[i] = $scope.hiddenArray[i];
                                }
                            }
                            $scope.wordSpace = spaceArray.join(' ');
                            $scope.form.guess = "";
                        });
                        $scope.showRestart = true;
                        $scope.showSubmit = false;
                        $scope.gameInfo = "You lost.";
                        $scope.form.loses += 1;
                    }
                }
            }

            function setLevel(level) {
                if (level !== undefined) {
                    $scope.form.level = level;
                }
                localStorageService.set('form', $scope.form);
                resetGame();
            }

            //Function that resets the game
            function resetGame () {
                var randomWordPromise;

                switch ($scope.form.level) {
                    case 'easy':
                        randomWordPromise = randomWordService.getEasyWord();
                        break;
                    case 'medium':
                        randomWordPromise = randomWordService.getMediumWord();
                        break;
                    case 'hard':
                        randomWordPromise = randomWordService.getHardWord();
                        break;
                    case 'random':
                        randomWordPromise = randomWordService.getWildcardWord();
                        break;
                    default:
                        break;
                }

                randomWordPromise.success(function(data){
                    $scope.gameInfo = "Hangman Game";
                    $scope.randomId = data.randomId;
                    $scope.lengthOfWord = data.randomLength;
                    $scope.wordSpace = setSpaces($scope.lengthOfWord);
                    $scope.showRestart = false;
                    $scope.showSubmit = true;
                    $scope.wrongGuesses = [];
                });

                if (localStorageService.get('form') !== null && localStorageService.get('form') !== undefined) {
                    $scope.form = localStorageService.get('form');
                }
            }
    }]);
})();
