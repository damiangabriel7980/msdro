/**
 * Created by Administrator on 15/09/15.
 */
controllers.controller('Courses', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error) {


    ElearningService.courses.query().$promise.then(function(result){
        $scope.courses = Success.getObject(result);
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.deleteCourse = function (id) {
        ActionModal.show("Stergere curs", "Sunteti sigur ca doriti sa stergeti acest curs?", function () {
            ElearningService.courses.delete({id: id}).$promise.then(function(result){
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.deleteChapter = function (id) {
        ActionModal.show("Stergere capitol", "Sunteti sigur ca doriti sa stergeti acest capitol?", function () {
            ElearningService.chapters.delete({id: id}).$promise.then(function(result){
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.addCourse = function(){
        $scope.course = {
            order: 1,
            last_updated: new Date(),
            date_created: new Date(),
            listChapters: [],
            groupsID: [],
            duration: 1,
            title: 'New Course',
            description: ''
        };
        ElearningService.courses.create({course: $scope.course}).$promise.then(function(resp){
            $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.addChapter = function(id){
        $scope.chapter = {
            order: 1,
            last_updated: new Date(),
            date_created: new Date(),
            listSubchapters: [],
            duration: 1,
            title: 'New Chapter',
            description: ''
        };
        ElearningService.chapters.create({courseId: id,chapter: $scope.chapter}).$promise.then(function(resp){
            $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.addSubChapter = function(id){
        $scope.subChapter = {
            order: 1,
            last_updated: new Date(),
            date_created: new Date(),
            listSlides: [],
            duration: 1,
            title: 'New SubChapter',
            description: ''
        };
        ElearningService.subchapters.create({chapterId: id, subChapter: $scope.subChapter}).$promise.then(function(resp){
            $state.go('elearning.courses',{},{reload: true});
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };


    $scope.addSlide = function(id){
        $scope.slide = {
            content: '',
            last_updated: new Date(),
            date_created: new Date(),
            order: 0,
            type: 'slide',
            questions: [],
            title: 'New Slide',
            retake: 1
        };
        ElearningService.slides.create({id: id, slide: $scope.slide}).$promise.then(function(result){
            $state.reload();
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.deleteSubChapter = function (id) {
        ActionModal.show("Stergere sub-capitol", "Sunteti sigur ca doriti sa stergeti acest sub-capitol?", function () {
            ElearningService.subchapters.delete({id: id}).$promise.then(function(result){
                $state.reload();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };
}]);