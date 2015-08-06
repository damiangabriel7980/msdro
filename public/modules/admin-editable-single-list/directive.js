(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('adminEditableSingleList', []).directive('adminEditableSingleList', ['CSVParser', function(CSVParser) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('directive.js', 'template.html'),
            replace: true,
            scope: {
                ngModel: '=',
                title: '@'
            },
            link: function(scope, element, attrs) {
                scope.addItem = function () {
                    if(scope.itemName){
                        modelInsertItem(scope.itemName);
                        scope.itemName = null;
                    }
                };

                scope.removeItem = function (name) {
                    scope.ngModel.splice(getItemIndex(name), 1);
                };

                scope.fileSelected = function ($files) {
                    if($files && $files[0]){
                        var file = $files[0];
                        var extension = file.name.split(".").pop();
                        if(extension.toLowerCase() !== "csv"){
                            resetAlert("Va rugam incarcati un fisier tip csv.");
                        }else{
                            parseCSV($files[0]);
                        }
                    }
                };

                scope.removeParsedItem = function (index) {
                    scope.parsedCSVContents.splice(index, 1);
                };

                scope.addParsedItems = function () {
                    var emails = getEmailArray(scope.parsedCSVContents);
                    var uniqueEmails = eliminateDuplicates(emails, scope.ngModel);
                    scope.ngModel = uniqueEmails.concat(scope.ngModel || []);
                    scope.parsedCSVContents = [];
                };

                function getEmailArray(parsedCSVContents) {
                    parsedCSVContents = parsedCSVContents || [];
                    var result = [];
                    for(var i=0; i<parsedCSVContents.length; i++){
                        if(parsedCSVContents[i].email) result.push(parsedCSVContents[i].email);
                    }
                    return result;
                }

                function eliminateDuplicates(from, checkAgainst){
                    from = from || [];
                    checkAgainst = checkAgainst || [];
                    var result = [];
                    for(var i=0; i<from.length; i++){
                        if(checkAgainst.indexOf(from[i]) === -1) result.push(from[i]);
                    }
                    return result;
                }

                function parseCSV(file) {
                    CSVParser.parse(file, ["email"]).then(function (result) {
                        if(result.error){
                            switch(result.error){
                                case "headers": resetAlert("Eroare la citire. Verificati capul de tabel."); break;
                                case "lines": resetAlert("Eroare la citirea liniilor."); break;
                                default : resetAlert("Eroare la citirea fisierului."); break;
                            }
                        }else{
                            scope.parsedCSVContents = result.body;
                        }
                    });
                }

                function resetAlert(text, type){
                    scope.csvAlert = {
                        text: text,
                        type: type || "danger"
                    };
                }

                function modelInsertItem(name) {
                    if(!scope.ngModel) scope.ngModel = [];
                    if(getItemIndex(name)===null) scope.ngModel.push(name);
                }

                function getItemIndex(name) {
                    var idx = scope.ngModel.indexOf(name);
                    if(idx === -1){
                        return null;
                    }else{
                        return idx;
                    }
                }
            }
        };
    }]);
})();