app.factory("randomWordService", ["$http", function($http){
    
    var getWildcardWord = function(){
        var word = $http.get('/api/word/random');
        return word;
    };

    var getEasyWord = function(){
        var word = $http.get('/api/word/easy');
        return word;
    };

    var getMediumWord = function(){
        var word = $http.get('/api/word/medium');
        return word;
    };

    var getHardWord = function(){
        var word = $http.get('/api/word/hard');
        return word;
    };
    
    return {
        getWildcardWord: getWildcardWord,
        getEasyWord: getEasyWord,
        getMediumWord: getMediumWord,
        getHardWord: getHardWord,
    };
}]);


