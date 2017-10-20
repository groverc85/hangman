/* jshint node: true */
(function(){
    "use strict";

    var express = require('express');
	var router = express.Router();
	var fs = require('fs');
	var wordArray = [];
	var offset = 0;
	var chunkSize = 2048;
	var chunkBuffer = new Buffer(chunkSize);
	var fp = fs.openSync('routes/words_alpha.txt', 'r');
	var bytesRead = 0;

	var letters = ['e', 't', 'a', 'o', 'i', 'n', 's', 'h', 'r', 'd', 'l', 'c', 'u', 'm', 'w', 'f', 'g', 'y', 'p', 'b', 'v', 'k', 'j', 'x', 'q', 'z'];
	var vowels = ['a', 'e', 'i', 'o', 'u'];

	var getDifficlty = function(word){
		var lettersArr = word.split('');
		var letterSet = new Set(lettersArr);

		var wordLen = word.length;
		var wordSetLen = letterSet.size;
		var vowelCount = 0;
		var positionSum = 0;

		for (var i = 0; i < letterSet.size; i++) {
		    if (vowels.indexOf(letterSet[i]) != -1) {
		        vowelCount++;
		    }
		}

		for (i = 0; i < lettersArr.length; i++) {
		    if (letters.indexOf(lettersArr[i]) != -1) {
		        positionSum += letters.indexOf(lettersArr[i]);
		    }
		}

		var score = wordLen * wordSetLen * (7 - vowelCount) * positionSum;

		console.log("score", score);

		return score;
	};

	while(bytesRead = fs.readSync(fp, chunkBuffer, 0, chunkSize, offset)) {
	    offset += bytesRead;
	    var str = chunkBuffer.slice(0, bytesRead).toString();
	    var arr = str.split('\n');

	    for(var line = 0; line < arr.length; line++){
	      console.log("line:", arr[line].trim());
	      wordArray.push(arr[line].trim());
	    }

	    if(bytesRead == chunkSize) {
	        // the last item of the arr may be not a full line, leave it to the next chunk
	        offset -= arr.pop().length;
	    }
	}

	console.log(wordArray.length);


	router.get('/word/:level', function(req, res) {
		var randomId = Math.floor(Math.random() * wordArray.length);
		var randomLength = wordArray[randomId].length;
		var score = getDifficlty(wordArray[randomId]);
		var level = req.params.level;

		if (level == 'easy') {
			while (score > 2000) {
				randomId = Math.floor(Math.random() * wordArray.length);
				randomLength = wordArray[randomId].length;
				score = getDifficlty(wordArray[randomId]);
			}
		} else if (level == 'medium') {
			while (score > 10000 || score < 2000) {
				randomId = Math.floor(Math.random() * wordArray.length);
				randomLength = wordArray[randomId].length;
				score = getDifficlty(wordArray[randomId]);
			}
		} else if (level == 'hard') {
			while (score < 10000) {
				randomId = Math.floor(Math.random() * wordArray.length);
				randomLength = wordArray[randomId].length;
				score = getDifficlty(wordArray[randomId]);
			}
		} else if (level == 'random'){

		}

	  	res.send({
	  		randomId: randomId,
	  		randomLength: randomLength
	  	});
	});

	//GET final answer
	router.post('/letter/answer', function(req, res) {
		var randomId =  req.body.wordId;
		var letterArray = wordArray[randomId].split('');
		console.log(letterArray);
		res.send({
			letterArray: letterArray,
		});
	});


	//POST user guess
	router.post('/letter/guess', function(req, res) {
		var randomId =  req.body.wordId;
		var guess = req.body.guessedLetter;
		var correct = false;
		var letterArray = wordArray[randomId].split('');
		var hiddenArray = letterArray.slice().fill(0);
		for (var i = 0; i < letterArray.length; i++){
			var myLetter = letterArray[i];
			if (myLetter.toLowerCase() == guess.toLowerCase()){
				hiddenArray[i] = guess;
				correct = true;
			}
		}
		res.send({
			hiddenArray: hiddenArray,
			correct: correct
		});
	});


	module.exports = router;
})();
