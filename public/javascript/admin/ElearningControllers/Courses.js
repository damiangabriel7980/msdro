/**
 * Created by Administrator on 15/09/15.
 */
controllers.controller('Courses', ['$scope', '$rootScope', '$state', '$stateParams', 'ElearningService', 'AmazonService', '$modal', 'InfoModal', 'ActionModal', 'Success', 'Error', 'customOrder', function ($scope, $rootScope, $state, $stateParams, ElearningService, AmazonService, $modal, InfoModal, ActionModal, Success, Error, customOrder) {

    $scope.getCourses = function(){
        ElearningService.courses.query().$promise.then(function(result){
            $scope.courses = Success.getObject(result);
            //sort Courses
            for(var i = 0; i < $scope.courses.length; i++){
                for( var j=0; j< $scope.courses[i].listChapters.length; j++){
                    for( var k=0; k< $scope.courses[i].listChapters[j].listSubchapters.length; k++){
                        $scope.courses[i].listChapters[j].listSubchapters[k].listSlides = customOrder.sortNumbers($scope.courses[i].listChapters[j].listSubchapters[k].listSlides,'order');
                    }
                    $scope.courses[i].listChapters[j].listSubchapters = customOrder.sortNumbers($scope.courses[i].listChapters[j].listSubchapters,'order');
                }
                $scope.courses[i].listChapters = customOrder.sortNumbers($scope.courses[i].listChapters,'order');
            }
            $scope.courses = customOrder.sortNumbers($scope.courses,'order');
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });

    };

    $scope.renderHtml = function (htmlCode) {
        return $sce.trustAsHtml(htmlCode);
    };

    $scope.getCourses();

    $scope.editNavigation = function(elementId, index, course, chapter, subchapter){
        $scope.courseNavigation = [];
        if(subchapter){
            $scope.courseNavigation[0] = course.order - 1;
            $scope.courseNavigation[1] = chapter.order - 1;
            $scope.courseNavigation[2] = subchapter.order - 1;
            $scope.courseNavigation[3] = index;
            $state.go('elearning.courses.editSlide',{courseId: course._id, slideId: elementId, courseNav: $scope.courseNavigation});
        } else if(chapter){
            $scope.courseNavigation[0] = course.order - 1;
            $scope.courseNavigation[1] = chapter.order - 1;
            $scope.courseNavigation[2] = index;
            $state.go('elearning.courses.editSubChapter',{subChapterId: elementId, courseNav: $scope.courseNavigation});
        } else if(course){
            $scope.courseNavigation[0] = course.order - 1;
            $scope.courseNavigation[1] = index;
            $state.go('elearning.courses.editChapter',{chapterId: elementId, courseNav: $scope.courseNavigation});
        } else {
            $scope.courseNavigation[0] = index;
            $state.go('elearning.courses.editCourse',{courseId: elementId, courseNav: $scope.courseNavigation});
        }
    };

    var createMap = function(arrayObject, indexToStart, forDelete){
        var mapping = [];
        for(var i = indexToStart; i < arrayObject.length; i++)
        {
            var objectToAdd = {};
            objectToAdd.id = arrayObject[i]._id;
            objectToAdd.order = forDelete ? arrayObject[i].order - 1 : arrayObject[i].order;
            mapping.push(objectToAdd);
        }
        return mapping;
    };


    $scope.deleteCourse = function (id, idx) {
        ActionModal.show("Stergere curs", "Sunteti sigur ca doriti sa stergeti acest curs?", function () {
            var mappedCourses = createMap($scope.courses, idx + 1, true);
            ElearningService.updateIndex.update({chapterMap: mappedCourses}).$promise.then(function(resp){
                ElearningService.courses.delete({id: id}).$promise.then(function(result){
                    $scope.courses.splice(idx,1);
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });

        },{
            yes: "Sterge"
        });
    };

    $scope.deleteChapter = function (id,course,idx) {
        ActionModal.show("Stergere capitol", "Sunteti sigur ca doriti sa stergeti acest capitol?", function () {
            var chapterMap = createMap(course.listChapters, idx + 1, true);
            ElearningService.updateIndex.update({chapterMap: chapterMap}).$promise.then(function(resp){
                ElearningService.chapters.delete({id: id}).$promise.then(function(result){
                    course.listChapters.splice(idx,1);
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.addCourse = function(){
        $scope.course = {
            order: $scope.courses.length + 1,
            last_updated: new Date(),
            date_created: new Date(),
            listChapters: [],
            groupsID: [],
            duration: 1,
            title: 'New Course',
            description: ''
        };
        ElearningService.courses.create({course: $scope.course}).$promise.then(function(resp){
            $scope.courses.push(Success.getObject(resp));
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.addChapter = function(course){
        $scope.chapter = {
            order: course.listChapters.length + 1,
            last_updated: new Date(),
            date_created: new Date(),
            listSubchapters: [],
            duration: 1,
            title: 'New Chapter',
            description: ''
        };
        ElearningService.chapters.create({courseId: course._id,chapter: $scope.chapter}).$promise.then(function(resp){
            course.listChapters.push(Success.getObject(resp));
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.addSubChapter = function(chapter){
        $scope.subChapter = {
            order: chapter.listSubchapters.length + 1,
            last_updated: new Date(),
            date_created: new Date(),
            listSlides: [],
            duration: 1,
            title: 'New SubChapter',
            description: ''
        };
        ElearningService.subchapters.create({chapterId: chapter._id, subChapter: $scope.subChapter}).$promise.then(function(resp){
            chapter.listSubchapters.push(Success.getObject(resp));
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };


    $scope.addSlide = function(subChapter){
        $scope.slide = {
            content: '',
            last_updated: new Date(),
            date_created: new Date(),
            order: subChapter.listSlides.length + 1,
            type: 'slide',
            questions: [],
            title: 'New Slide',
            retake: 1
        };
        ElearningService.slides.create({id: subChapter._id, slide: $scope.slide}).$promise.then(function(result){
            subChapter.listSlides.push(Success.getObject(result));
        }).catch(function(err){
            console.log(Error.getMessage(err));
        });
    };

    $scope.treeOptions = {
        accept: function(sourceNodeScope, destNodesScope, destIndex) {
            if(sourceNodeScope.$modelValue.groupsID){
                if(destNodesScope.$modelValue[0]){
                    if (destNodesScope.$modelValue[0].groupsID)
                        return true;
                    else
                        return false;
                }
            } else if(sourceNodeScope.$modelValue.listSubchapters){
                if(destNodesScope.isParent(sourceNodeScope))
                    return true;
                else
                    return false
            }else if(sourceNodeScope.$modelValue.listSlides){
                if(destNodesScope.isParent(sourceNodeScope))
                    return true;
                else
                    return false
            }else if(sourceNodeScope.$modelValue.questions){
                if(destNodesScope.isParent(sourceNodeScope))
                    return true;
                else
                    return false
            }
        },
        dropped: function(event){
            for(var i = 0; i < event.dest.nodesScope.$modelValue.length; i++)
            {
                event.dest.nodesScope.$modelValue[i].order = i + 1;
            }
            if(event.dest.nodesScope.$modelValue[0].groupsID){
                var courseMap = createMap(event.dest.nodesScope.$modelValue, 0, false);
                ElearningService.updateIndex.update({courseMap: courseMap}).$promise.then(function(resp){
                    return true;
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            } else if(event.dest.nodesScope.$modelValue[0].listSubchapters){
                var chapterMap = createMap(event.dest.nodesScope.$modelValue, 0, false);
                ElearningService.updateIndex.update({chapterMap: chapterMap}).$promise.then(function(resp){
                    return true;
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }else if(event.dest.nodesScope.$modelValue[0].listSlides){
                var subChaptersMap = createMap(event.dest.nodesScope.$modelValue, 0, false);
                ElearningService.updateIndex.update({subChaptersMap: subChaptersMap}).$promise.then(function(resp){
                    return true;
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }else if(event.dest.nodesScope.$modelValue[0].questions){
                var slidesMap = createMap(event.dest.nodesScope.$modelValue, 0, false);
                ElearningService.updateIndex.update({slidesMap: slidesMap}).$promise.then(function(resp){
                    return true;
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }
        }
    };

    $scope.deleteSubChapter = function (id,chapter,idx) {
        ActionModal.show("Stergere sub-capitol", "Sunteti sigur ca doriti sa stergeti acest sub-capitol?", function () {
            var subChaptersMap = createMap(chapter.listSubchapters, idx + 1, true);
            ElearningService.updateIndex.update({subChaptersMap: subChaptersMap}).$promise.then(function(resp){
                ElearningService.subchapters.delete({id: id}).$promise.then(function(result){
                    chapter.listSubchapters.splice(idx,1);
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.deleteSlide = function (id,subChapter,idx) {
        ActionModal.show("Stergere slide", "Sunteti sigur ca doriti sa stergeti acest slide?", function () {
            var slidesMap = createMap(subChapter.listSlides, idx + 1, true);
            ElearningService.updateIndex.update({slidesMap: slidesMap}).$promise.then(function(resp){
                ElearningService.slides.delete({id: id}).$promise.then(function(result){
                    subChapter.listSlides.splice(idx,1);
                }).catch(function(err){
                    console.log(Error.getMessage(err));
                });
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Sterge"
        });
    };

    $scope.disableCourse = function (course) {
        var message;
        if(course.enabled)
            message = "Sunteti sigur ca doriti sa dezactivati acest curs?";
        else
            message = "Sunteti sigur ca doriti sa activati acest curs?";
        ActionModal.show("Update status", message, function () {
            ElearningService.courses.update({id: course._id},{status: {isEnabled : !course.enabled}}).$promise.then(function(result){
                $scope.getCourses();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Actualizeaza status"
        });
    };

    $scope.disableChapter = function (chapter) {
        var message;
        if(chapter.enabled)
            message = "Sunteti sigur ca doriti sa dezactivati acest capitol?";
        else
            message = "Sunteti sigur ca doriti sa activati acest capitol?";
        ActionModal.show("Update status", message, function () {
            ElearningService.chapters.update({id: chapter._id},{status: {isEnabled : !chapter.enabled}}).$promise.then(function(result){
                $scope.getCourses();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Actualizeaza status"
        });
    };

    $scope.disableSubChapter = function (subchapter) {
        var message;
        if(subchapter.enabled)
            message = "Sunteti sigur ca doriti sa dezactivati acest sub-capitol?";
        else
            message = "Sunteti sigur ca doriti sa activati acest sub-capitol?";
        ActionModal.show("Update status", message, function () {
            ElearningService.subchapters.update({id: subchapter._id},{status: {isEnabled : !subchapter.enabled}}).$promise.then(function(result){
                $scope.getCourses();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Actualizeaza status"
        });
    };

    $scope.disableSlide = function (slide) {
        var message;
        if(slide.enabled)
            message = "Sunteti sigur ca doriti sa dezactivati acest slide?";
        else
            message = "Sunteti sigur ca doriti sa activati acest slide?";
        ActionModal.show("Update status", message, function () {
            ElearningService.slides.update({id: slide._id},{status: {isEnabled : !slide.enabled}}).$promise.then(function(result){
                $scope.getCourses();
            }).catch(function(err){
                console.log(Error.getMessage(err));
            });
        },{
            yes: "Actualizeaza status"
        });
    };


}]);