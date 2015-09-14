(function() {
    var scripts = document.getElementsByTagName("script");
    var currentScriptPath = scripts[scripts.length-1].src;

    angular.module('adminEmailsList', []).directive('adminEmailsList', ['CSVParser', function(CSVParser) {
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
                    if(scope.item && modelInsertItem(scope.item)){
                        scope.item = null;
                    }
                };

                scope.removeItem = function (idx) {
                    scope.ngModel.splice(idx, 1);
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
                    var items = getItemsArray(scope.parsedCSVContents);
                    var uniqueEmails = eliminateDuplicates(items, scope.ngModel);
                    scope.ngModel = uniqueEmails.concat(scope.ngModel || []);
                    scope.parsedCSVContents = [];
                };

                function getItemsArray(parsedCSVContents) {
                    parsedCSVContents = parsedCSVContents || [];
                    var result = [];
                    for(var i=0; i<parsedCSVContents.length; i++){
                        if(parsedCSVContents[i].email) result.push({
                            email: parsedCSVContents[i].email,
                            name: parsedCSVContents[i].name
                        });
                    }
                    return result;
                }

                function eliminateDuplicates(from, checkAgainst){
                    from = from || [];
                    checkAgainst = checkAgainst || [];
                    var exists;
                    var result = [];
                    for(var i=0; i<from.length; i++){
                        exists = false;
                        for(var j=0; j<checkAgainst.length && !exists; j++){
                            if(from[i].email === checkAgainst[j].email) exists = true;
                        }
                        if(!exists) result.push(from[i]);
                    }
                    return result;
                }

                function parseCSV(file) {
                    CSVParser.parse(file, ["email", "name"]).then(function (result) {
                        if(result.error){
                            switch(result.error){
                                case "headers": resetAlert("Eroare la citire. Verificati capul de tabel."); break;
                                case "lines": resetAlert("Eroare la citirea liniilor."); break;
                                default : resetAlert("Eroare la citirea fisierului."); break;
                            }
                        }else{
                            scope.parsedCSVContents = keepValidEmails(result.body || []);
                        }
                    });
                }

                function keepValidEmails(objectsArray){
                    var ret = [];
                    for(var i=0; i<objectsArray.length; i++){
                        if(isValidEmail(objectsArray[i].email)) ret.push(objectsArray[i]);
                    }
                    return ret;
                }

                function isValidEmail(email){
                    console.log(email);
                    if(typeof email === "string" && email.split(/[\s@]+/).length === 2){
                        return true;
                    }else{
                        return false;
                    }
                }

                function resetAlert(text, type){
                    scope.csvAlert = {
                        text: text,
                        type: type || "danger"
                    };
                }

                function modelInsertItem(item) {
                    item = item || {};
                    if(!scope.ngModel) scope.ngModel = [];
                    if(item.email && getItemIndex(item.email)===null) {
                        scope.ngModel.push(item);
                        return true;
                    }else{
                        return false;
                    }
                }

                function getItemIndex(email) {
                    for(var i=0; i<scope.ngModel.length; i++){
                        if(scope.ngModel[i].email === email) return i;
                    }
                    return null;
                }
            }
        };
    }]);
})();