services.factory('InfoModal', ['$modal', function($modal){
    return {
        show: function (title, message) {
            $modal.open({
                templateUrl: 'partials/shared/infoModal.html',
                size: 'md',
                windowClass: 'fade',
                controller: 'InfoModal',
                resolve:{
                    title: function () {
                        return title;
                    },
                    message: function () {
                        return message;
                    }
                }
            });
        }
    }
}]);
services.factory('ActionModal', ['$modal', function($modal){
    return {
        //actionName defaults to "Ok"
        //reloadState defaults to false
        show: function (title, message, action, options) {
            options = options || {};
            $modal.open({
                templateUrl: 'partials/shared/actionModal.html',
                size: 'md',
                windowClass: 'fade',
                controller: 'ActionModal',
                resolve:{
                    title: function () {
                        return title;
                    },
                    message: function () {
                        return message;
                    },
                    action: function () {
                        return action;
                    },
                    options: function () {
                        return options;
                    }
                }
            });
        }
    }
}]);
services.factory('Utils', ['$sce', function ($sce) {
    var trustAsHtml = function (data) {
        return $sce.trustAsHtml(data);
    };
    var htmlToPlainText = function(text) {
        return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
    };
    var convertAndTrustAsHtml = function (data) {
        return $sce.trustAsHtml(htmlToPlainText(data));
    };
    var trimText = function (text, length) {
        if(typeof text === "string"){
            if(text.length > length){
                //TODO: convert special characters before substring
                return trustAsHtml(htmlToPlainText(text).substring(0, length) + "...");
            }else{
                return trustAsHtml(htmlToPlainText(text));
            }
        }else{
            return "";
        }
    };
    var trimWords = function (text, wordsCount) {
        if(typeof text === "string"){
            return text.split(" ").slice(0, wordsCount).join(" ") + "...";
        }
    };
    var createHeader = function (text,length) {
        var textLength = text?text.length:0;
        if(textLength > length){
            var trimmed = htmlToPlainText(text).substring(0,length);
            var i = trimmed.length;
            while(trimmed[i]!=' ' && i>0) i--;
            trimmed = trimmed.substr(0, i);
            if(trimmed.length > 0) trimmed = trimmed+"...";
            return trimmed;
        }else{
            return htmlToPlainText(text);
        }
    };
	var isEmptyObject = function(obj){
        for(var key in obj) {
            console.log(obj);
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
    var objectHasAllProperties = function (obj, properties) {
        for(var i=0; i<properties.length; i++){
            if(!obj[properties[i]]) return false;
        }
        return true;
    };
    var getMonthsArray = function (long) {
        var monthsShort = ["IAN","FEB","MAR","APR","MAI","IUN","IUL","AUG","SEP","OCT","NOI","DEC"];
        var monthsLong = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
            "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
        return long?monthsLong:monthsShort;
    };
    var customDateFormat = function(input, options){
        try{
            if(typeof input === "string") input = new Date(input);
            options = options || {};
            var day = input.getDate();
            var month = input.getMonth()+1;
            var year = input.getFullYear();
            if(options.hideYear) year = "";
            if(options.monthFormat){
                if(options.monthFormat === "long"){
                    month = getMonthsArray(true)[month-1];
                }
                if(options.monthFormat === "short"){
                    month = getMonthsArray()[month-1];
                }
            }else{
                if(options.prefixZero){
                    if(day<10) day = "0"+day;
                    if(month<10) month = "0"+month;
                }
            }
            var separator = options.separator || "/";
            var ret;
            if(options.reverse){
                ret = (options.hideYear?"":year+separator)+month+separator+day;
            }else{
                ret = day+separator+month+(options.hideYear?"":separator+year);
            }
            return ret;
        }catch(ex){
            return input;
        }
    };
    var capitalizeFirstLetter = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    var bindAccordionToCollection = function (collection, propertyObject) {
        var propertyName = Object.keys(propertyObject)[0];
        angular.forEach(collection, function (value, key) {
            collection[key][propertyName] = propertyObject[propertyName];
        });
        return collection;
    };
    var toggleAccordionBindedToArray = function (collection, keyForToggle, idToSearch) {
        angular.forEach(collection, function (item, key) {
            if(idToSearch === item._id){
                collection[key][keyForToggle] = true;
            }
        });
        return true;
    };
    return{
        fileToBase64: function (file, callback) {
            var reader = new FileReader();
            reader.onloadend = function(event){
                var f = event.target.result;
                callback(f.split("base64,")[1]);
            };
            reader.readAsDataURL(file);
        },
        isMobile: function (strict, byUserAgent) {
//            var check = false;
//            var a = navigator.userAgent || navigator.vendor || window.opera;
//            if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check=true;
//            return check;
            if(byUserAgent){
                //============ set detection variables
                var mobileObject = {};
                var standalone = window.navigator.standalone,
                    userAgent = window.navigator.userAgent.toLowerCase(),
                    safari = /safari/.test( userAgent ),
                    ios = /iphone|ipod|ipad/.test( userAgent );

                //============ check for generic device
                var isIphone = false;
                mobileObject['isIOSDevice'] = ios;
                mobileObject['isAndroidDevice'] = userAgent.indexOf("android") > -1;
                if(ios)
                {
                    if ( !standalone && safari ) {
                        isIphone = true;
                    }
                }

                //==================detect Tablets
                mobileObject['isIpad'] = /ipad/.test( userAgent );
                var isAndroidTablet = function(){
                    var ua = navigator.userAgent.toLowerCase();
                    return (ua.indexOf("android") > -1 && ua.indexOf("mobile")==-1);
                };
                mobileObject['isAndroidTab'] = isAndroidTablet();
                mobileObject['isIphone'] = isIphone;

                //================== detect if it's any kind of device
                mobileObject['any'] = mobileObject['isIOSDevice'] || mobileObject['isAndroidDevice'];
                return mobileObject;
            }
            else{
                if(strict){
                    return window.innerWidth < 768;
                }else{
                    return window.innerWidth < 992;
                }
            }
        },
        bindAccordionToCollection : bindAccordionToCollection,
        toggleAccordionBindedToArray : toggleAccordionBindedToArray,
        getMonthsArray: getMonthsArray,
        customDateFormat : customDateFormat,
        trustAsHtml: trustAsHtml,
        htmlToPlainText: htmlToPlainText,
        convertAndTrustAsHtml: convertAndTrustAsHtml,
        trimText: trimText,
        trimWords: trimWords,
        createHeader: createHeader,
        isEmptyObject:isEmptyObject,
		objectHasAllProperties: objectHasAllProperties,
        capitalizeFirstLetter: capitalizeFirstLetter
    }
}]);
services.factory('Diacritics',function(){
    return{
        diacriticsToHtml : function(input){
              var text = String(input)
                .replace(/Ă/g,'&#258;')
                .replace(/ă/g,'&#259;')
                .replace(/Â/g,'&Acirc;')
                .replace(/â/g,'&acirc;')
                .replace(/Î/g,'&Icirc;')
                .replace(/î/g,'&icirc;')
                .replace(/Ș/g,'&#x218;')
                .replace(/ș/g,'&#x219;')
                .replace(/Ş/g,'&#350;')
                .replace(/ş/g,'&#351;')
                .replace(/Ț/g,'&#538;')
                .replace(/ț/g,'&#539;')
                .replace(/Ţ/g,'&#354;')
                .replace(/ţ/g,'&#355;');
            return text;
        }
    }
});
services.factory('PrintService',function(){
   return{
       printWindow : function(){
           return window.print();
       }
   }
});
services.factory('CollectionsService', function () {
    return {
        findById: function (id, collection) {
            var i=0;
            try{
                while(i<collection.length){
                    if(collection[i]._id == id){
                        return collection[i];
                    }
                    i++;
                }
                return null;
            }catch(ex){
                return null;
            }
        }
    }
});
services.factory('therapeuticAreas', ['$resource', function($resource){
    var indentChildren = function (areas, forDropdown) {
        var areasOrganised = [];
        if(forDropdown){
            areasOrganised.push({_id:0, name:"Adauga arii terapeutice"});
            areasOrganised.push({_id:1, name:"Toate"});
        }else{
            areasOrganised.push({_id:0, name:"Toate", has_children:false});
        }
        for(var i=0; i<areas.length; i++){
            var thisArea = areas[i];
            if((thisArea['therapeutic-areasID'] || []).length == 0){
                //it's a parent. Add it
                areasOrganised.push(thisArea);
                //find all it's children
                for(var j=0; j < areas.length; j++){
                    if((areas[j]['therapeutic-areasID'] || []).indexOf(thisArea._id)>-1){
                        //found one children. Add it
                        areas[j]['ident']=true;
                        areasOrganised.push(areas[j]);
                    }
                }
            }
        }
        return areasOrganised;
    };
    var organiseByParent = function (areas) {
        var areasOrganised = [];
        //areasOrganised.push({_id:0, name:"Toate", has_children:false});
        for(var i=0; i<areas.length; i++){
            var thisArea = areas[i];
            if((thisArea['therapeutic-areasID'] || []).length == 0){
                //it's a parent. Add it
                areasOrganised.push(thisArea);
                //find all it's children
                thisArea.children = [];
                for(var j=0; j < areas.length; j++){
                    if((areas[j]['therapeutic-areasID'] || []).indexOf(thisArea._id)>-1){
                        //found one children. Add it
                        thisArea.children.push(areas[j]);
                    }
                }
            }
        }
        return areasOrganised;
    };
    return {
        areas: $resource('apiPublic/therapeuticAreas/', {}, {
            query: { method: 'GET', isArray: false }
        }),
        formatAreas: indentChildren,
        organiseByParent: organiseByParent
    }
}]);
services.factory('Validations', ['$resource', function($resource){
    return {
        regexp: $resource('api/regexp/', {}, {
            query: { method: 'GET', isArray: false }
        })
    }
}]);
services.factory('CookiesService', function () {
    return {
        setCookie: function(cname, cvalue, expires) {
            var now = new Date();
            // this will set the expiration to 6 months by default
            if(!expires) expires = new Date(now.getFullYear(), now.getMonth()+6, now.getDate());
            expires = "expires="+expires.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        },
        getCookie: function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
            }
            return "";
        },
        deleteCookie: function(name) {
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }
    }
});
services.factory('StorageService', function () {
    var getLocalStorageElement = function (elem) {
        try{
            if(localStorage[elem]){
                return JSON.parse(localStorage[elem]);
            }else{
                return null;
            }
        }catch(ex){
            //console.log("At get from local storage:");
            //console.log(ex);
            return localStorage[elem];
        }
    };
    var setLocalStorageElement = function (elem, value) {
        try{
            localStorage[elem] = JSON.stringify(value);
        }catch(ex){
            //console.log("At add to local storage:");
            //console.log(ex);
            localStorage[elem] = value;
        }
    };
    var removeLocalStorageElement = function (elem) {
        localStorage[elem] = null;
    };
    return {
        local: {
            getElement: getLocalStorageElement,
            setElement: setLocalStorageElement,
            removeElement: removeLocalStorageElement
        }
    }
});
services.factory('Error', function() {
    return {
        getMessage: function(serverResponse) {
            return serverResponse.data.error;
        },
        getData: function (serverResponse) {
            return serverResponse.data.data;
        }
    }
});
services.factory('Success', function() {
    return {
        getMessage: function(serverResponse) {
            return serverResponse.message;
        },
        getObject: function(serverResponse) {
            return serverResponse.success;
        }
    }
});
services.factory('customOrder', function() {
    return {
        sortAscending: function(items, field) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field].toLowerCase() > b[field].toLowerCase() ? 1 : -1);
            });
            return filtered;
        },
        sortNumbers: function(items, field) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            return filtered;
        }
    }
});
services.factory('exportCSV', [function(){
    var formatArrayCSV = function(arrayOfObjects, arrayOfProperties, arrayOfPropertiesToStringify, arrayOfPropertyObjectsToAccess){
        var arrayToReturn = [];
        angular.forEach(arrayOfObjects, function(arrayItem, keyOfItem){
            var objToPush = {};
            angular.forEach(arrayOfProperties, function(property, keyOfProp){
                objToPush[property] = arrayItem[property] ? arrayItem[property] : ' ';
            });
            if(arrayOfPropertyObjectsToAccess){
                angular.forEach(arrayOfPropertyObjectsToAccess, function(item, key){
                    var propertyName = Object.keys(item)[0];
                    var propertyValue = item[propertyName];
                    if(propertyName.indexOf('.') > -1){
                        var splitStringProp = propertyName.split('.');
                        objToPush[splitStringProp[1]] = arrayItem[splitStringProp[0]] ? arrayItem[splitStringProp[0]][[splitStringProp[1]]] ? arrayItem[splitStringProp[0]][[splitStringProp[1]]][propertyValue] : ' ' : ' ';
                    } else {
                        objToPush[propertyName] = arrayItem[propertyName] ? arrayItem[propertyName][propertyValue] : ' ';
                    }
                })
            }
            if(arrayOfPropertiesToStringify){
                angular.forEach(arrayOfPropertiesToStringify, function(property, keyOfProp){
                    var stringToReturn = '';
                    var propertyName = Object.keys(property)[0];
                    var propertyValue = property[propertyName];
                    if(arrayItem[propertyName]){
                        angular.forEach(arrayItem[propertyName], function(item, key){
                            var comma;
                            if(key == arrayItem[propertyName].length - 1){
                                comma = '';
                            } else {
                                comma = ', ';
                            }
                            stringToReturn = stringToReturn + item[propertyValue] + comma;
                        })
                    }
                    objToPush[propertyName] = stringToReturn;
                });
            }
            arrayToReturn.push(objToPush);
        });
        return arrayToReturn;
    };

    return {
        formatArrayCSV: formatArrayCSV
    }
}]);