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
        //reloadState defaults to true
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