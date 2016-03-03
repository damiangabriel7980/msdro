controllers.controller('ManageAccounts', ['$scope','ManageAccountsService', '$modal', '$state','$filter', 'ngTableParams', 'ActionModal', 'Success', 'Error', 'Utils', function($scope, ManageAccountsService, $modal, $state,$filter,ngTableParams, ActionModal,Success,Error, Utils){

    $scope.csv = {
        filename: "Users_Staywell_" + Utils.customDateFormat(new Date(), {separator:'-'}) + '.csv',
        rows: []
    };

    $scope.getHeader = function () {
        return ['Name', 'Username','Arii_terapeutice', 'Profesie', 'Telefon', 'Url_imagine', 'Grupuri', 'Conferinte']
    };

    function formatArrayCSV(users){
        var ret = [];
        angular.forEach(users, function(value, key){
            var confString = '', therapString = '', groupsStr = '';
            if(value.conferencesID && value.conferencesID.length > 0){
                angular.forEach(value.conferencesID, function(item, key){
                    var comma;
                    if(key == value.conferencesID.length - 1){
                        comma = '';
                    } else {
                        comma = ', ';
                    }
                    confString = confString + item.title + comma;
                })
            }
            if(value['therapeutic-areasID'].length > 0){
                angular.forEach(value['therapeutic-areasID'], function(item, key){
                    var comma;
                    if(key == value['therapeutic-areasID'].length - 1){
                        comma = '';
                    } else {
                        comma = ', ';
                    }
                    therapString = therapString + item.name + comma;
                })
            }
            if(value.groupsID.length > 0){
                angular.forEach(value.groupsID, function(item, key){
                    var comma;
                    if(key == value.groupsID.length - 1){
                        comma = '';
                    } else {
                        comma = ', ';
                    }
                    groupsStr = groupsStr + item.display_name + comma;
                })
            }
            var objToPush = {
                "name" : value.name? value.name : ' ',
                "Username": value.username,
                "Arii_terapeutice": therapString ? therapString : ' ',
                "Profesie": value.profession ? value.profession.display_name : ' ',
                "Telefon" : value.phone ? value.phone : ' ',
                'Url_imagine': value.image_path ? value.image_path : ' ',
                "Grupuri" : groupsStr,
                "Conferinte" : confString
            };
            ret.push(objToPush);
        });
        return ret;
    };

    ManageAccountsService.users.query().$promise.then(function (resp) {
        var data = Success.getObject(resp);
        $scope.csv.rows = formatArrayCSV(data);
        $scope.tableParams = new ngTableParams({
            page: 1,            // show first page
            count: 10,          // count per page
            sorting: {
                username: 'asc'     // initial sorting
            },
            filter: {
                username: ''       // initial filter
            }
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {

                var orderedData = $filter('orderBy')(($filter('filter')(data, params.filter())), params.orderBy());
                $scope.resultData = orderedData;
                params.total(orderedData.length);
                if(params.total() < (params.page() -1) * params.count()){
                    params.page(1);
                }
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
    });

    $scope.selectedItems = new Set();

    $scope.addToSelectedItems = function(id){
        if($scope.selectedItems.has(id)){
            $scope.selectedItems.delete(id)
        } else {
            $scope.selectedItems.add(id);
        }
    };
    $scope.checkValue = function(id){
        if($scope.selectedItems.has(id)) {
            return true;
        } else {
            return false;
        }
    };

    $scope.viewUser= function(id){
        $modal.open({
            templateUrl: 'partials/admin/users/viewAccount.html',
            size: 'lg',
            windowClass: 'fade',
            controller: 'ViewAccount',
            resolve: {
                idToView: function () {
                    return id;
                }
            }
        });
    };
    $scope.toggleUser= function(id,enabledUser){
        ActionModal.show(
            enabledUser?"Dezactiveaza cont":"Activeaza cont",
            enabledUser?"Sunteti sigur ca doriti sa dezactivati contul?":"Sunteti sigur ca doriti sa activati contul?",
            function () {
                ManageAccountsService.users.update({id: id}, {enabled: !enabledUser}).$promise.then(function (resp) {
                    $state.reload();
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            },{
                yes: "Da"
            }
        );
    }
}]);