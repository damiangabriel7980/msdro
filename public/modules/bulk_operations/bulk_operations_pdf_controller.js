/**
 * Created by user on 11.03.2016.
 */

controllers.controller('bulkOperationsPdf',['$scope', '$modalInstance', 'itemsForPdf', 'PDFService','Success', function($scope, $modalInstance, itemsForPdf, PDFService, Success){


  var elementForPdf;
  var pdfTitle;

  function onLoad(){
    $scope.items = itemsForPdf;
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


  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }


  $scope.downloadPDF = function(){
    $scope.isDisabled = true;
    $scope.showMsg = true;

    var htmlForPDf = document.getElementById(elementForPdf).outerHTML;
    PDFService.pdf.create({}, {
      html: htmlForPDf
    }).$promise.then(function(resp) {

      var respObj = Success.getObject(resp);

      var blobToDownload = b64toBlob(respObj.buffer, 'application/pdf');


      var url = URL.createObjectURL(blobToDownload);

      downloadURI(url);

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