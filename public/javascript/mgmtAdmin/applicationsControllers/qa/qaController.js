controllers.controller('qaController', ['$scope', '$rootScope', '$filter', 'ngTableParams' ,'qaService', '$modal', function($scope, $rootScope, $filter, ngTableParams, qaService, $modal){

    $scope.loadTopics = function () {
        qaService.topics.query().$promise.then(function (resp) {
            var data = resp;

            $scope.tableParamsTopics = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    name: 'asc'     // initial sorting
                },
                filter: {
                    name: ''       // initial filter
                }
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };

    $scope.loadAnswerGivers = function () {
        qaService.answerGivers.query().$promise.then(function (resp) {
            var data = resp;

            $scope.tableParamsAnswerGivers = new ngTableParams({
                page: 1,            // show first page
                count: 10,          // count per page
                sorting: {
                    nickname: 'asc'     // initial sorting
                },
                filter: {
                    nickname: ''       // initial filter
                }
            }, {
                total: data.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
        });
    };

    $scope.loadTopics();
    $scope.loadAnswerGivers();

    $scope.addTopic = function(){
        $modal.open({
            templateUrl: 'partials/admin/applications/qa/modalAddTopic.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddTopicController'
        });
    };

    $scope.deleteTopic = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/applications/qa/modalDeleteTopic.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'DeleteTopicController',
            resolve: {
                idToDelete: function () {
                    return id;
                }
            }
        });
    };

    $scope.editTopic = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/applications/qa/modalEditTopic.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditTopicController',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };

    $scope.addAnswerGiver = function(){
        $modal.open({
            templateUrl: 'partials/admin/applications/qa/modalAddAnswerGiver.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'AddAnswerGiverController'
        });
    };

    $scope.editAnswerGiver = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/applications/qa/modalEditAnswerGiver.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'EditAnswerGiverController',
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        });
    };

    $scope.deleteAnswerGiver = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/applications/qa/modalDeleteAnswerGiver.html',
            size: 'sm',
            windowClass: 'fade',
            controller: 'DeleteAnswerGiverController',
            resolve: {
                idToDelete: function () {
                    return id;
                }
            }
        });
    };


}]);