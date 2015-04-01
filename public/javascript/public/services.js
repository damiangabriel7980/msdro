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
        var stateNameComp;

        for(var i=0; i<allStates.length; i++){
            if(allStates[i].url){
                stateUrlComp = getUrlComponents(allStates[i].url);
                stateNameComp = allStates[i].name.split('.');
                if(stateNameComp.length==1 && stateUrlComp[0]==root) return allStates[i];
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
services.factory('AuthService', ['$resource', 'Utils', function($resource, Utils){
    var validateCreate = function (thiz, callback) {
        if(!thiz.user.username){
            callback("Va rugam introduceti un email");
        }else if(!thiz.user.name){
            callback("Va rugam introduceti un nume");
        }else if(!thiz.user.title){
            callback("Va rugam selectati un titlu");
        }else if(!thiz.user.password){
            callback("Va rugam introduceti o parola");
        }else if(!thiz.nonUser.confirm){
            callback("Va rugam confirmati parola");
        }else if(thiz.user.password != thiz.nonUser.confirm) {
            callback("Parolele nu corespund");
        }else{
            callback(null);
        }
    };
    var validateUpdate = function (thiz, callback) {
        var user = JSON.parse(JSON.stringify(thiz.user));
        var county = thiz.county.selected._id;
        var city = thiz.city.selected._id;

        if(!user.profession){
            callback("Va rugam selectati o profesie");
        }else if(!(user.temp.proofType === 'code' || user.temp.proofType === 'file')){
            callback("Trebuie sa incarcati o dovada sau sa introduceti un cod");
        }else if(user.temp.proofType == "code" && !user.temp.activationCode){
            callback("Va rugam introduceti codul de activare");
        }else if(user.temp.proofType == "file" && !user.temp.proofFile){
            callback("Va rugam incarcati dovada");
        }else if(!user.groupsID){
            callback("Va rugam selectati un grup preferat");
        }else if(!user.address){
            callback("Va rugam introduceti o adresa");
        }else if(!county){
            callback("Va rugam selectati un judet");
        }else if(!city){
            callback("Va rugam selectati un oras");
        }else if(!thiz.nonUser.termsStaywell){
            callback("Trebuie sa acceptati termenii si conditiile Staywell pentru a continua");
        }else if(!thiz.nonUser.termsMSD){
            callback("Trebuie sa acceptati politica MSD privind datele profesionale pentru a continua");
        }else{

            //format data according to database model
            thiz.user.citiesID = [city];
            thiz.user.groupsID = [user.groupsID];

            callback();
        }
    };
    var getActivationData = function (thiz, callback) {
        var activation = {
            type: thiz.user.temp.proofType,
            value: null
        };

        if(thiz.user.temp.proofType === "file"){
            var extension = thiz.user.temp.proofFile.name.split('.').pop();
            Utils.fileToBase64(thiz.user.temp.proofFile, function (b64) {
                activation.value = {
                    file: b64,
                    extension: extension
                };
                callback(activation);
            });
        }else{
            activation.value = thiz.user.temp.activationCode;
            callback(activation);
        }
    };
    var completeProfile = $resource('apiGloballyShared/completeProfile', {}, {
        save: {method:'POST'}
    });
    var createAccount = $resource('/apiGloballyShared/createAccountStaywell', {}, {
        save: { method: 'POST', isArray: false }
    });
    return {
        login: $resource('/login', {}, {
            query: { method: 'POST', isArray: false }
        }),
        reset: $resource('/apiGloballyShared/requestPasswordReset', {}, {
            query: { method: 'POST', isArray: false }
        }),
        professions: $resource('apiGloballyShared/accountActivation/professions', {}, {
            query: { method: 'GET', isArray: true }
        }),
        specialGroups: $resource('apiGloballyShared/accountActivation/specialGroups/:profession', {}, {
            query: { method: 'GET', isArray: true }
        }),
        counties: $resource('apiGloballyShared/accountActivation/counties', {}, {
            query: { method: 'GET', isArray: false }
        }),
        cities: $resource('apiGloballyShared/accountActivation/cities', {}, {
            query: { method: 'GET', isArray: false }
        }),
        createAccount: function (thiz, callback) {
            console.log(thiz);
            validateCreate(thiz, function (err) {
                if(err){
                    callback(err);
                }else{
                    validateUpdate(thiz, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            getActivationData(thiz, function (activationData) {
                                createAccount.save({user: thiz.user, activation: activationData}).$promise.then(function (resp) {
                                    if(resp.error){
                                        callback(resp.message);
                                    }else{
                                        callback(null, resp);
                                    }
                                })
                            });
                        }
                    });
                }
            });
        },
        completeProfile: function (thiz, callback) {
            console.log(thiz);
            validateUpdate(thiz, function (err) {
                if(err){
                    callback(err);
                }else{
                    getActivationData(thiz, function (activationData) {
                        completeProfile.save({user: thiz.user, activation: activationData}).$promise.then(function (resp) {
                            callback(null, resp);
                        });
                    });
                }
            });
        }
    }
}]);