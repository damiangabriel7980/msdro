/**
 * Created by miricaandrei23 on 25.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
controllers.controller('Articles', ['$scope','$rootScope', '$state', 'ContentService','GroupsService','$stateParams','$sce','ngTableParams','$filter', '$modal', 'ActionModal', 'Success', 'Error', function($scope, $rootScope, $state, ContentService, GroupsService, $stateParams,$sce,ngTableParams,$filter,$modal,ActionModal, Success, Error){
    ContentService.content.query().$promise.then(function(result){
        var contents = Success.getObject(result);
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
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });

    GroupsService.groups.query().$promise.then(function(resp){
        $scope.grupe = Success.getObject(resp);
        $scope.groupMap={};
        for(var i =0;i<$scope.grupe.length;i++)
            $scope.groupMap[$scope.grupe[i]._id]=$scope.grupe[i].display_name;
    }).catch(function(err){
        console.log(Error.getMessage(err.data));
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.addArticle = function () {
        $modal.open({
            templateUrl: 'partials/admin/content/articles/articlesAdd.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"AddArticles"
        });
    };

    $scope.deleteArticle = function (id) {
        ActionModal.show("Stergere articol", "Sunteti sigur ca doriti sa stergeti articolul?", function () {
            ContentService.content.delete({id: id}).$promise.then(function (resp) {
                console.log(resp);
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err.data));
            });
        }, "Sterge");
    };

    $scope.updateArticle = function (id) {
        $modal.open({
            templateUrl: 'partials/admin/content/articles/articlesUpdate.ejs',
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'fade',
            controller:"EditArticles",
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
                ContentService.content.update({id: id}, {enableArticle: {enable: !isEnabled}}).$promise.then(function (resp) {
                    console.log(resp);
                    $state.reload();
                }).catch(function(err){
                    console.log(Error.getMessage(err.data));
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
