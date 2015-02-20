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