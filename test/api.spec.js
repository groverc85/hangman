/*global describe, it */
(function(){
    "use strict";
    var expect  = require("chai").expect;
    var request = require("request");

    describe("Hangman API", function() {
      describe("Get word of different difficulty level", function() {
        it('should return 200', function (done) {
          request.get('http://localhost:3000/api/word/random', function (err, res){
            expect(res.statusCode).to.equal(200);
            done();
          });
        });

        it('should return valid word length', function (done) {
          request.get('http://localhost:3000/api/word/easy', function (err, res, body){
            var obj = JSON.parse(body);
            expect(obj.randomLength).to.be.gte(1);
            done();
          });
        });
      });


      describe("Guess word", function() {
        it('should return 200', function (done) {
          request.post('http://localhost:3000/api/letter/guess', {form:{wordId:'10', guessedLetter: 'a'}}, function (err, res){
            expect(res.statusCode).to.equal(200);
            done();
          });
        });

        it('should return correct judgement', function (done) {
          request.post('http://localhost:3000/api/letter/guess', {form:{wordId:'10', guessedLetter: 'a'}}, function (err, res, body){
            var obj = JSON.parse(body);
            expect(obj.hiddenArray).to.have.same.members(["a","a",0,0]);
            expect(obj.correct).to.equal(true);
            done();
          });
        });
      });


      describe("Return correct answer", function() {
        it('should return 200', function (done) {
          request.post('http://localhost:3000/api/letter/answer', {form:{wordId:'10'}}, function (err, res){
            expect(res.statusCode).to.equal(200);
            done();
          });
        });

        it('should return correct answer', function (done) {
          request.post('http://localhost:3000/api/letter/answer', {form:{wordId:'10'}}, function (err, res, body){
            var obj = JSON.parse(body);
            expect(obj.letterArray).to.have.same.members(["a","a","l","s"]);
            done();
          });
        });
      });
    });
})();
