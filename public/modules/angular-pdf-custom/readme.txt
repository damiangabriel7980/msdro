Angular pdf viewer
- responsive
- customizable
- text non-selectable

Install:

1. Import "angular-pdf-custom.js", "styles.css", "pdf.js" into html
2. Add "pdf" to module dependencies
3. In your controller define path to pdf: $scope.pdfUrl="...";
4. In same controller, use directive to init viewer:
   <ng-pdf scale="4" template-url="..../viewerTemplate.html"></ng-pdf>

   !! The larger the scale is, the greater the rendered resolution becomes

   !! Make sure the directive is contained inside a parent div that has a set height and width
      The viewer will adjust to those dimensions

5. Edit html template (or change it from "template-url" attribute) if you require a different design