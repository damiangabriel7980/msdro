/**
 * Created by miricaandrei23 on 25.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('articlesCtrl', ['$scope','$rootScope', '$state', 'ContentService','$stateParams','$sce','ngTableParams','$filter', '$modal', 'ActionModal', function($scope, $rootScope, $state, ContentService,$stateParams,$sce,ngTableParams,$filter,$modal,ActionModal){
    ContentService.getAll.query().$promise.then(function(result){
        var contents = result['content'];
        $scope.grupe=result['groups'];
        $scope.groupMap={};
        for(var i =0;i<$scope.grupe.length;i++)
            $scope.groupMap[$scope.grupe[i]._id]=$scope.grupe[i].display_name;
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
               title: 'asc'     // initial sorting
            },
            filter: {
                title: ''       // initial filter
            }
        }, {
            total: contents.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(contents, params.filter())), params.orderBy());

                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.addArticle = function () {
        $modal.open({
            templateUrl: 'partials/admin/continut/articoleAdd.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"articlesAddCtrl"
        });
    };

    $scope.deleteArticle = function (id) {
        ActionModal.show("Stergere articol", "Sunteti sigur ca doriti sa stergeti articolul?", function () {
            ContentService.deleteOrUpdateContent.delete({id: id}).$promise.then(function (resp) {
                console.log(resp);
                $state.reload();
            });
        }, "Sterge");
    };

    $scope.updateArticle = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/continut/articoleUpdate.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"articlesUpdateCtrl",
            resolve: {
                idToEdit: function () {
                    return id;
                }
            }
        })
    };

    $scope.toggleArticle = function(id, isEnabled){
        ActionModal.show(
            isEnabled?"Dezactiveaza articol":"Activeaza articol",
            isEnabled?"Sunteti sigur ca doriti sa dezactivati articolul?":"Sunteti sigur ca doriti sa activati articolul?",
            function () {
                ContentService.deleteOrUpdateContent.update({id: id}, {enable: !isEnabled}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.reload();
                });
            },
            "Da"
        );
    }

}])
    .filter('htmlToPlaintext', function() {
        return function(text) {
            return String(text).replace(/<[^>]+>/gm, '').replace(/&nbsp;/g,' ');
        }
    });
