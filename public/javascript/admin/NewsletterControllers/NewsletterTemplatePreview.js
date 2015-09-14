controllers.controller('NewsletterTemplatePreview', ['$scope', 'html', '$sce', function ($scope, html, $sce) {

    $scope.html = $sce.trustAsHtml(html);

}]);