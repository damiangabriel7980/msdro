/**
 * Created by user on 11.03.2016.
 */

controllers.controller('bulkOperationsPdf',['$scope', '$modalInstance', 'itemsForPdf', 'PDFService','Success', function($scope, $modalInstance, itemsForPdf, PDFService, Success){


  var elementForPdf;
  var pdfTitle;




  function onLoad(){
    $scope.items = itemsForPdf;
    console.log($scope.items);
    checkItems();
  }

  function checkItems(){
    if( "author" in $scope.items[0]){
      elementForPdf = 'bulkOperationsPdfArticles';
      $scope.isArticle = true;
      pdfTitle = 'Articole.pdf';
    } else {
      elementForPdf ='bulkOperationsPdfProducts';
      pdfTitle = "Produse.pdf";
    }
  }

  onLoad();

  function downloadURI(url) {
    var link = document.createElement("a");

    link.download = pdfTitle;
    link.href = url;
    link.click();
  }


  $scope.downloadPDF = function(){
    $scope.isDisabled = true;
    $scope.showMsg = true;

    var htmlForPDf = document.getElementById(elementForPdf).outerHTML;
    PDFService.pdf.create({}, {
      html: htmlForPDf
    }).$promise.then(function(resp) {
      var respObj = Success.getObject(resp);

      downloadURI(respObj.buffer);

      $scope.isDisabled = false;
      $scope.showMsg = false;
    }).catch(function(err) {
      console.log(err);
    })
    
  };

  $scope.closeModal = function(){
    $modalInstance.close();
  }


}]);