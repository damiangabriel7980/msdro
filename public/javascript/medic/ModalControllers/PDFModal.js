app.controllerProvider.register('PDFModal', ['$scope', 'pdfResource', function ($scope, pdfResource) {

    //console.log(pdfResource);
    $scope.title = pdfResource.title;
    $scope.pdfLink = pdfResource.link;

}]);