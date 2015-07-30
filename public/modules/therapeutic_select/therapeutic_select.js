(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath;
    for(var i=0; i<scripts.length; i++){
        if(scripts[i].src.indexOf("therapeutic_select.js") > -1) currentScriptPath = scripts[i].src;
    }
    angular.module('therapeuticSelect', []).directive('therapeuticSelect', ['therapeuticAreas', function(therapeuticAreas) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('therapeutic_select.js', 'therapeutic_select.html'),
            replace: true,
            scope: {
                allAreas: '=',
                selectedAreas: '=',
                returnedAreas: '=',
                displayCompact: '='
            },
            link: function(scope, element, attrs) {

                scope.$watch('allAreas', function () {
                    initAllAreas();
                });

                scope.$watch('selectedAreas', function () {
                    refreshReturnedAreas();
                });

                var findIndexById = function (areas, id) {
                    for(var i=0; i<areas.length; i++){
                        if(areas[i]._id.toString() == id.toString()){
                            return i;
                        }
                    }
                    return -1;
                };

                var initAllAreas = function () {
                    if(scope.allAreas){
                        var allAreas = scope.allAreas;
                        var areasOrganised = therapeuticAreas.formatAreas(allAreas, true);
                        scope.areasOrganised = areasOrganised;
                        scope.selectedArea = areasOrganised[0];
                    }
                };

                scope.selectArea = function () {
                    var selected = scope.selectedArea;
                    if(selected && scope.selectedAreas){
                        if(!!selected._id){
                            if(selected._id == 1){
                                scope.selectedAreas = scope.allAreas;
                            }else{
                                var index = findIndexById(scope.selectedAreas, selected._id);
                                if(index == -1) scope.selectedAreas.push(selected);
                                refreshReturnedAreas();
                            }
                        }
                    }
                };

                scope.removeArea = function (area) {
                    if(area && scope.selectedAreas){
                        var index = findIndexById(scope.selectedAreas, area._id);
                        if(index != -1){
                            scope.selectedAreas.splice(index,1);
                            refreshReturnedAreas();
                        }
                    }
                };

                var refreshReturnedAreas = function () {
                    if(scope.selectedAreas){
                        scope.returnedAreas = [];
                        for(var i=0; i<scope.selectedAreas.length; i++){
                            scope.returnedAreas.push(scope.selectedAreas[i]._id.toString())
                        }
                    }
                }
            }
        };
    }]);
})();