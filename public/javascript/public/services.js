var services = angular.module('services', ['ngResource']);

services.factory('StateService', ['$state', function ($state) {
    var getUrlComponents = function (url) {
        var urlComp = url.split('/');
        if(url[0] == '/') urlComp.splice(0,1);
        return urlComp;
    };

    var getRootState = function (url) {
        var allStates = $state.get();
        var root = getUrlComponents(url)[0];

        var stateUrlComp;

        for(var i=0; i<allStates.length; i++){
            if(allStates[i].url){
                stateUrlComp = getUrlComponents(allStates[i].url);
                if(stateUrlComp.length==1 && stateUrlComp[0]==root) return allStates[i];
            }
        }

        return null;
    };

    var getPossibleStates = function (url) {
        var allStates = $state.get();

        var rootState = getRootState(url);

        //find candidates; make sure root state is first
        var candidates = [rootState];
        for(var k=0; k<allStates.length; k++){
            if(allStates[k].name.match("^"+rootState.name) && allStates[k].name != rootState.name){
                candidates.push(allStates[k]);
            }
        }

        return candidates;
    };

    var findStateByName = function (states, name) {
        for(var i=0; i<states.length; i++){
            if(states[i].name == name) return states[i];
        }
        return null;
    };

    var getStateUrl = function(state){
        var states = $state.get();
        var url = "";
        var nameComponents = state.name.split('.');
        var current = "";

        var currentState;

        var done = false;
        while(nameComponents.length > 0 && !done){
            currentState = findStateByName(states, current?current.concat("."+nameComponents[0]):nameComponents[0]);
            if(currentState){
                url = url.concat(currentState.url);
                if(current){
                    current = current.concat("."+nameComponents[0]);
                }else{
                    current = nameComponents[0];
                }
                nameComponents.splice(0,1);
            }else{
                done = true;
            }
        }

        return url;
    };

    var getProbableStates = function (url) {
        var urlComponents = getUrlComponents(url);
        var ps = [];
        var candidates = getPossibleStates(url);
        for(var i=0; i<candidates.length; i++){
            var stateUrl = getStateUrl(candidates[i]);
            var stateUrlComp = getUrlComponents(stateUrl);
            if(urlComponents.length == stateUrlComp.length){
                var newState = {
                    name: candidates[i].name,
                    params: {}
                };
                for(var j=0, keepGoing=true; j<stateUrlComp.length && keepGoing==true; j++){
                    if(stateUrlComp[j][0]==':'){
                        var param = stateUrlComp[j].split(':').pop();
                        newState.params[param] = urlComponents[j];
                    }else if(stateUrlComp[j] !== urlComponents[j]){
                        keepGoing = false;
                        newState = null;
                    }
                }
                if(newState) ps.push(newState);
            }
        }
        return ps;
    };
    var getStateFromURL = function (url) {
        var probableStates = getProbableStates(url);
        if(probableStates.length == 1){
            return probableStates[0];
        }else{
            return null;
        }
    };
    return{
        getStateFromUrl: function (url) {
            return getStateFromURL(url);
        }
    }
}]);

services.factory('HomeService', ['$resource', function($resource){
    return {
        getCarouselData: $resource('apiPublic/getCarouselData/', {}, {
            query: { method: 'GET', isArray: true }
        }),
        getSearchResults: $resource('apiPublic/publicSearchResults/', {}, {
            query: { method: 'POST', isArray: true }
        }),
        events: $resource('apiPublic/events', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);
services.factory('ContentService', ['$resource', function($resource){
    return {
        content: $resource('apiPublic/content', {}, {
            query: { method: 'GET', isArray: false }
        }),
        mostRead: $resource('apiPublic/mostRead', {}, {
            query: { method: 'GET', isArray: false }
        }),
        therapeuticAreas: $resource('apiPublic/therapeuticAreas/', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);
services.factory('AuthService', ['$resource', function($resource){
    return {
        login: $resource('/login', {}, {
            query: { method: 'POST', isArray: false }
        }),
        signup: $resource('/apiGloballyShared/createAccount', {}, {
            query: { method: 'POST', isArray: false }
        }),
        reset: $resource('/apiGloballyShared/requestPasswordReset', {}, {
            query: { method: 'POST', isArray: false }
        })
    }
}]);
services.factory('ActivationCodeService', ['$resource', function($resource){
    return {
        professions: $resource('api/accountActivation/professions', {}, {
            query: { method: 'GET', isArray: true }
        }),
        processData: $resource('api/accountActivation/processData', {}, {
            save: {method:'POST'}
        }),
        specialGroups: $resource('api/accountActivation/specialGroups/:profession', {}, {
            query: { method: 'GET', isArray: true }
        })
    }
}]);