/**
 * Created by andrei on 12.11.2014.
 */
cloudAdminControllers.controller('ProfileController', ['$scope', '$rootScope', '$modalInstance', 'ProfileService', 'therapeuticAreaService' , '$sce','$upload','$timeout',function($scope, $rootScope, $modalInstance, ProfileService, therapeuticAreaService, $sce,$upload,$timeout){

    var imagePre = $rootScope.pathAmazonDev;

    //----------------------------------------------------------------------------------------------- user profile data

    $scope.county = {};
    $scope.city = {};
    $scope.showerror=false;
    $scope.showerrorProf=false;
    $scope.showerrorPass=false;
    $scope.jobTypes = ["Spital","CMI","Policlinica","Farmacie"];
    $scope.selectedJob="";
    var escapeHtmlEntities = function (text) {
        return text.replace(/[\u00A0-\u2666<>\&]/g, function(c) {
            return '&' +
                (escapeHtmlEntities.entityTable[c.charCodeAt(0)] || '#'+c.charCodeAt(0)) + ';';
        });
    };
    escapeHtmlEntities.entityTable = {
        34 : 'quot',
        38 : 'amp',
        39 : 'apos',
        60 : 'lt',
        62 : 'gt',
        160 : 'nbsp',
        161 : 'iexcl',
        162 : 'cent',
        163 : 'pound',
        164 : 'curren',
        165 : 'yen',
        166 : 'brvbar',
        167 : 'sect',
        168 : 'uml',
        169 : 'copy',
        170 : 'ordf',
        171 : 'laquo',
        172 : 'not',
        173 : 'shy',
        174 : 'reg',
        175 : 'macr',
        176 : 'deg',
        177 : 'plusmn',
        178 : 'sup2',
        179 : 'sup3',
        180 : 'acute',
        181 : 'micro',
        182 : 'para',
        183 : 'middot',
        184 : 'cedil',
        185 : 'sup1',
        186 : 'ordm',
        187 : 'raquo',
        188 : 'frac14',
        189 : 'frac12',
        190 : 'frac34',
        191 : 'iquest',
        192 : 'Agrave',
        193 : 'Aacute',
        194 : 'Acirc',
        195 : 'Atilde',
        196 : 'Auml',
        197 : 'Aring',
        198 : 'AElig',
        199 : 'Ccedil',
        200 : 'Egrave',
        201 : 'Eacute',
        202 : 'Ecirc',
        203 : 'Euml',
        204 : 'Igrave',
        205 : 'Iacute',
        206 : 'Icirc',
        207 : 'Iuml',
        208 : 'ETH',
        209 : 'Ntilde',
        210 : 'Ograve',
        211 : 'Oacute',
        212 : 'Ocirc',
        213 : 'Otilde',
        214 : 'Ouml',
        215 : 'times',
        216 : 'Oslash',
        217 : 'Ugrave',
        218 : 'Uacute',
        219 : 'Ucirc',
        220 : 'Uuml',
        221 : 'Yacute',
        222 : 'THORN',
        223 : 'szlig',
        224 : 'agrave',
        225 : 'aacute',
        226 : 'acirc',
        227 : 'atilde',
        228 : 'auml',
        229 : 'aring',
        230 : 'aelig',
        231 : 'ccedil',
        232 : 'egrave',
        233 : 'eacute',
        234 : 'ecirc',
        235 : 'euml',
        236 : 'igrave',
        237 : 'iacute',
        238 : 'icirc',
        239 : 'iuml',
        240 : 'eth',
        241 : 'ntilde',
        242 : 'ograve',
        243 : 'oacute',
        244 : 'ocirc',
        245 : 'otilde',
        246 : 'ouml',
        247 : 'divide',
        248 : 'oslash',
        249 : 'ugrave',
        250 : 'uacute',
        251 : 'ucirc',
        252 : 'uuml',
        253 : 'yacute',
        254 : 'thorn',
        255 : 'yuml',
        402 : 'fnof',
        913 : 'Alpha',
        914 : 'Beta',
        915 : 'Gamma',
        916 : 'Delta',
        917 : 'Epsilon',
        918 : 'Zeta',
        919 : 'Eta',
        920 : 'Theta',
        921 : 'Iota',
        922 : 'Kappa',
        923 : 'Lambda',
        924 : 'Mu',
        925 : 'Nu',
        926 : 'Xi',
        927 : 'Omicron',
        928 : 'Pi',
        929 : 'Rho',
        931 : 'Sigma',
        932 : 'Tau',
        933 : 'Upsilon',
        934 : 'Phi',
        935 : 'Chi',
        936 : 'Psi',
        937 : 'Omega',
        945 : 'alpha',
        946 : 'beta',
        947 : 'gamma',
        948 : 'delta',
        949 : 'epsilon',
        950 : 'zeta',
        951 : 'eta',
        952 : 'theta',
        953 : 'iota',
        954 : 'kappa',
        955 : 'lambda',
        956 : 'mu',
        957 : 'nu',
        958 : 'xi',
        959 : 'omicron',
        960 : 'pi',
        961 : 'rho',
        962 : 'sigmaf',
        963 : 'sigma',
        964 : 'tau',
        965 : 'upsilon',
        966 : 'phi',
        967 : 'chi',
        968 : 'psi',
        969 : 'omega',
        977 : 'thetasym',
        978 : 'upsih',
        982 : 'piv',
        8226 : 'bull',
        8230 : 'hellip',
        8242 : 'prime',
        8243 : 'Prime',
        8254 : 'oline',
        8260 : 'frasl',
        8472 : 'weierp',
        8465 : 'image',
        8476 : 'real',
        8482 : 'trade',
        8501 : 'alefsym',
        8592 : 'larr',
        8593 : 'uarr',
        8594 : 'rarr',
        8595 : 'darr',
        8596 : 'harr',
        8629 : 'crarr',
        8656 : 'lArr',
        8657 : 'uArr',
        8658 : 'rArr',
        8659 : 'dArr',
        8660 : 'hArr',
        8704 : 'forall',
        8706 : 'part',
        8707 : 'exist',
        8709 : 'empty',
        8711 : 'nabla',
        8712 : 'isin',
        8713 : 'notin',
        8715 : 'ni',
        8719 : 'prod',
        8721 : 'sum',
        8722 : 'minus',
        8727 : 'lowast',
        8730 : 'radic',
        8733 : 'prop',
        8734 : 'infin',
        8736 : 'ang',
        8743 : 'and',
        8744 : 'or',
        8745 : 'cap',
        8746 : 'cup',
        8747 : 'int',
        8756 : 'there4',
        8764 : 'sim',
        8773 : 'cong',
        8776 : 'asymp',
        8800 : 'ne',
        8801 : 'equiv',
        8804 : 'le',
        8805 : 'ge',
        8834 : 'sub',
        8835 : 'sup',
        8836 : 'nsub',
        8838 : 'sube',
        8839 : 'supe',
        8853 : 'oplus',
        8855 : 'otimes',
        8869 : 'perp',
        8901 : 'sdot',
        8968 : 'lceil',
        8969 : 'rceil',
        8970 : 'lfloor',
        8971 : 'rfloor',
        9001 : 'lang',
        9002 : 'rang',
        9674 : 'loz',
        9824 : 'spades',
        9827 : 'clubs',
        9829 : 'hearts',
        9830 : 'diams',
        338 : 'OElig',
        339 : 'oelig',
        352 : 'Scaron',
        353 : 'scaron',
        376 : 'Yuml',
        710 : 'circ',
        732 : 'tilde',
        8194 : 'ensp',
        8195 : 'emsp',
        8201 : 'thinsp',
        8204 : 'zwnj',
        8205 : 'zwj',
        8206 : 'lrm',
        8207 : 'rlm',
        8211 : 'ndash',
        8212 : 'mdash',
        8216 : 'lsquo',
        8217 : 'rsquo',
        8218 : 'sbquo',
        8220 : 'ldquo',
        8221 : 'rdquo',
        8222 : 'bdquo',
        8224 : 'dagger',
        8225 : 'Dagger',
        8240 : 'permil',
        8249 : 'lsaquo',
        8250 : 'rsaquo',
        8364 : 'euro'
    };
    ProfileService.getUserData.query().$promise.then(function (resp) {
        $scope.username=resp.username;
        $scope.userData = resp;
        $scope.statusAlert = {newAlert:false, type:"", message:""};
        $scope.uploadAlert = {newAlert:false, type:"", message:""};
        var allNames = resp.name.split(" ");
        $scope.firstName = allNames[0];
        allNames.splice(0,1);
        $scope.lastName = allNames.join(" ");
        $scope.phone = resp.phone;
        $scope.newsletter = resp.subscription == 1;
        $scope.imageUser = imagePre + resp.image_path;
        $scope.hideImg="show";
        $scope.userTherapeuticAreas = resp['therapeutic-areasID']?resp['therapeutic-areasID']:[];
        if($scope.userTherapeuticAreas.length!=0) {
            for (var i = 0; i < $scope.allAreas.length; i++) {
                for (var j=0;j<$scope.userTherapeuticAreas.length;j++){
                    if($scope.allAreas[i].id===$scope.userTherapeuticAreas[j])
                    {
                        $scope.userTherapeuticAreas[j] = $scope.allAreas[i];
                        continue;
                    }

                }

            }
            console.log($scope.userTherapeuticAreas);
        }
        if(resp.job){
            $scope.job = resp.job[0];
            switch($scope.job.job_type){
                case 1: $scope.selectedJob="Spital"; break;
                case 2: $scope.selectedJob="CMI"; break;
                case 3: $scope.selectedJob="Policlinica"; break;
                case 4: $scope.selectedJob="Farmacie"; break;
                default: $scope.selectedJob=null; break;
            }
        }else{
            $scope.job = {
                _id: 0,
                job_type: "",
                job_name: "",
                street_name: "",
                street_number: "",
                postal_code: "",
                job_address: ""
            };
        }
        $scope.fileSelected = function($files, $event){
                //make sure a file was actually loaded
                if($files[0]){
                    var extension = $files[0].name.split('.').pop();
                    var key2 = "user/"+$scope.userData._id+"/img"+$scope.userData._id+"."+extension;
                    // Closure to capture the file information.
                    var reader = new FileReader();
                    $scope.uploadAlert.newAlert = true;
                    $scope.uploadAlert.type = "success";
                    $scope.uploadAlert.message = "Fotografia se incarca...";
                    reader.onloadend = function(event){
                        $scope.newImage = event.target.result;
                        var b64 = $scope.newImage.split("base64,")[1];
                        $scope.imageUser="";
                        ProfileService.saveUserPhoto.save({data:{Body: b64, extension: extension}}).$promise.then(function (message) {
                            if(message){
                                $scope.uploadAlert.type = message.type;
                                $scope.uploadAlert.message = message.message;
                                $scope.uploadAlert.newAlert = true;
                                ProfileService.getUserData.query().$promise.then(function (resp) {
                                    $scope.imageUser = imagePre + resp.image_path;
                                    $timeout(function() {
                                        $scope.$apply($scope);
                                    },100);
                                });


                            }
                        });
                    };

                    reader.readAsDataURL($files[0]);

                    // Read in the image file as a data URL.




                    }

        };
        //select user's county and city

        $scope.county['selected'] = {};
        $scope.county['selected']['name'] = resp.county_name;
        $scope.county['selected']['_id'] = resp.county_id;
        $scope.city['selected'] = {};
        $scope.city['selected']['name'] = resp.city_name;
        $scope.city['selected']['_id'] = resp.city_id;

        var cityDefault = true;

        $scope.$watch('county.selected', function () {
            if($scope.county.selected!==undefined){
                ProfileService.getCities.query({county_name:$scope.county.selected.name}).$promise.then(function (resp) {
                    $scope.cities = resp.sort(function(a,b){
                        if ( a.name < b.name )
                            return -1;
                        if ( a.name > b.name )
                            return 1;
                        return 0;
                    });
                });
                if(!cityDefault) $scope.city.selected = undefined;
                cityDefault = false;
                $scope.cities = [];
            }
        });

    });

    // get counties and cities
    ProfileService.getCounties.query().$promise.then(function (counties) {
        $scope.counties = counties;
    });

    //----------------------------------------------------------------------------------------------- therapeutic areas
    $scope.allAreas=[];
    //get all
    var therap=[];
    therapeuticAreaService.query().$promise.then(function (resp) {
        var areasOrganised = [];
        therap=resp;
        areasOrganised.push({id:0, name:"Adauga arii terapeutice"});
        areasOrganised.push({id:1, name:"Toate"});
        for(var i=0; i<resp.length; i++){
            var thisArea = resp[i];
            if(thisArea['therapeutic-areasID'].length == 0){
                //it's a parent. Add it
                areasOrganised.push({id: thisArea._id, name:thisArea.name});
                if(thisArea.has_children){
                    //find all it's children
                    for(var j=0; j < resp.length; j++){
                        if(resp[j]['therapeutic-areasID'].indexOf(thisArea._id)>-1){
                            //found one children. Add it
                            areasOrganised.push({id: resp[j]._id, name:"0"+resp[j].name});
                        }
                    }
                }
            }
        }

        $scope.allAreas = areasOrganised;
        $scope.selectedArea = $scope.allAreas[0];
        if($scope.userTherapeuticAreas!=undefined) {
            for (var i = 0; i < $scope.allAreas.length; i++) {
                for (var j=0;j<$scope.userTherapeuticAreas.length;j++){
                    if($scope.allAreas[i].id===$scope.userTherapeuticAreas[j])
                    {
                        $scope.userTherapeuticAreas[j] = $scope.allAreas[i];
                        continue;
                    }

                }

            }
            console.log($scope.userTherapeuticAreas);
        }
    });

    var findInUserAreas = function (id) {
        var index = -1;
        var i=0;
        var found = false;
        while(!found && i<$scope.userTherapeuticAreas.length){
            if($scope.userTherapeuticAreas[i].id==id){
                found = true;
                index = i;
            }
            i++;
        }
        return index;
    };

    $scope.areaWasSelected = function (sel) {
        if(sel.id!=0){
            if(sel.id==1){
                $scope.userTherapeuticAreas = [];
                for(var i=2; i<$scope.allAreas.length; i++){
                    $scope.userTherapeuticAreas.push($scope.allAreas[i]);
                }
            }else{
                var index = findInUserAreas(sel.id);
                if(index==-1) $scope.userTherapeuticAreas.push(sel);
            }
        }
    };

    $scope.removeUserArea = function (id) {
        var index = findInUserAreas(id);
        if(index>-1){
            $scope.userTherapeuticAreas.splice(index,1);
        }
    };

    //----------------------------------------------------------------------------------------------------- User points
    $scope.pointsTotal = 0;
    $scope.pointsSlide = 0;
    $scope.pointsVideo = 0;
    $scope.pointsArticles = 0;

    //------------------------------------------------------------------------------------------------ form submissions

    //user profile
    $scope.userProfileAlert = {newAlert:false, type:"", message:""};
    $scope.submitProfileForm = function (isValid) {
        $scope.showerrorProf=true;
        if(isValid){
            var toSend = {};
            toSend.firstName = escapeHtmlEntities (this.firstName);
            toSend.lastName = this.lastName;
            toSend.phone = this.phone;
            toSend.newsletter = this.newsletter;
            toSend.therapeuticAreas = $scope.userTherapeuticAreas;
            toSend.county = this.county.selected._id;
            toSend.city = this.city.selected._id;
            ProfileService.uploadProfile.save({newData:toSend}).$promise.then(function (resp) {
                $scope.userProfileAlert.message = resp.message;
                if(resp.error){
                    $scope.userProfileAlert.type = "danger";
                }else{
                    $scope.userProfileAlert.type = "success";
                }
                $scope.userProfileAlert.newAlert = true;
            });
        }
        else
        {
            $scope.userProfileAlert.newAlert = true;
            $scope.userProfileAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userProfileAlert.type = "danger";
        }
    };

    //user job
    $scope.userJobAlert = {newAlert:false, type:"", message:""};
    $scope.submitJobForm = function (isValid) {
        $scope.showerror=true;
        console.log(isValid);
        if(isValid){
            switch(this.selectedJob){
                case("Spital"): this.job['job_type']=1; break;
                case("CMI"): this.job['job_type']=2; break;
                case("Policlinica"): this.job['job_type']=3; break;
                case("Farmacie"): this.job['job_type']=4; break;
                default: this.job['job_type']=null; break;
            }
            ProfileService.uploadJob.save({job: this.job}).$promise.then(function (resp) {
                $scope.userJobAlert.message = resp.message;
                if(resp.error){
                    $scope.userJobAlert.type = "danger";
                }else{
                    $scope.userJobAlert.type = "success";
                }
                $scope.userJobAlert.newAlert = true;
            });
        }
        else
        {
            $scope.userJobAlert.newAlert = true;
            $scope.userJobAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userJobAlert.type = "danger";
        }
    };

    //user change email
    $scope.userChangeMailAlert = {newAlert:false, type:"", message:""};
    $scope.submitEmailForm = function (isValid) {
        if(isValid){
            var toSend = {};
            toSend.mail = $scope.username;
            toSend.pass = this.changePass;
            ProfileService.changeEmail.save({userData: toSend}).$promise.then(function (resp) {
                $scope.userChangeMailAlert.message = resp.message;
                if(resp.error){
                    $scope.userChangeMailAlert.type = "danger";
                }else{
                    $scope.userChangeMailAlert.type = "success";
                }
                $scope.userChangeMailAlert.newAlert = true;
            });
        }
        else
        {
            $scope.userChangeMailAlert.newAlert = true;
            $scope.userChangeMailAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userChangeMailAlert.type = "danger";
        }
    };

    //user change pass
    $scope.userChangePassAlert = {newAlert:false, type:"", message:""};
    $scope.submitChangePassForm = function (isValid) {
        $scope.showerrorPass=true;
        if(isValid){
            var toSend = {};
            toSend.oldPass = this.oldPass;
            toSend.newPass = this.newPass;
            toSend.confirmPass = this.confirmPass;
            ProfileService.changePassword.save({userData: toSend}).$promise.then(function (resp) {
                $scope.userChangePassAlert.message = resp.message;
                if(resp.error){
                    $scope.userChangePassAlert.type = "danger";
                }else{
                    $scope.userChangePassAlert.type = "success";
                }
                $scope.userChangePassAlert.newAlert = true;
            });
        }
        else
        {
            $scope.userChangePassAlert.newAlert = true;
            $scope.userChangePassAlert.message = "Nu ati completat toate campurile! Verificati formularul inca o data!";
            $scope.userChangePassAlert.type = "danger";
        }
    };

    //------------------------------------------------------------------------------------- other functions / variables

    //open first accordion group by default
    $scope.openFirst = true;

    $scope.closeModal = function(){
        $modalInstance.close();
    };

    $scope.trustAsHtml = function (val) {
        return $sce.trustAsHtml(val);
    };

}]).filter('propsFilter', function() {
    //used for select2
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});