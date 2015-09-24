/**
 * Created by user on 23.09.2015.
 */
app.controllerProvider.register('ProductPageQA', ['$scope','$window', 'Success', 'Error','$modal', function($scope, $window,Success,Error, $modal){
        $scope.questions = [
                {
                        question:'What is your vision regarding the future of the management of RA?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video:'https://s3-eu-west-1.amazonaws.com/msdqa/multimedia/555c881ba3605a1a00c272f0/movie/555c881ba3605a1a00c272f0.mp4'
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video:''
                                },
                                {
                                        name:'Eugen Feist',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video:''
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msd-prod/speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video:''
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video:''
                                }
                        ]
                },
                {
                        question:'What are the current hot topics regarding the biologic therapy in RA?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video:''
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video:''
                                },
                                {
                                        name:'Eugen Feist',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video:''
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msd-prod/speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video:''
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video:''
                                }
                        ]
                },
                {
                        question:'As a clinician, what is your general experience with golimumab?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video:''
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video:''
                                },
                                {
                                        name:'Eugen Feist',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video:''
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msd-prod/speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video:''
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video:''
                                }
                        ]
                },
                {
                        question:'As a clinician, what is your general experience with golimumab?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video:''
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video:''
                                },
                                {
                                        name:'Eugen Feist',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video:''
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msd-prod/speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video:''
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video:''
                                }
                        ]
                },
                {
                        question:'What is your opinion regarding patient’s involvement in treatment decisions.',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video:''
                                },
                                {
                                        name:'Daniel Aletaha',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video:''
                                }
                        ]
                },
                {
                        question:'What about treatment adherence – how can physicians increase the patient’s adherence?',
                        speakers:[
                                {
                                        name:'Jose Delgado Alves',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc4beca6d0618008d86cd/logo.png',
                                        video:''
                                },
                                {
                                        name:'Eugen Feist',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc681ca6d0618008d86cf/logo.png',
                                        video:''
                                },
                                {
                                        name:'Dennis McGonagle',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msd-prod/speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video:''
                                }
                        ]
                },
                {
                        question:'What are the patients who benefit more from the treatment with golimumab?',
                        speakers:[
                                {
                                        name:'Daniel Aletaha',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc32bca6d0618008d86cc/logo.png',
                                        video:''
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video:''
                                }
                        ]
                },
                {
                        question:'What is your opinion regarding the educational program for the patients?',
                        speakers:[
                                {
                                        name:'Dennis McGonagle',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msd-prod/speakers/555dc83eca6d0618008d86d4/logo.png',
                                        video:''
                                },
                                {
                                        name:'Hans Bijlsm',
                                        picture:'https://s3-eu-west-1.amazonaws.com/msdqa/speakers/555dc804ca6d0618008d86d3/logo.png',
                                        video:''
                                }
                        ]
                }
        ];



        $scope.open = function (speaker,size){

                var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'partials/medic/modals/immunologyQAModal.html',
                        controller:'immunologyQAModal',
                        size: size,
                        resolve:{speaker:function(){
                                return speaker
                        }
        }
                })
        };


}]);
