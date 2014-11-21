/*! Angular-PDF Version: 0.3.3 | (C) Sayanee Basu 2014, released under an MIT license */
(function() {

  'use strict';

  angular.module('pdf', []).directive('ngPdf', function($window) {
    return {
      restrict: 'E',
      templateUrl: function(element, attr) {
          console.log(attr);
        return attr.templateUrl ? attr.templateUrl : 'partials/viewer.html'
      },
      link: function(scope, element, attrs) {
        var url = scope.pdfUrl,
          pdfDoc = null,
          pageNum = 1,
          scale = (attrs.scale ? attrs.scale : 1),
          canvas = (attrs.canvasid ? document.getElementById(attrs.canvasid) : document.getElementById('pdf-canvas')),
          ctx = canvas.getContext('2d'),
          windowEl = angular.element($window);

        windowEl.on('scroll', function() {
          scope.$apply(function() {
            scope.scroll = windowEl[0].scrollY;
          });
        });

        PDFJS.disableWorker = true;
        scope.pageNum = pageNum;

        scope.renderPage = function(num) {

          pdfDoc.getPage(num).then(function(page) {
            var viewport = page.getViewport(scale),
              renderContext = {};

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            renderContext = {
              canvasContext: ctx,
              viewport: viewport
            };

            page.render(renderContext);
          });

        };

        scope.goPrevious = function() {
          if (scope.pageToDisplay <= 1) {
            return;
          }
          scope.pageToDisplay = scope.pageToDisplay - 1;
          scope.renderPage(scope.pageToDisplay);
        };

        scope.goNext = function() {
          if (scope.pageToDisplay >= pdfDoc.numPages) {
            return;
          }
          scope.pageToDisplay = scope.pageToDisplay + 1;
          scope.renderPage(scope.pageToDisplay);
        };

//        scope.zoomIn = function() {
//          scale = parseFloat(scale) + 0.2;
//          scope.renderPage(scope.pageToDisplay);
//          return scale;
//        };
//
//        scope.zoomOut = function() {
//          scale = parseFloat(scale) - 0.2;
//          scope.renderPage(scope.pageToDisplay);
//          return scale;
//        };

          scope.zoomIn = function() {
              var width = canvas.getAttribute('style');
              width = width.trim(' ').replace('width','').replace(':','').replace('%','').replace(';','');
              width = parseInt(width);
              width+=10;
              if(width>300) width=300;
              canvas.setAttribute('style','width:'+width+'%;');
          };

          scope.zoomOut = function() {
              var width = canvas.getAttribute('style');
              width = width.trim(' ').replace('width','').replace(':','').replace('%','').replace(';','');
              width = parseInt(width);
              width-=10;
              if(width<0) width=0;
              canvas.setAttribute('style','width:'+width+'%;');
          };

          scope.fitToScreen = function() {
              canvas.setAttribute('style','width:100%;');
          };

        scope.changePage = function() {
          scope.renderPage(scope.pageToDisplay);
        };

          scope.rotateLeft = function() {
              var cls = canvas.getAttribute('class');
              var rotation = cls.substring(6,cls.length);
              var rotation = parseInt(rotation);
              rotation -= 90;
              if(rotation < 0) rotation = 270;
              canvas.setAttribute('class', 'rotate'+rotation);
          };
          scope.rotateRight = function() {
              var cls = canvas.getAttribute('class');
              var rotation = cls.substring(6,cls.length);
              var rotation = parseInt(rotation);
              rotation += 90;
              if(rotation > 270) rotation = 0;
              canvas.setAttribute('class', 'rotate'+rotation);
          };

        PDFJS.getDocument(url).then(function(_pdfDoc) {
          pdfDoc = _pdfDoc;
          scope.renderPage(scope.pageToDisplay);

          scope.$apply(function() {
            scope.pageCount = _pdfDoc.numPages;
          });
        });

        scope.$watch('pageNum', function(newVal) {
          scope.pageToDisplay = parseInt(newVal);
          if (pdfDoc !== null) {
            scope.renderPage(scope.pageToDisplay);
          }
        });

      }
    };
  });

})();
