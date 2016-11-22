/**
 * Created by user on 09.12.2015.
 */
controllers.controller('pdfPreviewController', ['$scope', 'id', '$modalInstance', 'ProductService', 'PDFService', 'Success', 'Error', '$sce', '$rootScope', 'Diacritics',
  function ($scope, id, $modalInstance, ProductService, PDFService, Success, Error, $sce, $rootScope, Diacritics) {


  $scope.alert = {
    type: 'warning',
    message: 'Please wait while the file is being created'
  };

  $scope.disableButtons = false;


  ProductService.products.query({id: id}).$promise.then(function (result) {
    $scope.product = Success.getObject(result);
    $scope.description = $sce.trustAsHtml($scope.product.description);
    if ($scope.product.image_path) {
      $scope.imageUrl = $rootScope.pathAmazonDev + $scope.product.image_path
    }
    else {
      $scope.imageUrl = $rootScope.pathAmazonResources + "piles-of-pills.jpg"
    }
  }).catch(function (err) {
    console.log(Error.getMessage(err));
  });

    function downloadURI(url, fileName) {
      var link = document.createElement("a");

      link.download = fileName;
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

  $scope.generatePdf = function () {
    $scope.disableButtons = true;
    var htmlToPdf = document.getElementById("toPDF").outerHTML;
    var fileName = $scope.product.name + '.pdf';
    PDFService.pdf.create({},{
      html: htmlToPdf,
      fileName: fileName
    }).$promise.then(function (resp) {

     var respObj = Success.getObject(resp);

      var blobToDownload = b64toBlob(respObj.buffer, 'application/pdf');


      var url = URL.createObjectURL(blobToDownload);

      downloadURI(url, fileName);

      $scope.disableButtons = false;
    }).catch(function (err) {
      console.log(err);
    })

  };



  $scope.close = function () {
    $modalInstance.close();

  };

}]);
