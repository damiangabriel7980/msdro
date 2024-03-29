/*! Angular-PDF Version: 0.3.3 | (C) Sayanee Basu 2014, released under an MIT license */
(function() {

    'use strict';

    var scripts = document.getElementsByTagName("script");
    var currentScriptPath;
    for(var i=0; i<scripts.length; i++){
        if(scripts[i].src.indexOf("angular-pdf-custom") > -1) currentScriptPath = scripts[i].src;
    }

    angular.module('pdfCustom', []).directive('ngPdfCustom', ['$window', function($window) {
        return {
            restrict: 'E',
            templateUrl: currentScriptPath.replace('angular-pdf-custom.js', 'viewerTemplate.html'),
            scope: {
                pdfUrl: '='
            },
            link: function(scope, element, attrs) {
                var url = scope.pdfUrl,
                    pdfDoc = null,
                    pageNum = 1,
                    scale = (attrs.scale ? attrs.scale : 1),
                    canvas = (attrs.canvasid ? document.getElementById(attrs.canvasid) : document.getElementById('pdf-canvas')),
                    ctx = canvas.getContext('2d'),
                    windowEl = angular.element($window);

                var canvasEl = angular.element(canvas);
                var rotation = 0;

                windowEl.on('scroll', function() {
                    scope.$apply(function() {
                        scope.scroll = windowEl[0].scrollY;
                    });
                });

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
                    var width = canvasEl.css('width');
                    width = width.replace('%','').replace('px','');
                    width = parseInt(width);
                    width+=width*0.1;
                    if(width>6000) width=6000;
                    canvasEl.css('width',width+'px');
                };

                scope.zoomOut = function() {
                    var width = canvasEl.css('width');
                    width = width.replace('%','').replace('px','');
                    width = parseInt(width);
                    width-=width*0.1;
                    if(width<50) width=50;
                    canvasEl.css('width',width+'px');
                };

                scope.fitToScreen = function() {
                    canvasEl.css('width','100%');
                };

                scope.changePage = function() {
                    scope.renderPage(scope.pageToDisplay);
                };

//          scope.rotateLeft = function() {
//              var cls = canvas.getAttribute('class');
//              var rotation = cls.substring(6,cls.length);
//              var rotation = parseInt(rotation);
//              rotation -= 90;
//              if(rotation < 0) rotation = 270;
//              canvas.setAttribute('class', 'rotate'+rotation);
//          };
//          scope.rotateRight = function() {
//              var cls = canvas.getAttribute('class');
//              var rotation = cls.substring(6,cls.length);
//              var rotation = parseInt(rotation);
//              rotation += 90;
//              if(rotation > 270) rotation = 0;
//              canvas.setAttribute('class', 'rotate'+rotation);
//          };

                scope.rotateLeft = function() {
                    canvasEl.removeClass('rotate'+rotation);
                    rotation -= 90;
                    if(rotation < 0) rotation = 270;
                    canvasEl.addClass('rotate'+rotation);
                };
                scope.rotateRight = function() {
                    canvasEl.removeClass('rotate'+rotation);
                    rotation += 90;
                    if(rotation > 270) rotation = 0;
                    canvasEl.addClass('rotate'+rotation);
                };

                PDFJS.disableWorker = true;
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
    }]);

})();
