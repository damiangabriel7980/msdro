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

services.factory('PublicService', function () {
    return {
        getSref: function (content) {
            switch(content.type){
                case 1: return 'stiri.detail'; break;
                case 2: return 'articole.detail'; break;
                case 3: return 'elearning.detail'; break;
                case 4: return 'downloads.detail'; break;
                default: return ''; break;
            }
        }
    }
});

services.factory('RootService', ['$resource', function ($resource) {
    return {
        categories: $resource('apiPublic/categories', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);

services.factory('HomeService', ['$resource', function($resource){
    return {
        CarouselData: $resource('apiPublic/getCarouselData/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        searchResults: $resource('apiPublic/publicSearch', {}, {
            query: { method: 'GET', isArray: false }
        }),
        events: $resource('apiPublic/events', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);
services.factory('ContentService', ['$resource', function($resource){
    return {
        content: $resource('apiPublic/content', {}, {
            query: { method: 'GET', isArray: false },
            update: { method: 'PUT', isArray: false }
        }),
        mobileContent: $resource('apiPublic/mobileContent', {}, {
            query: { method: 'GET', isArray: false }
        }),
        mostRead: $resource('apiPublic/mostRead', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);
services.factory('AuthService', ['$resource', 'Utils', 'Error', 'Success', function($resource, Utils, Error, Success){
    var getFormData = function (thiz) {
        var temp = thiz.user.temp;
        temp.proofType = 'code';
        var data = {
            user: thiz.user || {},
            nonUser: thiz.nonUser || {},
            county: thiz.selectedCounty,
            city: thiz.selectedCity
        };
        data = JSON.parse(JSON.stringify(data));
        data.user.temp = temp;
        return data;
    };
    var isProofRequired = function(email){
        email = email || "";
        if(email.split("@")[1] === NO_PROOF_DOMAIN){
            return false;
        }else{
            return true;
        }
    };
    var validateCreate = function (formData, callback) {
        if(!formData.user.username){
            callback("Va rugam introduceti un email");
        }else if(!formData.user.name){
            callback("Va rugam introduceti un nume");
        }else if(!formData.user.title){
            callback("Va rugam selectati un titlu");
        }else if(!formData.user.password){
            callback("Va rugam introduceti o parola");
        }else if(!formData.nonUser.confirm){
            callback("Va rugam confirmati parola");
        }else if(formData.user.password != formData.nonUser.confirm) {
            callback("Parolele nu corespund");
        }else{
            callback(null);
        }
    };
    var validateUpdate = function (formData, options, callback) {
        var user = formData.user;
        var county = formData.county._id;
        var city = formData.city._id;

        var proofRequired = isProofRequired(user.username);

        if(!user.profession){
            callback("Va rugam selectati o profesie");
        }else if(!(user.temp.proofType === 'code' || user.temp.proofType === 'file')){
            callback("Trebuie sa incarcati o dovada sau sa introduceti un cod");
        }else if(proofRequired && user.temp.proofType == "code" && !user.temp.activationCode){
            callback("Va rugam introduceti codul de activare");
        }else if(proofRequired && user.temp.proofType == "file" && !user.temp.proofFile){
            callback("Va rugam incarcati dovada");
        }else if(!user.groupsID && options.groupRequired){
            callback("Va rugam selectati un grup preferat");
        }else if(!user.specialty){
            callback("Va rugam selectati o specializare");
        }else if(!user.address){
            callback("Va rugam introduceti o adresa");
        }else if(!county){
            callback("Va rugam introduceti un judet");
        }else if(!city){
            callback("Va rugam introduceti un oras");
        }else if(!formData.nonUser.termsStaywell){
            callback("Trebuie sa acceptati termenii si conditiile Staywell pentru a continua");
        }else if(!formData.nonUser.termsMSD){
            callback("Trebuie sa acceptati politica MSD privind datele profesionale pentru a continua");
        }else{

            //format data according to database model
            formData.user.citiesID = [city];
            formData.user.groupsID = [user.groupsID];

            callback();
        }
    };
    var getActivationData = function (formData, callback) {
        var proofRequired = isProofRequired(formData.user.username);
        if(!proofRequired){
            callback();
        }else{
            var activation = {
                type: formData.user.temp.proofType,
                value: null
            };

            if(formData.user.temp.proofType === "file"){
                var extension = formData.user.temp.proofFile.name.split('.').pop();
                Utils.fileToBase64(formData.user.temp.proofFile, function (b64) {
                    activation.value = {
                        file: b64,
                        extension: extension
                    };
                    callback(activation);
                });
            }else{
                activation.value = formData.user.temp.activationCode;
                callback(activation);
            }
        }
        
    };
    var getProHref = function () {
        var href = "pro";
        if(REDIRECT_AFTER_LOGIN) href+= "#"+HASH_PREFIX+REDIRECT_AFTER_LOGIN;
        return href;
    };
    var completeProfile = $resource('apiGloballyShared/completeProfile', {}, {
        save: {method:'POST'}
    });
    var createAccount = $resource('/apiGloballyShared/createAccountStaywell', {}, {
        save: { method: 'POST', isArray: false }
    });
    var getDefaultOptions = function(thiz){
        var options = {};
        if(!thiz.groups || thiz.groups.length == 0){
            options.groupRequired = false;
        }else{
            options.groupRequired = true;
        }
        return options;
    }
    var isUserAllowedLogin = function(username){
        if(USERS_ALLOWED_LOGIN){
            username=(username||"").toLowerCase();
            var users = USERS_ALLOWED_LOGIN.split(",");
            for(var i=0; i<users.length; i++){
                if(users[i].toLowerCase() === username){
                    return true;
                }
            }
            return false;
        }else{
            return true;
        }
    }
    return {
        login: $resource('/login', {}, {
            query: { method: 'POST', isArray: false }
        }),
        reset: $resource('/apiGloballyShared/requestPasswordReset', {}, {
            query: { method: 'POST', isArray: false }
        }),
        professions: $resource('apiGloballyShared/accountActivation/professions', {}, {
            query: { method: 'GET', isArray: false }
        }),
        signupGroups: $resource('apiGloballyShared/accountActivation/signupGroups/:profession', {}, {
            query: { method: 'GET', isArray: false }
        }),
        counties: $resource('apiGloballyShared/accountActivation/counties', {}, {
            query: { method: 'GET', isArray: false }
        }),
        cities: $resource('apiGloballyShared/accountActivation/cities', {}, {
            query: { method: 'GET', isArray: false }
        }),
        specialty: $resource('apiGloballyShared/accountActivation/specialty',{},{
            query: { method: 'GET', isArray: false }

        }),
        createAccount: function (thiz, callback) {
            var formData = getFormData(thiz);
            var options = getDefaultOptions(thiz);
            validateCreate(formData, function (err) {
                if(err){
                    callback(err);
                }else{
                    validateUpdate(formData, options, function (err) {
                        if(err){
                            callback(err);
                        }else{
                            getActivationData(formData, function (activationData) {
                                createAccount.save({user: formData.user, activation: activationData}).$promise.then(function (resp) {
                                    callback(null, Success.getObject(resp));
                                }).catch(function (resp) {
                                    callback(Error.getMessage(resp));
                                });
                            });
                        }
                    });
                }
            });
        },
        completeProfile: function (thiz, callback) {
            var formData = getFormData(thiz);
            var options = getDefaultOptions(thiz);
            validateUpdate(formData, options, function (err) {
                if(err){
                    callback(err);
                }else{
                    getActivationData(formData, function (activationData) {
                        completeProfile.save({user: formData.user, activation: activationData}).$promise.then(function (resp) {
                            callback(null, Success.getObject(resp));
                        }).catch(function (resp) {
                            callback(Error.getMessage(resp));
                        });
                    });
                }
            });
        },
        getProHref: getProHref,
        isProofRequired: isProofRequired,
        isUserAllowedLogin: isUserAllowedLogin
    }
}]);