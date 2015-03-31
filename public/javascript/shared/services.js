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
        show: function (title, message, action, actionName, reloadState) {
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
                    actionName: function () {
                        return actionName;
                    },
                    reloadState: function () {
                        return reloadState;
                    }
                }
            });
        }
    }
}]);
services.factory('Utils', function () {
    return{
        fileToBase64: function (file, callback) {
            var reader = new FileReader();
            reader.onloadend = function(event){
                var f = event.target.result;
                callback(f.split("base64,")[1]);
            };
            reader.readAsDataURL(file);
        }
    }
});