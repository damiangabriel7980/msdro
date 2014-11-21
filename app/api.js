var Content     = require('./models/articles');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var Events = require('./models/events');
var Counties = require('./models/counties');
var Cities = require('./models/cities');
var Multimedia = require('./models/multimedia');
var User = require('./models/user');
var Job = require('./models/jobs');
var Teste=require('./models/quizes');
var Questions=require('./models/questions');
var Answers = require('./models/answers');
var User=require('./models/user');
var Slides = require('./models/slides');

var XRegExp = require('xregexp').XRegExp;

var SHA256   = require('crypto-js/sha256');

var s3 = require('s3');
var s3Client = s3.createClient({
    s3Options:{
        accessKeyId: "AKIAJYA22DHN4HZ6MXHQ",
        secretAccessKey: "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"
    }
});

module.exports = function(app, router) {

    router.route('/content')

        .get(function(req, res) {
            Content.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        });

    router.route('/content/:content_id')

        .get(function(req, res) {
            var userGr = req.user.groupsID;
            Content.find({_id:req.params.content_id, groupsID: { $in: userGr}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                if(cont.length == 1){
                    res.json(cont[0]);
                }else{
                    res.json(null);
                }
            })
        });

    router.route('/content/type/:content_type')

        .get(function(req, res) {
            var userGr = req.user.groupsID;
            Content.find({type: req.params.content_type, groupsID: { $in: userGr}}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/userdata')

        .get(function(req, res) {
            var user = req.user;
            var userCopy = {};
            userCopy['name'] = user.name;
            userCopy['image_path'] = user.image_path;
            userCopy['phone'] = user.phone;
            userCopy['points'] = user.points;
            userCopy['subscription'] = user.subscription;
            userCopy['username'] = user.username;
            userCopy['therapeutic-areasID'] = user['therapeutic-areasID'];
            userCopy['citiesID'] = user.citiesID;
            Cities.find({_id:user.citiesID[0]}, function (err, city) {
                if(err){
                    res.send(err);
                }
                if(city[0]){
                    userCopy['city_id'] = city[0]._id;
                    userCopy['city_name'] = city[0].name;
                    Counties.find({citiesID: {$in: [userCopy['city_id'].toString()]}}, function (err, county) {
                        if(err){
                            res.send(err);
                        }
                        if(county[0]){
                            userCopy['county_id'] = county[0]._id;
                            userCopy['county_name'] = county[0].name;
                            if(user['jobsID']){
                                if(user['jobsID'][0]){
                                    var jobId = user.jobsID[0];
                                    Job.find({_id:jobId}, function (err, job) {
                                        if(err){
                                            res.send(err);
                                        }else{
                                            userCopy.job = job;
                                            res.json(userCopy);
                                        }
                                    })

                                }else{
                                    res.json(userCopy);
                                }

                            }else{
                                res.json(userCopy);
                            }
                        }else{
                            res.send(err);
                        }
                    });
                }else{
                    res.send(err);
                }

            });
        });

    router.route('/counties')

        .get(function(req, res) {
            Counties.find({$query:{}, $orderby: {name: 1}}, {name: 1}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/cities/:county_name')

        .get(function(req, res) {
            Counties.find({name: req.params.county_name}, function (err, counties) {
                if(err) {
                    res.send(err);
                }
                Cities.find({_id: {$in: counties[0].citiesID}}, function (err, cities) {
                    if(err) {
                        res.send(err);
                    }
                    res.json(cities);
                });
            });
        });

    router.route('/userProfile')

        .post(function (req, res) {
            var ans = {};
            var newData = req.body.newData;
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,30}$');
            var phonePatt = new XRegExp('^[0-9]{10,20}$');
            //check name
            if((!namePatt.test(newData.firstName.toString())) || (!namePatt.test(newData.lastName.toString()))){
                ans.error = true;
                ans.message = "Numele si prenumele trebuie sa contina doar caractere, minim 3";
                res.json(ans);
            }else{
                //check phone number
                if(!phonePatt.test(newData.phone.toString())){
                    ans.error = true;
                    ans.message = "Numarul de telefon trebuie sa contina doar cifre, minim 10";
                    res.json(ans);
                }else{
                    var upd = User.update({_id:req.user._id}, {
                        name: newData.firstName+" "+newData.lastName,
                        phone: newData.phone,
                        subscription: newData.newsletter?1:0,
                        "therapeutic-areasID": newData.therapeuticAreas,
                        citiesID: [newData.city]
                    }, function () {
                        if(!upd._castError){
                            ans.error = false;
                            ans.message = "Datele au fost modificate";
                        }else{
                            ans.error = true;
                            ans.message = "Eroare la actualizare. Verificati datele";
                        }
                        res.json(ans);
                    });
                }
            }
        });

    router.route('/userJob')

        .post(function (req, res) {
            var ans = {error:false};
            var job = req.body.job;
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,30}$');
            var numberPatt = new XRegExp('^[0-9]{1,5}$');
            if(!numberPatt.test(job.street_number.toString())) {
                ans.error = true;
                ans.message = "Numarul strazii trebuie sa contina intre 1 si 5 cifre";
            }
            if(!namePatt.test(job.street_name.toString())) {
                ans.error = true;
                ans.message = "Numele strazii trebuie sa contina doar litere, minim 3";
            }
            if(!namePatt.test(job.job_name.toString())) {
                ans.error = true;
                ans.message = "Locul de munca trebuie sa contina doar litere, minim 3";
            }
            if(!isNaN(parseInt(job.job_type))){
                if(parseInt(job.job_type)<1 || parseInt(job.job_type>4)){
                    ans.error = true;
                    ans.message = "Selectati un tip de loc de munca";
                }
            }else{
                ans.error = true;
                ans.message = "Selectati un tip de loc de munca";
            }
            if(ans.error){
                res.json(ans);
            }else{
                if(job._id==0){
                    //create new
                    var newJob = new Job({
                        job_type: job.job_type,
                        job_name: job.job_name,
                        street_name: job.street_name,
                        street_number: job.street_number,
                        postal_code: job.postal_code,
                        job_address: job.job_address
                    });
                    newJob.save(function (err, inserted) {
                        if(err){
                            ans.error = true;
                            ans.message = "Eroare la crearea locului de munca. Va rugam verificati campurile";
                            res.json(ans);
                        }else{
                            //update user to point to new job
                            var idInserted = inserted._id.toString();
                            var upd = User.update({_id:req.user._id}, {jobsID: [idInserted]}, function () {
                                if(!upd._castError){
                                    ans.error = false;
                                    ans.message = "Locul de munca a fost salvat";
                                }else{
                                    ans.error = true;
                                    ans.message = "Eroare la adaugarea locului de munca. Va rugam sa verificati datele";
                                }
                                res.json(ans);
                            });
                        }
                    });
                }else{
                    //update existing
                    var upd = Job.update({_id:job._id}, {
                        job_type: job.job_type,
                        job_name: job.job_name,
                        street_name: job.street_name,
                        street_number: job.street_number,
                        postal_code: job.postal_code,
                        job_address: job.job_address
                    }, function () {
                        if(!upd._castError){
                            ans.error = false;
                            ans.message = "Locul de munca a fost adaugat";
                        }else{
                            ans.error = true;
                            ans.message = "Eroare la adaugarea locului de munca. Va rugam sa verificati datele";
                        }
                        res.json(ans);
                    });
                }
            }
        });

    router.route('/changeEmail')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            //check if mail is valid
            var mailPatt = new XRegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$', 'i');
            if(!mailPatt.test(userData.mail.toString())){
                ans.error = true;
                ans.message = "E-mail invalid";
                res.json(ans);
            }else{
                //check if mail already exists
                User.find({username: userData.mail}, function(err, result){
                    if(err){
                        ans.error = true;
                        ans.message = "Eroare la schimbarea adresei de e-mail";
                        res.json(ans);
                    }else{
                        if(result.length == 0){
                            //check password
                            if(SHA256(userData.pass).toString() === req.user.password){
                                var upd = User.update({_id:req.user._id}, {username: userData.mail}, function () {
                                    if(!upd._castError){
                                        ans.error = false;
                                        ans.message = "Adresa de e-mail a fost modificata";
                                        res.json(ans);
                                    }else{
                                        ans.error = true;
                                        ans.message = "Eroare la schimbarea adresei de e-mail";
                                        res.json(ans);
                                    }
                                });
                            }else{
                                ans.error = true;
                                ans.message = "Parola incorecta";
                                res.json(ans);
                            }
                        }else{
                            ans.error = true;
                            ans.message = "Acest e-mail este deja folosit";
                            res.json(ans);
                        }
                    }
                });
            }
        });

    router.route('/changePassword')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            //check if password is correct
            if(SHA256(userData.oldPass).toString() !== req.user.password){
                ans.error = true;
                ans.message = "Parola nu este corecta";
                res.json(ans);
            }else{
                //check if new password length is valid
                if(userData.newPass.toString().length < 6 || userData.newPass.toString.length > 32){
                    ans.error = true;
                    ans.message = "Parola noua trebuie sa contina intre 6 si 32 de caractere";
                    res.json(ans);
                }else{
                    //check if passwords match
                    if(userData.newPass !== userData.confirmPass){
                        ans.error = true;
                        ans.message = "Parolele nu corespund";
                        res.json(ans);
                    }else{
                        //change password
                        var upd = User.update({_id:req.user._id}, {password: SHA256(userData.newPass).toString()}, function () {
                            if(!upd._castError){
                                ans.error = false;
                                ans.message = "Parola a fost schimbata";
                                res.json(ans);
                            }else{
                                ans.error = true;
                                ans.message = "Eroare la schimbarea parolei";
                                res.json(ans);
                            }
                        });
                    }
                }
            }
        });

    router.route('/userHomeEvents')
        .get(function (req,res) {
            Events.find({groupsID: {$in: req.user.groupsID}, start: {$gte: new Date()}, enable: {$ne: false}}).sort({start: 1}).exec(function (err, events) {
                if(err){
                    res.send(err);
                }else{
                    res.json(events);
                }
            });
        });

    router.route('/userHomeMultimedia')
        .get(function (req,res) {
            Multimedia.find({groupsID: {$in: req.user.groupsID}, enable: {$ne: false}}, function (err, multimedia) {
                if(err){
                    res.send(err);
                }else{
                    res.json(multimedia);
                }
            });
        });

    router.route('/userHomeNews')

        .get(function(req, res) {
            var userGr = req.user.groupsID;
            Content.find({type: { $in: [1,2]}, groupsID: { $in: userGr}}).sort({last_updated: -1}).limit(4).exec(function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/userHomeScientific')

        .get(function(req, res) {
            var userGr = req.user.groupsID;
            Content.find({type: 3, groupsID: { $in: userGr}}).sort({last_updated: -1}).limit(4).exec(function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/products')

    .get(function(req, res) {
        Products.find(function(err, cont) {
            if(err) {
                res.send(err);
            }

            res.json(cont);
        });
    });

    router.route('/products/:id')

        .get(function(req, res) {
            Products.findById(req.params.id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
        });

    router.route('/products/productsByArea/:id')

        .get(function(req, res) {
            var test = new Array(req.params.id);
            if(test[0]!=0)
            {
                Products.find({'therapeutic-areasID': {$in :test}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                 console.log(cont);
                res.json(cont);
            })}
            else
            {
                Products.find(function(err, cont) {
                    if(err) {
                        res.send(err);
                    }

                    res.json(cont);
                });
            }
        });

    router.route('/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/userGroup')

        .get(function(req, res) {
            UserGroup.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        });

    router.route('/userGroup/:group_id')

        .get(function(req, res) {
            UserGroup.findById(req.params.group_id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
        });
    router.route('/calendar')
        .get(function(req,res) {
            User.findOne({username: {$regex: new RegExp("^" + req.user.username, "i")}}, function (err, usr) {
                if (err) {
                    console.log(err);
                    res.send(err)
                }
                else {
                    Events.find({groupsID: {$in: usr.groupsID}}, function (err, cont) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(cont);
                    }).limit(50);
                }
            })
        });
    router.route('/calendar/:id')
        .get(function(req,res){
            Events.findById(req.params.id,function(err, cont) {
                if(err) {
                    res.send(err);
                }
                console.log(cont);
                res.json(cont);
            });

        });
    router.route('/multimedia2/:idd')
        .get(function(req,res){
            Multimedia.findById(req.params.idd,function(err, cont) {
                if(err) {
                    res.json(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia')
        .get(function(req,res){
            Multimedia.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia/multimediaByArea/:id')
        .get(function(req,res){
            var findObj = {};
            if(req.params.id!=0) findObj = {'therapeutic-areasID': {$in: [req.params.id]}};
            //find all by area
            Multimedia.find(findObj, function (err, multimedia) {
                if (err) {
                    res.json(err);
                }else{
                    res.json(multimedia);
                }
            });
        });

    router.route('/slidesByMultimediaId/:multimedia_id')
        .get(function(req,res){
            Multimedia.find({_id: req.params.multimedia_id, groupsID: {$in: req.user.groupsID}, enable: {$ne: false}}, function (err, multimedia) {
                if(err){
                    res.send(err);
                }else{
                    if(multimedia[0]){
                        Slides.find({_id: {$in: multimedia[0]._doc.slidesID}}).sort({no_of_order: 1}).exec(function (err, slides) {
                            if(err){
                                res.send(err);
                            }else{
                                res.json(slides);
                            }
                        });
                    }else{
                        res.send(err);
                    }

            }

        })});

    router.route('/teste')
        .get(function(req,res){
            Teste.find(function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    //console.log(result);
                    res.json(result);
                }
            });
        });
    router.route('/teste/:id/questions/:idd')
        .get(function(req,res) {
            Teste.find({_id: req.params.id}, function (err, testR) {
                //console.log(req.params.id);
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                else {
                    var qa = {};
                    qa["test"] = testR;
                    Questions.find({_id: req.params.idd}, function (err2, cont) {
                        if (err) {
                            console.log(err);
                            res.send(err);
                            return;
                        }
                        else {
                            qa["questions"] = cont;
                            Answers.find({_id: {$in:qa["questions"][0].answersID}},function(err,cont2) {
                                if(err)
                                {
                                    res.send(err);
                                    return;
                                }
                                else {
                                    qa["answers"] = cont2;
                                    res.send(qa);
                                }
                            });
                        }
                    })
                }
            })
        })

    router.route('/user')
        .get(function(req,res){
            User.find(function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    //console.log(result);
                    res.json(result);
                }
            });
        })
        .put(function(req, res) {
        console.log(req.body.score);
        //console.log(req.user.username);
        User.findOne({ username :  { $regex: new RegExp("^" + req.user.username, "i") }},function(err,usr){
            if(err) {
                console.log(err);
                res.send(err)
            }
            else {
                //console.log(req.body.score_obtained);
                usr.points += req.body.score;
                req.user.points=usr.points;
                console.log(usr);
                usr.save(function(err){
                    if(err)
                        res.send(err);
                })
            }
        }) ;
    });
    app.use('/api', router);
};
