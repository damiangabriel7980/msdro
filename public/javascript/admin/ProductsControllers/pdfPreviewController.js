/**
 * Created by user on 09.12.2015.
 */
controllers.controller('pdfPreviewController',['$scope','id','$modalInstance','ProductService','PDFService','Success','Error','$sce','$rootScope',function($scope,id,$modalInstance,ProductService,PDFService,Success,Error,$sce,$rootScope){


    var pathToPDF = 'public/temp/';
    var pathToDownloadPDF = 'temp/';
    $scope.alert={
        type:'warning',
        message:'Please wait while the file is being created'
    };

    $scope.disableButtons = false;


    ProductService.products.query( {id:id} ).$promise.then(function(result){
        $scope.product = Success.getObject(result);
        $scope.description = $sce.trustAsHtml($scope.product.description);
        if ($scope.product.image_path) {
            $scope.imageUrl = $rootScope.pathAmazonDev + $scope.product.image_path
        }
        else {
            $scope.imageUrl = $rootScope.pathAmazonResources+"piles-of-pills.jpg"
        }
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });

    var downloadURI = function (uri, name)
    {
        var link = document.createElement("a");
        link.download = name;
        link.href = uri ;
        link.click();
    };

    $scope.generatePdf = function(){
        $scope.disableButtons = true;
        var htmlToPdf = document.getElementById("toPDF").outerHTML;
        var fileName = $scope.product.name + '.pdf';
        PDFService.pdf.create({}, { html:htmlToPdf, fileName:fileName, filePath:pathToPDF + fileName } ).$promise.then(function(resp){
            console.log(resp);
            downloadURI(pathToDownloadPDF + fileName, fileName);
            $scope.disableButtons = false;
        }).catch(function(err){
            console.log(err);
        })
    };

    $scope.close = function(){
        $modalInstance.close();
        PDFService.pdf.delete( {filePath:pathToPDF + $scope.product.name + '.pdf' } ).$promise
          .then(function(resp){

          }).catch(function(err){
            console.log(err);
        })

    };

}]);