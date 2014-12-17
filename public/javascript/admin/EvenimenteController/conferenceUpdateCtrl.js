/**
 * Created by miricaandrei23 on 26.11.2014.
 */
/**
 * Created by miricaandrei23 on 25.11.2014.
 */
cloudAdminControllers.controller('conferenceUpdateCtrl', ['$scope','$rootScope' ,'EventsAdminService','$stateParams','$sce','$filter','$state','ngTableParams','growl', function($scope,$rootScope,EventsAdminService,$stateParams,$sce,$filter,$state,ngTableParams,growl){


    EventsAdminService.getAllTalks.query().$promise.then(function(resp){
        $scope.talks=resp;
        EventsAdminService.deleteOrUpdateConferences.getConference({id:$stateParams.id}).$promise.then(function(result2){

            $scope.newConference=result2;
            $scope.string=JSON.stringify($scope.newConference.qr_code);
            tinyMCE.activeEditor.setContent($scope.newConference.description);
            $scope.groupTalks=[];
            console.log(result2);
            $scope.newString=$scope.newConference.qr_code.message;
            var listtalks = $scope.newConference.listTalks;
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
                total: listtalks.length, // length of data
                getData: function($defer, params) {

                    var orderedData = $filter('orderBy')(($filter('filter')(listtalks, params.filter())), params.orderBy());

                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                }
            });
            for(var i=0;i<$scope.talks.length;i++)
            {
                for(var j=0;j<$scope.newConference.listTalks.length;j++)
                {
                    if($scope.talks[i]._id==$scope.newConference.listTalks[j]._id)
                        $scope.groupTalks.push($scope.talks[i]);
                }
            }
            $scope.selectedTalk=$scope.talks[0];
        });


    });
    $scope.newString="";
    $scope.messageString="";


    var findTalk = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.groupTalks.length){
            if($scope.groupTalks[i]._id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };
    $scope.TalkWasSelected = function (sel) {
        if(sel._id!=0){

            var index = findTalk(sel._id);
            if(index==-1) $scope.groupTalks.push(sel);

        }
    };

    $scope.removeTalk = function (id) {
        var index = findTalk(id);
        if(index>-1){
            $scope.groupTalks.splice(index,1);
        }
    };
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];
    $scope.open1 = function($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened1 = true;
    };
    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.updateConference=function(){
        var id_talks=[];
        for(var i=0;i<$scope.groupTalks.length;i++)
            id_talks.push($scope.groupTalks[i]._id);
        $scope.newConference.listTalks=id_talks;
        $scope.newConference.description=tinyMCE.activeEditor.getContent();
        console.log($scope.newConference);
        if($scope.newConference){
            EventsAdminService.deleteOrUpdateConferences.update({id: $stateParams.id}, $scope.newConference).$promise.then(function(result){
                if(result.message)
                    growl.addSuccessMessage(result.message);
                else
                    growl.addWarnMessage(result);
            });
        }
    };

    $scope.okk=function(){
        $state.go('continut.evenimente');
    }
    $scope.tinymceOptions = {
        selector: "textarea",
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste"
        ],
        toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image"
    };

}])
    .filter("asDate", function () {
        return function (input) {
            return new Date(input);
        }
    });

