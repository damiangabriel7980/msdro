/**
 * Created by user on 23.09.2015.
 */

//Static page for the Imunnology QA , the videos are uploaded in the admin page,which generates a link,the links are copied from there
app.controllerProvider.register('ProductPageQA', ['$scope','$window', 'Success', 'Error','$modal', '$rootScope', function($scope, $window,Success,Error, $modal, $rootScope){
        $scope.questions = [
                {
                        question:'What is your vision regarding the future of the management of RA?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q1_JOSE DELGADO ALVES.mp4'
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q1_DANIEL_ALETAHA.mp4'
                                },
                                {
                                        name:'Eugen Feist',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q1_Eugen_Feist.mp4'
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q1_Dennis_Mcgonagle.mp4'
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q1_Hans_Bijlsma.mp4'
                                }
                        ]
                },
                {
                        question:'What are the current hot topics regarding the biologic therapy in RA?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q2_JOSE DELGADO ALVES.mp4'
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q2_DANIEL_ALETAHA.mp4'
                                },
                                {
                                        name:'Eugen Feist',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q2_Eugen_Feist.mp4'
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q2_Dennis_Mcgonagle.mp4'
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q2_Hans_Bijlsma.mp4'
                                }
                        ]
                },
                {
                        question:'As a clinician, what is your general experience with golimumab?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q3_JOSE DELGADO ALVES.mp4'
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q3_DANIEL_ALETAHA.mp4'
                                },
                                {
                                        name:'Eugen Feist',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q3_Eugen_Feist.mp4'
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q3_Dennis_Mcgonagle.mp4'
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q3_Hans_Bijlsma.mp4'
                                }
                        ]
                },
                {
                        question:'How golimumab helps you in optimizing the outcome for your patients?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q4_JOSE DELGADO ALVES.mp4'
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q4_DANIEL_ALETAHA.mp4'
                                },
                                {
                                        name:'Eugen Feist',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q4_Eugen_Feist.mp4'
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q4_Dennis_Mcgonagle.mp4'
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q4_Hans_Bijlsma.mp4'
                                }
                        ]
                },
                {
                        question:'What is your opinion regarding patient’s involvement in treatment decisions?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q5_JOSE DELGADO ALVES.mp4'
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q5_DANIEL_ALETAHA.mp4'
                                }
                        ]
                },
                {
                        question:'What about treatment adherence – how can physicians increase the patient’s adherence?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q6_JOSE DELGADO ALVES.mp4'
                                },
                                {
                                        name:'Eugen Feist',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q6_Eugen_Feist.mp4'
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q6_Dennis_Mcgonagle.mp4'
                                }
                        ]
                },
                {
                        question:'What are the patients who benefit more from the treatment with golimumab?',
                        speakers:[
                                {
                                        name:'Daniel Aletaha',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q7_DANIEL_ALETAHA.mp4'
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q7_Hans_Bijlsma.mp4'
                                }
                        ]
                },
                {
                        question:'What is your opinion regarding the educational program for the patients?',
                        speakers:[
                                {
                                        name:'Dennis McGonagle',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q8_Dennis_Mcgonagle.mp4'
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture: $rootScope.pathAmazonDev + 'speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video: $rootScope.pathAmazonDev + 'productPages/555c7c3b55ac231800ff941c/videos/Q8_Hans_Bijlsma.mp4'
                                }
                        ]
                }
        ];



        $scope.open = function (speaker,size){

                var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'partials/medic/modals/immunologyQAModal.html',
                        controller:'immunologyQAModal',
                        size: 'lg',
                        backdrop: 'static',
                        keyboard: false,
                        resolve:{speaker:function(){
                                return speaker
                                }
                        }
                })

        };


}]);
