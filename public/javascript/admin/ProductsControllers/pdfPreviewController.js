/**
 * Created by user on 09.12.2015.
 */
controllers.controller('pdfPreviewController',['$scope','id','$modalInstance','ProductService','PDFService','Success','Error','$sce','$rootScope',function($scope,id,$modalInstance,ProductService,PDFService,Success,Error,$sce,$rootScope){


    $scope.QRPath = $rootScope.pathAmazonDev + 'produse/'+id+'/QR/qr.png';
    ProductService.products.query({id:id}).$promise.then(function(result){
        $scope.product=Success.getObject(result);
        $scope.description = $sce.trustAsHtml($scope.product.description);
        if ($scope.product.image_path) {
            $scope.imageUrl = $rootScope.pathAmazonDev+$scope.product.image_path
        }
        else {
            $scope.imageUrl = $rootScope.pathAmazonResources+"piles-of-pills.jpg"
        }
    }).catch(function(err){
        console.log(Error.getMessage(err));
    });


    $scope.generatePdf = function(){
        var htmlToPdf = document.getElementById("toPDF").outerHTML;
        var fileName = $scope.product.name+'.pdf';
        console.log(htmlToPdf);
        PDFService.pdf.create({},{html:htmlToPdf,fileName:fileName}).$promise.then(function(resp){
            // window.location.href=resp.filename;
            console.log(resp);
            $scope.location = resp.filename;
            // downloadURI(resp.filename,fileName);
        }).catch(function(err){
            console.log(err);
        })
    }

}]);