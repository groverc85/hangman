app.controller('hangmanController',

    ['$scope', 'randomWordService', 'guessLetterService', 'localStorageService', function($scope, randomWordService, guessLetterService, localStorageService){

        //Object that initializes guess and guessError as being blank and false
		$scope.form={
    		guess: "",
    		guessError: false,
            level: 'random',
            wins: 0,
            loses: 0,
    	};

    	$scope.resetGame = resetGame;
    	$scope.resetGame();

        $scope.setLevel = setLevel;
        $scope.setLevel();

        //Function that sets spaces for the random word chosen by the randomWordService
    	function setSpaces(){
    		spaces = "";
    		for (i=0; i < $scope.lengthOfWord; i++){
    			spaces+="_ ";
    		};
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
                    $scope.form.guess="";
                    localStorageService.set('form', $scope.form);
                })	
    		}    
        }

        // Function for updating correct guess
        function guess(){
            var space = $scope.wordSpace.split(' ');
            if ($scope.correct){
                for (i = 0; i < $scope.lengthOfWord; i++){
                    if($scope.hiddenArray[i] !== 0){
                        space[i] = $scope.hiddenArray[i];
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
            } 
            $scope.wordSpace=space.join(' ');
        }


        //Function that updates the array of wrong letters if the user guesses incorrectly
		function wrongGuess(){
			if ($scope.wrongGuesses.indexOf($scope.form.guess) == -1){
				$scope.wrongGuesses.push($scope.form.guess);		
    			if ($scope.wrongGuesses.length == 10){
                    // show correct answer
                    var correctGuessPromise = guessLetterService.correctGuess($scope.randomId);
                    correctGuessPromise.success(function(data){
                        $scope.hiddenArray = data.letterArray;

                        var spaceArray = $scope.wordSpace.split(' ');
                        for (i = 0; i < $scope.lengthOfWord; i++){
                            if($scope.hiddenArray[i] !== 0){
                                spaceArray[i] = $scope.hiddenArray[i];
                            }
                        }
                        $scope.wordSpace=spaceArray.join(' ');
                        $scope.form.guess="";
                    })  
    				$scope.showRestart = true;
                    $scope.showSubmit = false;
    				$scope.gameInfo = "You lost."
                    $scope.form.loses += 1;
    			}
			}
		}

        function setLevel(level) {
            if (level != undefined) {
                $scope.form.level = level;
            }
            localStorageService.set('form', $scope.form);
            resetGame();
        }

        //Function that resets the game
		function resetGame () {
            var randomWordPromise = randomWordService.getWildcardWord();

            if ($scope.form.level == 'easy') {
                randomWordPromise = randomWordService.getEasyWord();
            } else if ($scope.form.level == 'medium') {
                randomWordPromise = randomWordService.getMediumWord();
            } else if ($scope.form.level == 'hard') {
                randomWordPromise = randomWordService.getHardWord();
            } else if ($scope.form.level == 'random') {
            } 

            randomWordPromise.success(function(data){
                $scope.gameInfo = "Hangman Game";
                $scope.randomId = data.randomId;
                $scope.lengthOfWord = data.randomLength;
                $scope.wordSpace = setSpaces($scope.lengthOfWord);
                $scope.showRestart = false;
                $scope.showSubmit = true;
                $scope.wrongGuesses = []; 
            })	

            if (localStorageService.get('form') != null) {
                $scope.form = localStorageService.get('form');
            }
		}
}]);

