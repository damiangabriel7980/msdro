/**
 * Created by user on 01.03.2016.
 */
(function() {
  var scripts = document.getElementsByTagName("script");
  var currentScriptPath = scripts[scripts.length-1].src;

  angular.module('bulkOperations', []).directive('bulkOperations', ['ActionModal', 'bulkOperationsService','$state', 'Success', '$modal', function(ActionModal, bulkOperationsService, $state, Success, $modal) {
    return {
      restrict: 'E',
      templateUrl: currentScriptPath.replace('bulk_operations.js', 'bulk_operations.html'),
      replace: true,
      scope: {
        model: "@",
        field: "@",
        itemsSet: "=",
        connectedEntities: "=",
        filteredArray: "="
      },
      link: function(scope, element, attrs) {

        var toSet = {};

        scope.deleteButton = 'deleteButton' in attrs;
        scope.modifyButton = 'modifyButton' in attrs;
        scope.exportPDFButton = 'exportPdf' in attrs;

        var convertSetToArray = function(){
          scope.itemsArray = [];
          scope.itemsSet.forEach(function(value){
            scope.itemsArray.push(value);
          });
        };

        var checkFieldToSet = function(value){
          if(scope.field){
            toSet[scope.field] = value;
          } else {
            toSet.enabled = value;
          }
        };

        scope.$watch('filteredArray', function(newValue, oldValue){
          if ( typeof  newValue != "undefined") {
            scope.maxItems = newValue.length;

          }
        });

        var messageForModification = {
          title:{
            true: "Activati",
            false: "Dezactivati"
          },
          message: {
            true: "Sunteti sigur ca doriti sa activati ",
            false: "Sunteti sigur ca doriti sa dezactivati "
          }
        };



        scope.selectAll = function(){
          for(var i = 0; i< scope.filteredArray.length; i++){
            scope.itemsSet.add(scope.filteredArray[i]._id);
          }
        };

        scope.deselectAll = function(){
          for (var i = 0; i < scope.filteredArray.length; i++){
            scope.itemsSet.delete(scope.filteredArray[i]._id)
          }
        };



        scope.deleteSelectedItems = function() {
          convertSetToArray();

          ActionModal.show("Sterge", "Sunteti sigur ca doriti sa stergeti " + scope.itemsArray.length +" elemente ?",function(){
            bulkOperationsService.operations.delete( {model: scope.model} , {items :scope.itemsArray, coupledEntities: scope.connectedEntities? scope.connectedEntities : null} ).$promise.then(function(resp){
              $state.reload();
            }).catch(function(err){

            });
          },{yes: "Sterge"});
        };

        scope.updateSelectedItems = function(modification){
          convertSetToArray();
          checkFieldToSet(modification);
          ActionModal.show( messageForModification.title[modification], messageForModification.message[modification] + scope.itemsArray.length +" elemente ?", function(){
            bulkOperationsService.operations.update( { model: scope.model }, {items: scope.itemsArray, toSet: toSet} ).$promise.then(function(resp){
              $state.reload();
            }).catch(function(err){

            })
          }, {yes: "Modifica"});
        };

        scope.getItems = function() {
          convertSetToArray();
          bulkOperationsService.operations.query( {model: scope.model, items: scope.itemsArray}).$promise.then(function(resp){
            var itemsForPdf = Success.getObject(resp);
            $modal.open({
              templateUrl:'modules/bulk_operations/bulk_operations_pdf_preview.html',
              size: 'lg',
              windowClass:'fade stretch',
              controller: 'bulkOperationsPdf',
              resolve:{
                itemsForPdf: function(){
                  return itemsForPdf;
                }
              }
            })
          }).catch(function(err){
            console.log(err);
          })
        }
      }
    };
  }]);
})();