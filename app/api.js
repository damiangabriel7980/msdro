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
var Slides = require('./models/slides');
var Roles=require('./models/roles');
var PublicContent = require('./models/publicContent');
var PublicCategories = require('./models/publicCategories');
var PublicCarousel = require('./models/publicCarousel');
var Carousel=require('./models/carousel_Medic');
var Conferences = require('./models/conferences');
var Talks = require('./models/talks');
var Speakers = require('./models/speakers');
var Rooms = require('./models/rooms');
var Topics = require('./models/qa_topics');
var AnswerGivers = require('./models/qa_answerGivers');
var Threads = require('./models/qa_threads');
var qaMessages = require('./models/qa_messages');
var Professions = require('./models/professions');
var Presentations =require('./models/presentations');
var CM_templates =require('./models/CM_templates');
var ActivationCodes =require('./models/activationCodes');
var DPOC_Devices = require('./models/DPOC_Devices');
var Parameters = require('./models/parameters');
var JanuviaUsers = require('./models/januvia/januvia_users');
var _ = require('underscore');

//modules
var UserModule = require('./modules/user');
var MailerModule = require('./modules/mailer');
var UtilsModule = require('./modules/utils');
var SessionStorage = require('./modules/sessionStorage');

//special Products
var specialProduct = require('./models/specialProduct');
var specialProductMenu = require('./models/specialProduct_Menu');
var specialProductGlossary = require('./models/specialProduct_glossary');
var specialProductFiles = require('./models/specialProduct_files');
var specialApps = require('./models/userGroupApplications');

var SHA256   = require('crypto-js/sha256');
var SHA512   = require('crypto-js/sha512');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var request = require('request');
var AWS = require('aws-sdk');
var fs = require('fs');
var crypto   = require('crypto');
var Q = require('q');

//=========================================================================================== functions for user groups

var getNonSpecificUserGroupsIds = function(user){
    var deferred = Q.defer();
    //find all group ids with non-specific content for user
    UserGroup.distinct("_id", {_id: {$in: user.groupsID}, content_specific: {$ne: true}}).exec(function (err, ids) {
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve(ids);
        }
    });
    return deferred.promise;
};

//get content for all non content_specific groups plus one content_specific group
//if specific content group is null, get non specific content only
//tip: content_type can be injected; ex: {$in: [1,3]}
var getUserContent = function (user, content_type, specific_content_group_id, limit, sortDescendingByAttribute) {
    var deferred = Q.defer();
    //first get non specific content groups only
    getNonSpecificUserGroupsIds(user).then(
        function(arrayOfGroupsIds){
            //if we have specific content group id, add it to our array
            if(specific_content_group_id) arrayOfGroupsIds.push(specific_content_group_id.toString());
            //now get user content for our array of groups
            var myCursor = Content.find({groupsID: {$in: arrayOfGroupsIds}, enable: {$ne: false}, type: content_type});
            if(sortDescendingByAttribute){
                var attr = {};
                attr[sortDescendingByAttribute] = -1;
                myCursor = myCursor.sort(attr);
            }
            if(limit) myCursor=myCursor.limit(limit);
            myCursor.exec(function (err, content) {
                if(err){
                    deferred.reject(err);
                }else{
                    deferred.resolve(content);
                }
            });
        },
        function (err) {
            deferred.reject(err);
        });
    return deferred.promise;
};


//======================================================================================================================================= routes for admin

module.exports = function(app, env, sessionSecret, logger, amazon, router) {

    //============================================= Define injection dependent modules
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);
    var Auth = require('./modules/auth')(logger, sessionSecret);
    var NewsletterModule = require('./modules/newsletter')(env, logger);


    //only logged in users can access a route
    app.all("/api/*", Auth.isLoggedIn, function(req, res, next) {
        next(); // if the middleware allowed us to get here,
        // just move on to the next route handler
    });

    //only admin can access "/admin" routes
    app.all("/api/admin/*", Auth.hasAdminRights, function(req, res, next) {
        next(); // if the middleware allowed us to get here,
        // just move on to the next route handler
    });

    //================================================================================================================= ADMIN ROUTES

    //===== get temporary credentials for S3
    router.route('/admin/s3tc')
        .get(function (req, res) {
            amazon.getS3Credentials(req.user.username, function(err, data){
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, data);
                }
            });
        });
    //======================================

    //===== get app version
    router.route('/admin/appVersion')

        .get(function (req, res) {
            var spawn   = require('child_process').spawn,
                tag_cmd = spawn('git', ['describe', '--tags']);

            var tag;

            tag_cmd.stdout.on('data', function (data) {
                tag = data.toString();
            });

            tag_cmd.stderr.on('data', function (err) {
                handleError(res, err);
            });

            tag_cmd.on('close', function (code) {
                if(code === 0) handleSuccess(res, tag);
            });

        });
    //======================================


    router.route('/admin/users/groups')

        .get(function(req, res) {
            if(req.query.id){
                UserGroup.findOne({_id: req.query.id}).populate('profession').exec(function(err, cont) {
                    if(err || !cont) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,cont);
                    }
                });
            }else{
                UserGroup.find({}, {display_name: 1, description: 1, profession: 1, restrict_CRUD: 1}).populate('profession').exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,cont);
                    }
                });
            }
        })
        .post(function (req, res) {
            var toCreate = req.body.toCreate;
            var users = req.body.users || [];
            toCreate = new UserGroup(toCreate);
            
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    User.update({_id: {$in: users}}, {$addToSet: {groupsID: saved._id}}, {multi: true}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res,{created: saved, updated: wRes});
                        }
                    });
                }
            });
        })
        .put(function (req, res) {
            UserGroup.findOne({_id: req.query.id}, function (err, oldGroup) {
                if(err || !oldGroup){
                    handleError(res,err,500);
                }else{
                    var dataToUpdate = req.body.toUpdate;
                    
                    if(dataToUpdate.profession) delete dataToUpdate.profession; //do not allow changing group profession
                    if(oldGroup.restrict_CRUD){
                        if(dataToUpdate.display_name) delete dataToUpdate.display_name; //do not allow changing group name
                    }
                    
                    var users = req.body.users || [];
                    UserGroup.update({_id: req.query.id}, {$set: dataToUpdate}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else if(users.length != 0){
                            //disconnect previous users
                            User.update({}, {$pull: {groupsID: req.query.id}}, {multi: true}, function (err, wres) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    //connect new users
                                    User.update({_id: {$in: users}}, {$addToSet: {groupsID: req.query.id}}, {multi: true}, function (err, wres) {
                                        if(err){
                                            handleError(res,err,500);
                                        }else{
                                            handleSuccess(res,{connectedUsers: wres});
                                        }
                                    });
                                }
                            });
                        }else{
                            handleSuccess(res,{connectedUsers: 0});
                        }
                    });
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            UserGroup.findOne({_id: idToDelete}, function (err, group) {
                if(err || !group){
                    handleError(res,err,500);
                }else if(group.restrict_CRUD){
                    handleError(res,err,500);
                }else{
                    //disconnect users from group
                    User.update({}, {$pull: {groupsID: idToDelete}}, {multi: true}, function (err, wres) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            //remove group
                            UserGroup.remove({_id: idToDelete}, function (err, wres) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    handleSuccess(res, {}, 4);
                                }
                            });
                        }
                    });
                }
            });
        });

    router.route('/admin/users/professions')

        .get(function(req, res) {
            Professions.find({}, function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res,cont);
            });
        });

    router.route('/admin/users/users')

        .get(function(req, res) {
            if(req.query.group){
                var id = req.query.group;
                User.find({groupsID: {$in:[id]}}, {username: 1}).limit(0).exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,cont);
                    }
                });
            }else{
                User.find({}, {username: 1}).limit(0).exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,cont);
                    }
                });
            }
        });

    router.route('/admin/users/publicContent')

        .get(function(req, res) {
            if(req.query.id){
                PublicContent.findOne({_id: req.query.id}).populate('therapeutic-areasID').exec(function (err, cont) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        if(cont){
                            handleSuccess(res,cont);
                        }else{
                            handleError(res,err,404,1);
                        }
                    }
                })
            }else{
                PublicContent.find({}, {title: 1, author: 1, text:1, type:1, 'therapeutic-areasID':1, enable:1, date_added: 1} ,function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else
                        handleSuccess(res,cont);
                });
            }
        })
        .post(function(req,res){
            var data = req.body.data;
            //validate author and title
            var patt = UtilsModule.regexes.authorAndTitle;
            if(!patt.test(data.title.toString()) || !patt.test(data.author.toString())){
                handleError(res,null,400,20);
            }else{
                //validate type
                if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                    handleError(res,null,400,21);
                }else{
                    var content = new PublicContent(data);
                    content.save(function (err, inserted) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {}, 2);
                        }
                    });
                }
            }
        })
        .put(function(req,res){
            if(req.body.info){
                PublicContent.update({_id: req.query.id}, {enable: !req.body.info.isEnabled}, function (err, wRes) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {}, 3);
                    }
                });
            }else{
                var data = req.body.toUpdate;
                var id = req.query.id;
                //validate author and title
                var patt = UtilsModule.regexes.authorAndTitle;
                if(!patt.test(data.title.toString()) || !patt.test(data.author.toString())){
                    handleError(res,null,400,20);
                }else{
                    //validate type
                    if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                        handleError(res,null,400,21);
                    }else{
                        PublicContent.update({_id: id}, {$set: data}, function (err, wRes) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                handleSuccess(res, {}, 3);
                            }
                        });
                    }
                }
            }

        })
        .delete(function(req,res){
            var content_id = req.query.id;
            PublicContent.remove({_id: content_id}, function (err, success) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 4);
                }
            });
        });
    router.route('/admin/users/publicContent/changeImageOrFile')
        .post(function (req,res) {
            var data = req.body.data;
            var qry = {};
            var ok = true;
            if(data.type === "image"){
                qry['image_path'] = data.path;
            }else{
                if(data.type === "file"){
                    qry['file_path'] = data.path;
                }else{
                    ok = false;
                    handleError(res,null,400,22);
                }
            }
            if(ok){
                PublicContent.update({_id:data.id}, qry, function (err, wRes) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {updated: wRes}, 3);
                    }
                });
            }
        });

    router.route('/admin/users/publicContent/categories')
        .get(function (req, res) {
            PublicCategories.find(function (err, categories) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, categories);
                }
            });
        })
        .post(function (req, res) {
            var category = new PublicCategories(req.body);
            category.save(function (err, saved) {
                if(err){
                    if(err.code == 11000 || err.code == 11001){
                        handleError(res,null,400,23);
                    }else if(err.name == "ValidationError"){
                        handleError(res,null,400,24);
                    }else{
                        handleError(res,err,500);
                    }
                }else{
                    handleSuccess(res);
                }
            });
        })
        .put(function (req, res) {
            PublicCategories.findOne({_id: req.query.id}, function (err, category) {
                if(err){
                    handleError(res,err,500);
                }else{
                    if(req.body.data){
                        var data = req.body.data;
                        var qry = {};
                        var ok = true;
                        if(data.type === "image"){
                            qry['image_path'] = data.path;
                        }else{
                           ok = false;
                           handleError(res,null,400,22);
                        }
                        if(ok){
                            PublicCategories.update({_id:data.id}, {$set: qry}, function (err, wRes) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    handleSuccess(res, {updated: wRes}, 3);
                                }
                            });
                        }
                    }else{
                        if(req.body.name) category.name = req.body.name;
                        if(typeof req.body.isEnabled === "boolean") category.isEnabled = req.body.isEnabled;
                        category.description = req.body.description;
                        category.last_updated = new Date();
                        category.save(function (err, saved) {
                            if(err){
                                if(err.code == 11000 || err.code == 11001){
                                    handleError(res,null,400,23);
                                }else if(err.name == "ValidationError"){
                                    handleError(res,null,400,24);
                                }else{
                                    handleError(res,err,500);
                                }
                            }else{
                                handleSuccess(res);
                            }
                        });
                    }
                }
            });
        })
        .delete(function (req, res) {
            var image_id = ObjectId(req.query.id);
            //find image to remove from amazon
            PublicCategories.find({_id: image_id}, {image_path: 1}, function (err, category) {
                if(err){
                    handleError(res,err,500);
                }else{
                    if(category[0]){
                        var imageS3 = category[0].image_path;
                        //remove from database
                        PublicCategories.remove({_id: image_id}, function (err, success) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                //remove image from amazon
                                if(imageS3){
                                    amazon.deleteObjectS3(imageS3, function (err, data) {
                                        if(err){
                                            handleError(res,null,409,4);
                                        }else{
                                            PublicContent.update({category: image_id}, {$set: {category: null}}, function (err, wres) {
                                                if(err){
                                                    handleError(res,err,500);
                                                }else{
                                                    handleSuccess(res);
                                                }
                                            });
                                        }
                                    });
                                }else{
                                    PublicContent.update({category: image_id}, {$set: {category: null}}, function (err, wres) {
                                        if(err){
                                            handleError(res,err,500);
                                        }else{
                                            handleSuccess(res);
                                        }
                                    });
                                }
                            }
                        });
                    }else{
                        handleError(res,null,404,1);
                    }
                }
            });
        });

    router.route('/admin/users/carouselPublic')

        .get(function(req, res) {
            if(req.query.id){
                PublicCarousel.findOne({_id: req.query.id}).populate("links.content").exec(function (err, cont) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        if(cont){
                            handleSuccess(res, cont);
                        }else{
                            handleError(res,null,404,1);
                        }
                    }
                })
            }else{
                PublicCarousel.find({}).populate('links.content').exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else
                        handleSuccess(res, cont);
                });
            }
        })
        .post(function(req,res){
            var img = new PublicCarousel({
                title: "Untitled",
                enable: false,
                order_index: 0
            });
            img.save(function (err, inserted) {
                if(err){
                    handleError(res);
                }else{
                    handleSuccess(res, inserted);
                }
            });
        })
        .put(function(req,res){
            PublicCarousel.update({_id: req.query.id}, {$set: req.body}, function (err, wRes) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res);
                }
            });
        })
        .delete(function(req,res){
            var image_id = req.query.id;
            //find image to remove from amazon
            PublicCarousel.findOne({_id: image_id}, {image_path: 1}, function (err, image) {
                if(err){
                    handleError(res,err,500);
                }else{
                    if(image){
                        var imageS3 = image.image_path;
                        //remove from database
                        PublicCarousel.remove({_id: image._id}, function (err, success) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                //remove image from amazon
                                if(imageS3){
                                    amazon.deleteObjectS3(imageS3, function (err, data) {
                                        if(err){
                                            handleError(res,null,409,4);
                                        }else{
                                            handleSuccess(res, {}, 5);
                                        }
                                    });
                                }else{
                                    handleSuccess(res, {}, 6);
                                }
                            }
                        });
                    }else{
                        handleError(res,null,404,1);
                    }
                }
            });
        });
    router.route('/admin/users/carouselPublic/contentByType')
        .get(function(req, res) {
            PublicContent.find({type: req.query.type}, {title: 1, type:1}).sort({title: 1}).exec(function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });

    //Carousel Medic
    //===============================================================================================

    router.route('/admin/users/carouselMedic')

        .get(function(req, res) {
            if(req.query.id){
                Carousel.findOne({_id: req.query.id}).populate("article_id").exec(function (err, cont) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        if(cont){
                            handleSuccess(res, cont);
                        }else{
                            handleError(res,null,404,1);
                        }
                    }
                })
            }else{
                Carousel.find({}).deepPopulate('article_id.groupsID').exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else
                        handleSuccess(res, cont);
                });
            }
        })
        .post(function(req,res){
            var data = req.body.data.toAdd;
            var ext = req.body.data.extension;
            //validate type
            if(!(typeof data.type === "number" && data.type>0 && data.type<4)){
                handleError(res,null,400,21);
            }else{
                //check if content_id exists
                if(typeof data.article_id === "string" && data.article_id.length === 24){
                    var img = new Carousel(data);
                    img.save(function (err, inserted) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            //update image_path
                            var imagePath = "carousel/medic/image_"+inserted._id+"."+ext;
                            Carousel.update({_id: inserted._id}, {$set:{image_path: imagePath}}, function (err, wRes) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    handleSuccess(res, {key: imagePath}, 2);
                                }
                            });
                        }
                    });
                }else{
                    handleError(res,null,400,3);
                }
            }
        })
        .put(function(req,res){
            if(req.body.info){
                Carousel.update({_id: req.query.id}, {$set:{enable: !req.body.info.isEnabled}}, function (err, wRes) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {}, 3);
                    }
                });
            }else{
                if(req.body.data.imagePath){
                    var data = req.body.data;
                    Carousel.update({_id: req.query.id}, {$set:{image_path: data.imagePath}}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {}, 3);
                        }
                    });
                }else{
                    var data = req.body.data.toUpdate;
                    var id = req.query.id;
                    //validate type
                    if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                        handleError(res,null,400,21);
                    }else{
                        //check if content_id exists
                        if(typeof data.article_id === "string" && data.article_id.length === 24){
                            Carousel.update({_id: id}, {$set:data}, function (err, wRes) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    handleSuccess(res, {}, 3);
                                }
                            });
                        }else{
                            handleError(res,null,400,3);
                        }
                    }
                }
            }
        })
        .delete(function(req,res){
            var image_id = req.query.id;
            //find image to remove from amazon
            Carousel.find({_id: image_id}, {image_path: 1}, function (err, image) {
                if(err){
                    handleError(res,err,500);
                }else{
                    if(image[0]){
                        var imageS3 = image[0].image_path;
                        //remove from database
                        Carousel.remove({_id: image_id}, function (err, success) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                //remove image from amazon
                                if(imageS3){
                                    amazon.deleteObjectS3(imageS3, function (err, data) {
                                        if(err){
                                            handleError(res,null,409,4);
                                        }else{
                                            handleSuccess(res, {}, 5);
                                        }
                                    });
                                }else{
                                    handleSuccess(res, {}, 6);
                                }
                            }
                        });
                    }else{
                        handleError(res,null,404,1);
                    }
                }
            });
        });

    router.route('/admin/users/carouselMedic/contentByType')
        .get(function(req, res) {
            Content.find({type: req.query.type}, {title: 1, type:1}).sort({title: 1}).exec(function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });

    router.route('/admin/products')
        .get(function(req, res) {
            if(req.query.id){
                Products.findOne({_id: req.query.id}).populate("therapeutic-areasID").populate('groupsID').exec(function(err, product) {
                    if (err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, product);
                    }
                });
            }else{
                Products.find({}).populate("therapeutic-areasID").populate('groupsID').exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }
                    else{
                        handleSuccess(res, cont);
                    }
                });
            }
        })
        .post(function(req, res) {
            var product = new Products(req.body.product);
            product.save(function(err, saved) {
                if (err)
                    handleError(res,err,500);
                else
                    handleSuccess(res, {saved: saved}, 2);
            });
        })
        .put(function(req,res){
            if(req.body.info){
                var info = req.body.info;
                if(req.body.info.logo){
                    Products.update({_id: req.query.id}, {$set:{image_path: info.path}}, function (err, wRes) {
                        if (err) {
                            handleError(res,err,500);
                        } else {
                            handleSuccess(res, {updated: wRes}, 3);
                        }
                    });
                }else{
                    Products.update({_id:req.query.id},{$set:{file_path: info.path}}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {updated:wRes}, 3);
                        }
                    });
                }
            }else{
                var data = req.body.product;
                Products.update({_id:req.query.id},{$set:data}, function(err, product) {
                    if (err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {}, 3);
                    }
                });
            }
        })
        .delete(function(req,res){
            var id = req.query.id;
            Products.findOne({_id: id}, function (err, product) {
                if(product){
                    var s3Image = product.image_path;
                    var s3File = product.file_path;
                    //delete product
                    Products.remove({_id:id},function(err,cont) {
                        if (err){
                            handleError(res,err,500);
                        }
                        else{
                            //product was deleted. Now delete image and file if there is one
                            if(s3Image || s3File){
                                amazon.deleteObjectS3(s3Image, function (err, data) {
                                    if(err){
                                        logger.error(err);
                                        handleError(res,null,409,4);
                                    }else{
                                        amazon.deleteObjectS3(s3File, function (err, data) {
                                            if(err) {
                                                handleError(res,null,409,4);
                                            }
                                            else
                                            {
                                                handleSuccess(res, {}, 7);
                                            }
                                        });
                                    }
                                })
                            }else{
                                handleSuccess(res, {}, 4);
                            }
                        }
                    });
                }else{
                    handleError(res,err,500);
                }
            });
        });
    router.route('/admin/content')
        .get(function(req, res) {
            if(req.query.id){
                Content.findOne({_id:req.query.id}, function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, cont);
                    }
                })
            }else{
                Content.find(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }
                    else {
                        handleSuccess(res, cont);
                    }
                });
            }
        })
        .post(function(req, res) {
            var content = new Content(req.body.article);
            content.save(function(err,saved) {
                if (err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {saved: saved}, 2);
                }
            });
        })
    .put(function(req, res) {
            if(req.body.info){
                var info = req.body.info;
                if(info.image){
                    Content.update({_id:req.query.id}, {$set:{image_path: info.image}}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {updated: wRes});
                        }
                    });
                }else{
                    Content.update({_id:req.query.id}, {$set:{associated_images: info.associated_images}}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {updated: wRes});
                        }
                    });
                }
            }else{
                if(req.body.enableArticle){
                    Content.update({_id:req.query.id},{$set: {enable: req.body.enableArticle.enable}}, function(err, product) {
                        if (err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {}, 3);
                        }
                    });
                }else{
                    var data = req.body.article;
                    Content.update({_id:req.query.id},{$set:data}, function(err, product) {
                        if (err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {}, 3);
                        }
                    });
                }
            }
    })
        .delete(function(req, res) {
            var id =req.query.id;
            Content.findOne({_id: id}, function (err, content) {
                if(content){
                    var s3Key = content.image_path;
                    Content.remove({_id:id},function(err,cont) {
                        if (err){
                            handleError(res,err,500);
                        }
                        else{
                            if(s3Key){
                                amazon.deleteObjectS3(s3Key, function (err, data) {
                                    if(err){
                                        handleError(res,err,409,4);
                                    }else{
                                        handleSuccess(res, {}, 7);
                                    }
                                });
                            }else{
                                handleSuccess(res, {}, 4);
                            }
                        }
                    });
                }else{
                    handleError(res,err,404,1);
                }
            });
        });
    router.route('/admin/content/groupsByIds')
        .post(function (req, res) {
            var ids = req.body.ids || [];
            UserGroup.find({_id: {$in: ids}}).populate('profession').exec(function (err, groups) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, groups);
                }
            });
        });

    router.route('/admin/content/specialProducts/products')
        .get(function (req, res) {
            var q = {};
            if(req.query.id){
                q._id = req.query.id;
            }
            specialProduct.find(q).deepPopulate('groups.profession').exec(function (err, products) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, products);
                }
            })
        })
        .post(function (req, res) {
            var toCreate = new specialProduct(req.body.toCreate);
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {justSaved: saved}, 2);
                }
            });
        })
        .put(function (req, res) {
            specialProduct.update({_id: req.query.id}, {$set: req.body}, function (err, wRes) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 3);
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            var attachedCount = 0;
            //remove documents attached to this product async
            async.each([specialProductMenu, specialProductFiles, specialProductGlossary], function (collection, callback) {
                collection.remove({product: idToDelete}, function (err, count) {
                    if(err){
                        callback(err);
                    }else{
                        attachedCount += count;
                        callback();
                    }
                })
            }, function (err) {
                if(err){
                    handleError(res,err,409,5);
                }else{
                    //remove product
                    specialProduct.remove({_id: idToDelete}, function (err, count) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {deletedProducts: count, deletedConnections: attachedCount}, 4);
                        }
                    });
                }
            });
        });

    router.route('/admin/content/specialProducts/groups')
        .get(function (req, res) {
            UserGroup.find({}, {display_name: 1, profession: 1}).populate('profession').exec(function (err, groups) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, groups);
                }
            })
        });

    router.route('/admin/content/specialProducts/menu')
        .get(function (req, res) {
            if(req.query.id){
                //find one by id
                specialProductMenu.findOne({_id: req.query.id}, function (err, menuItem) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, menuItem);
                    }
                });
            }else if(req.query.product_id){
                //get full menu
                //first, find all children
                specialProductMenu.distinct("children_ids", function (err, children_ids) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        //next, get all menu items that are not children; populate their children_ids attribute
                        specialProductMenu.find({product: req.query.product_id, _id: {$nin: children_ids}}).sort({order_index: 1}).populate({path: 'children_ids', options: { sort: {order_index: 1}}}).exec(function (err, menuItems) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                //now you got the full menu nicely organised
                                handleSuccess(res, menuItems);
                            }
                        });
                    }
                });
            }else{
                handleError(res,err,400,6);
            }
        })
        .post(function (req, res) {
            var menu = new specialProductMenu(req.body);
            menu.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {saved: saved});
                }
            })
        })
        .put(function (req, res) {
            specialProductMenu.update({_id: req.query.id}, {$set: req.body}, function (err, wRes) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 3);
                }
            })
        })
        .delete(function (req, res) {
            var deleteCount = 0;
            var idToDelete = ObjectId(req.query.id);
            specialProductMenu.findOne({_id: idToDelete}, function (err, item) {
                if(err){
                    handleError(res,err,500);
                }else{
                    var arrayIdsToDelete = [idToDelete];
                    if(item.children_ids){
                        arrayIdsToDelete = arrayIdsToDelete.concat(item.children_ids);
                        
                    }
                    specialProductMenu.remove({_id: {$in: arrayIdsToDelete}}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            deleteCount = wRes;
                            //disconnect from parent
                            specialProductMenu.update({}, {$pull: {children_ids: idToDelete}}, function (err, wRes) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    handleSuccess(res, {deleteCount: deleteCount, updateCount: wRes}, 4);
                                }
                            });
                        }
                    })
                }
            });
        });

    router.route('/admin/content/specialProducts/addMenuChild')
        .put(function (req, res) {
            specialProductMenu.update({_id: req.query.id}, {$addToSet: {children_ids: req.body.child_id}}, function (err, wRes) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 3);
                }
            })
        });

    router.route('/admin/content/specialProducts/glossary')
        .get(function (req, res) {
            var q = {};
            if(req.query){
                q = req.query;
            }
            specialProductGlossary.find(q, function (err, glossary) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, glossary);
                }
            })
        })
        .post(function (req, res) {
            var toAdd = new specialProductGlossary(req.body);
            toAdd.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {saved: saved});
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = req.query.id;
            if(!idToUpdate){
                handleError(res,err,400,6);
            }else{
                specialProductGlossary.update({_id: idToUpdate}, {$set: req.body}, function (err, wRes) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {updateCount: wRes}, 3);
                    }
                });
            }
        })
        .delete(function (req, res) {
            var idToDelete = req.query.id;
            if(!idToDelete){
                handleError(res,err,400,6);
            }else{
                specialProductGlossary.remove({_id: idToDelete}, function (err, wRes) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {removeCount: wRes}, 4);
                    }
                });
            }
        });

    router.route('/admin/content/specialProducts/resources')
        .get(function (req, res) {
            var q = {};
            if(req.query){
                q = req.query;
            }
            specialProductFiles.find(q, function (err, resources) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {resources: resources});
                }
            })
        })
        .post(function (req, res) {
            var toAdd = new specialProductFiles(req.body);
            toAdd.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {saved: saved}, 2);
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            if(!idToUpdate){
                handleError(res,err,400,6);
            }else{
                specialProductFiles.update({_id: idToUpdate}, {$set: req.body}, function (err, wres) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {updateCount: wres}, 3);
                    }
                });
            }
        })
        .delete(function (req, res) {
            specialProductFiles.remove({_id: req.query.id}, function (err, wres) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {removeCount: wres}, 4);
                }
            });
        });

    router.route('/admin/content/specialProducts/speakers')
        .get(function (req, res) {
            if(req.query.product){
                specialProduct.findOne({_id: req.query.product}).populate('speakers').exec(function (err, product) {
                    if(err) {
                        handleError(res,err,500);
                    }else if(!product){
                        handleError(res,err,404,1);
                    }else{
                        handleSuccess(res, product.speakers);
                    }
                });
            }else if(req.query.id){
                Speakers.findOne({_id: req.query.id}, function (err, speaker) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, speaker);
                    }
                });
            }else{
                Speakers.find({}).sort({last_name: 1, first_name: 1}).exec(function (err, speakers) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, speakers);
                    }
                });
            }
        })
        .post(function (req, res) {
            var speaker_id = ObjectId(req.body.speaker_id);
            var product_id = ObjectId(req.body.product_id);
            specialProduct.update({_id: product_id}, {$addToSet: {speakers: speaker_id}}, function (err, wres) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, wres);
                }
            });
        })
        .delete(function (req, res) {
            var speaker_id = ObjectId(req.query.speaker_id);
            var product_id = ObjectId(req.query.product_id);
            specialProduct.update({_id: product_id}, {$pull: {speakers: speaker_id}}, function (err, wres) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, wres);
                }
            });
        });

    router.route('/admin/content/specialApps/apps')
        .get(function (req, res) {
            if(req.query.id){
                specialApps.findOne({_id: req.query.id}).deepPopulate('groups.profession').exec(function (err, app) {
                    if(err || !app){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, app);
                    }
                });
            }else{
                specialApps.find({}).deepPopulate('groups.profession').exec(function (err, apps) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, apps);
                    }
                });
            }
        })
        .post(function (req, res) {
            var toSave = new specialApps(req.body);
            toSave.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            var idToEdit = ObjectId(req.query.id);
            specialApps.update({_id: idToEdit}, {$set: req.body}, function (err, wres) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, wres);
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            specialApps.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, wres);
                }
            });
        });

    router.route('/admin/content/specialApps/groups')
        .get(function (req, res) {
            UserGroup.find({content_specific: true}).populate('profession').exec(function (err, groups) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, groups);
                }
            });
        });

    router.route('/admin/events/events')
        .get(function (req, res) {
            if(req.query.id){
                Events.findOne({_id: req.query.id}).select('-listconferences').populate('groupsID').exec(function (err, event) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, event);
                    }
                });
            }else{
                Events.find({}, function (err, events) {
                    if(err){
                        handleError(res,err);
                    }else{
                        handleSuccess(res, events);
                    }
                });
            }
        })
        .post(function (req, res) {
            var toCreate = new Events(req.body);
            toCreate.last_updated = Date.now();
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res,err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            Events.update({_id: idToUpdate}, {$set: req.body}, function (err, wres) {
                if(err){
                    handleError(res,err);
                }else{
                    handleSuccess(res,{updateCount: wres},3);
                }
            });
        })
        .delete(function (req, res) {
            //get event details
            Events.findOne({_id: req.query.id}, function (err, event) {
                if(err){
                    handleError(res,err);
                }else{
                    var conferencesIds = event.listconferences || [];
                    //delete conferences for this event
                    //delete rooms for this event
                    //delete talks for all conferences of this event
                    //remove event itself
                    async.parallel([
                        function (callback) {
                            Conferences.remove({_id: {$in: conferencesIds}}, function (err, wres) {
                                callback(err?err:null);
                            });
                        },
                        function (callback) {
                            Rooms.remove({event: event._id}, function (err, wres) {
                                callback(err?err:null);
                            });
                        },
                        function (callback) {
                            Talks.remove({conference: {$in: conferencesIds}}, function (err, wres) {
                                callback(err?err:null);
                            });
                        },
                        function (callback) {
                            Events.remove({_id: event._id}, function (err, wres) {
                                callback(err?err:null);
                            });
                        }
                    ], function (err) {
                        if(err) {
                            handleError(res,err);
                        }else{
                            handleSuccess(res);
                        }
                    });
                }
            });
        });

    router.route('/admin/events/speakers')
        .get(function (req, res) {
            if(req.query.id){
                Speakers.findOne({_id: req.query.id}, function (err, speaker) {
                    if(err){
                        handleError(res,err);
                    }else{
                        handleSuccess(res, speaker);
                    }
                });
            }else{
                Speakers.find({}).sort({last_name: 1, first_name: 1}).exec(function (err, speakers) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, speakers);
                    }
                });
            }
        })
        .post(function (req, res) {
            var toCreate = new Speakers(req.body);
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            var idToEdit = ObjectId(req.query.id);
            Speakers.update({_id: idToEdit}, {$set: req.body}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, {updateCount: wres}, 3);
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            Speakers.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    //remove speaker from talks
                    Talks.update({}, {$pull: {speakers: idToDelete}}, function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res,{},4);
                        }
                    });
                }
            });
        });

    router.route('/admin/events/conferences')
        .get(function (req, res) {
            if(req.query.event){
                Events.findOne({_id: req.query.event}).populate('listconferences').exec(function (err, event) {
                    if(err || !event){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, event.listconferences||[]);
                    }
                });
            }else if(req.query.id){
                Conferences.findOne({_id: req.query.id}).exec(function (err, conference) {
                    if(err || !conference){
                        handleError(res, err);
                    }else{
                        handleSuccess(res,conference);
                    }
                });
            }else{
                Conferences.find({}, function (err, conferences) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, conferences);
                    }
                });
            }
        })
        .post(function (req, res) {
            var toCreate = new Conferences(req.body);
            toCreate.last_updated = Date.now();
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    //create qr_code
                    saved.qr_code = {
                        conference_id: saved._id,
                        message: "untitled",
                        type: 2
                    };
                    saved.save(function (err, saved) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, saved);
                        }
                    });
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            var dataToUpdate = req.body;
            dataToUpdate.last_updated = Date.now();
            Conferences.update({_id: idToUpdate}, {$set: dataToUpdate}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res,{updateCount: wres},3);
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            //remove talks for this conference
            //remove conference
            //disconnect conference from events
            async.parallel([
                function (callback) {
                    Events.update({}, {$pull: {listconferences: idToDelete}}, {multi: true}, function (err, wres) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },
                function (callback) {
                    Conferences.remove({_id: idToDelete}, function (err, wres) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },
                function (callback) {
                    Talks.remove({conference: idToDelete}, function (err, wres) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    });
                }
            ], function (err) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        });

    router.route('/admin/events/rooms')
        .get(function (req, res) {
            if(req.query.event){
                var idEvent = ObjectId(req.query.event);
                Rooms.find({event: idEvent}).exec(function (err, rooms) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, rooms);
                    }
                });
            }else if(req.query.id){
                Rooms.findOne({_id: req.query.id}).exec(function (err, room) {
                    if(err || !room){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, room);
                    }
                });
            }else{
                handleError(res,false,400,6);
            }
        })
        .post(function (req, res) {
            var toCreate = new Rooms(req.body);
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    //create qr_code
                    saved.qr_code = {
                        room_id: saved._id,
                        message: "untitled",
                        type: 1
                    };
                    saved.save(function (err, saved) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, saved);
                        }
                    });
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            var dataToUpdate = req.body;
            Rooms.update({_id: idToUpdate}, {$set: dataToUpdate}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res,{updateCount: wres},3);
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            //remove room; remove from and talks as well
            async.parallel([
                function (callback) {
                    Rooms.remove({_id: idToDelete}, function (err, wres) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    });
                },
                function (callback) {
                    Talks.update({room: idToDelete}, {$set: {room: null}}, {multi: true}, function (err, wres) {
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    });
                }
            ], function (err) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });

        });

    router.route('/admin/events/talks')
        .get(function (req, res) {
            if(req.query.conference){
                var idConference = ObjectId(req.query.conference);
                Talks.find({conference: idConference}).exec(function (err, talks) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res,talks);
                    }
                });
            }else if(req.query.id){
                var idTalk = ObjectId(req.query.id);
                Talks.findOne({_id: idTalk}).populate('speakers').exec(function (err, talk) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, talk);
                    }
                });
            }else{
                handleError(res,true,400,6);
            }
        })
        .post(function (req, res) {
            var toCreate = new Talks(req.body);
            toCreate.last_updated = Date.now();
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            var dataToUpdate = req.body;
            dataToUpdate.last_updated = Date.now();
            Talks.update({_id: idToUpdate}, {$set: req.body}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res,{updateCount: wres},3);
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            Talks.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, {deleteCount: wres}, 4);
                }
            });
        });

    router.route('/admin/events/conferenceToEvent')
        .post(function (req, res) {
            var eventToUpdate = ObjectId(req.query.idEvent);
            var conferenceToAdd = ObjectId(req.body.idConference);
            Events.update({_id: eventToUpdate}, {$addToSet: {listconferences: conferenceToAdd}}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, {updateCount: wres}, 3);
                }
            });
        });

    router.route('/admin/multimedia')
        .get(function(req, res) {
            if(req.query.id){
                Multimedia.findOne({_id: req.query.id}).populate("therapeutic-areasID").populate('groupsID').exec(function(err, product) {
                    if (err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, product);
                    }
                });
            }else{
                Multimedia.find(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }
                    else
                    {
                        handleSuccess(res, cont);
                    }
                });
            }
        })
        .post(function (req, res) {
            var toCreate = new Multimedia(req.body.newMultimedia);
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {justSaved: saved}, 2);
                }
            });
        })
        .put(function (req, res) {
            if(req.body.info){
                var data = req.body.info;
                if(data.image){
                    Multimedia.update({_id: req.query.id}, {thumbnail_path: data.image}, function (err, wRes) {
                        if (err) {
                            handleError(res,err,500);
                        } else {
                            handleSuccess(res, {updated: wRes}, 3);
                        }
                    });
                }else{
                    Multimedia.update({_id:req.query.id}, {file_path: data.video}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {updated:wRes}, 3);
                        }
                    });
                }
            }else{
                if(req.body.enableMultimedia){
                    Multimedia.update({_id: req.query.id},{$set:{enable: req.body.enableMultimedia.isEnabled}}).exec(function (err, presentation) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {}, 3);
                        }
                    });
                }else{
                    Multimedia.update({_id: req.query.id}, {$set: req.body.multimedia}, function (err, wRes) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {}, 3);
                        }
                    });
                }
            }
        })
        .delete(function(req, res) {
            var id = req.query.id;
            Multimedia.findOne({_id: id}, function (err, multimedia) {
                if(multimedia){
                    var s3Image = multimedia.thumbnail_path;
                    var s3File = multimedia.file_path;
                    //delete multimedia
                    Multimedia.remove({_id:id},function(err,cont) {
                        if (err){
                            handleError(res,err,500);
                        }
                        else{
                            //multimedia was deleted. Now delete image and file if there is one
                            if(s3Image || s3File){
                                amazon.deleteObjectS3(s3Image, function (err, data) {
                                    if(err){
                                        handleError(res,err,409,4);
                                    }else{
                                        amazon.deleteObjectS3(s3File, function (err, data) {
                                            if(err) {
                                                handleError(res,err,409,4);
                                            }
                                            else
                                            {
                                                handleSuccess(res, {}, 7);
                                            }
                                        });
                                    }
                                })
                            }else{
                                handleSuccess(res, {}, 4);
                            }
                        }
                    });
                }else{
                    handleError(res,err,404,1);
                }
            });
        });
    router.route('/admin/areas')

        .get(function(req, res) {
            if(req.query.id){
                Therapeutic_Area.findById(req.query.id).exec(function(err, area) {
                    if(err || !area) {
                        handleError(res, err, 500);
                    }else{
                        handleSuccess(res, area);
                    }
                })
            }else{
                var q = {};
                if(req.query.parentsOnly) q['$or'] = [{'therapeutic-areasID': {$size: 0}}, {'therapeutic-areasID': null}];
                if(req.query.exclude) q = {$and: [q, {'_id': {$nin: [req.query.exclude]}}]};
                Therapeutic_Area.find(q, function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, cont);
                    }
                });
            }
        })
        .post(function(req, res) {
            var therapeutic = new Therapeutic_Area(req.body);
            therapeutic.enabled = true;
            therapeutic.last_updated = Date.now();
            therapeutic.save(function(err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res);
                }
            });
        })
        .put(function(req, res) {
            var area = req.body;
            area.last_updated = Date.now();
            Therapeutic_Area.update({_id: area._id}, {$set: area}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        })
        .delete(function(req, res) {
            var data = req.query.id;
            var dataArray = [req.query.id];
            var connEntities=[Products,Multimedia];
            async.each(connEntities,function(item,callback){
                item.update({},{$pull: {'therapeutic-areasID': dataArray}}, {multi: true}, function(err,wRes){
                    if(err){
                        callback(err);
                    }else{
                        callback();
                    }
                })
            },function(err){
                if(err){
                    handleError(res,err,409,5);
                }
                else
                {
                    Therapeutic_Area.remove({$or :[{_id: data},{'therapeutic-areasID': {$in: dataArray}}]}, function(err,cont) {
                        if (err)
                            handleError(res,err,500);
                        else
                            handleSuccess(res, {}, 4);
                    });
                }
            });
        });
    router.route('/admin/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });


    router.route('/admin/applications/qa/topics')
        .get(function (req, res) {
            Topics.find({}, function (err, topics) {
                if(err){
                    res.send(err);
                }else{
                    res.json(topics);
                }
            });
        })
        .post(function (req, res) {
            var name = req.body.name;
            //validate name
            var namePatt = UtilsModule.regexes.streetName;
            if(!namePatt.test(name)){
                res.send({message: {type: 'danger', text: 'Numele este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
            }else{
                //check if topic already exists
                Topics.findOne({name: name}, function (err, topic) {
                    if(err){
                        res.send({message: {type: 'danger', text: 'Eroare la adaugarea topicului. Verificati numele'}});
                    }else{
                        if(topic){
                            res.send({message: {type: 'danger', text: 'Topicul exista deja'}});
                        }else{
                            //add topic
                            var toAdd = new Topics({name: name});
                            toAdd.save(function (err, saved) {
                                if(err){
                                    res.send({message: {type: 'danger', text: 'Eroare la salvare'}});
                                }else{
                                    res.send({message: {type: 'success', text: 'Topicul a fost salvat'}});
                                }
                            });
                        }
                    }
                });
            }
        })
        .put(function (req, res) {
            var id = req.body.id;
            var name = req.body.name;
            //validate name
            var namePatt = UtilsModule.regexes.streetName;
            if(!namePatt.test(name)){
                res.send({message: {type: 'danger', text: 'Numele este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
            }else{
                //check if topic already exists
                Topics.findOne({name: name}, function (err, topic) {
                    if(err){
                        res.send({message: {type: 'danger', text: 'Eroare la modificarea topicului. Verificati numele'}});
                    }else{
                        if(topic){
                            res.send({message: {type: 'danger', text: 'Un topic cu acest nume exista deja'}});
                        }else{
                            //update topic
                            Topics.update({_id: id}, {$set: {name: name}}, function (err, wRes) {
                                if(err || wRes == 0){
                                    res.send({message: {type: 'danger', text: 'Eroare la actualizare. Verificati numele'}});
                                }else{
                                    res.send({message: {type: 'success', text: 'Topicul a fost modificat'}});
                                }
                            });
                        }
                    }
                });
            }
        });

    router.route('/admin/applications/qa/topicById/:id')
        .get(function (req, res) {
            Topics.findOne({_id: req.params.id}, function (err, topic) {
                if(err){
                    res.send(err);
                }else{
                    res.send(topic);
                }
            });
        })
        .delete(function (req, res) {
            var id_topic = req.params.id;
            id_topic = mongoose.Types.ObjectId(id_topic.toString());

            //check if topic is used in threads
            Threads.find({topics: {$in: [id_topic]}}, function (err, threads) {
                if(err){
                    res.send({message: {type: 'danger', text: 'Eroare la stergere'}});
                }else{
                    if(threads.length != 0){
                        res.send({message: {type: 'danger', text: 'Topicul nu poate fi sters, deoarece este folosit in thread-uri'}});
                    }else{
                        //delete topic
                        Topics.remove({_id: id_topic}, function (err, wRes) {
                            if(err || wRes == 0){
                                res.send({message: {type: 'danger', text: 'Nu s-a putut sterge'}});
                            }else{
                                res.send({message: {type: 'success', text: 'Topicul a fost sters'}});
                            }
                        });
                    }
                }
            });
        });

    router.route('/admin/applications/qa/answerGivers')
        .get(function (req, res) {
            AnswerGivers.find({}).populate('id_user').exec(function (err, ag) {
                if(err){
                    res.send(err);
                }else{
                    res.json(ag);
                }
            });
        })
        .post(function (req, res) {
            if(!req.body.nickname || !req.body.id_user){
                res.send({message: {type: 'danger', text:'Toate campurile sunt obligatorii'}});
            }else{
                //check if id points to an actual user
                User.findOne({_id: req.body.id_user}, function (err, user) {
                    if(err || !user){
                        res.send({message: {type: 'danger', text:'Utilizator invalid'}});
                    }else{
                        //check if medic was already registered as answer giver
                        AnswerGivers.findOne({id_user: mongoose.Types.ObjectId(req.body.id_user.toString())}, function (err, found) {
                            if(err || found){
                                res.send({message: {type: 'danger', text:'Eroare la validare. Verificati daca medicul este deja adaugat'}});
                            }else{
                                //check nickname format
                                var nickPatt = UtilsModule.regexes.nickname;
                                if(!nickPatt.test(req.body.nickname.toString())){
                                    res.send({message: {type: 'danger', text: 'Nickname-ul este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
                                }else{
                                    //check if nickname already exists
                                    AnswerGivers.findOne({nickname: req.body.nickname}, function (err, found) {
                                        if(err || found){
                                            res.send({message: {type: 'danger', text:'Nickname-ul exista deja'}});
                                        }else{
                                            //add answer giver
                                            var toAdd = new AnswerGivers({
                                                id_user: mongoose.Types.ObjectId(req.body.id_user.toString()),
                                                nickname: req.body.nickname.toString()
                                            });
                                            toAdd.save(function (err, saved) {
                                                if(err){
                                                    res.send({message: {type: 'danger', text:'Eroare la salvare'}});
                                                }else{
                                                    res.send({message: {type: 'success', text:'Raspunzatorul a fost adaugat'}});
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        })
        .put(function (req, res) {
            var nickname = req.body.nickname?req.body.nickname.toString():"";
            //validate nickname format
            var nickPatt = UtilsModule.regexes.nickname;
            if(!nickPatt.test(nickname)){
                res.send({message: {type: 'danger', text: 'Nickname-ul este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
            }else{
                //check if nickname already exists
                AnswerGivers.findOne({nickname: nickname}, function (err, ag) {
                    if(err){
                        res.send({message: {type: 'danger', text: 'Eroare la modificarea nickname-ului'}});
                    }else if(ag){
                        res.send({message: {type: 'danger', text: 'Nickname-ul exista deja'}});
                    }else{
                        //get the answer giver we have to update; we will need it's id_user later
                        AnswerGivers.findOne({_id: req.body.id}, function (err, agToUpdate) {
                            if(err || !agToUpdate){
                                res.send({message: {type: 'danger', text: 'Eroare la modificarea nickname-ului'}});
                            }else{
                                //change nickname; change in posted messages as well
                                AnswerGivers.update({_id: req.body.id}, {$set: {nickname: nickname}}, function (err, wRes) {
                                    if(err){
                                        res.send({message: {type: 'danger', text: 'Eroare la modificarea nickname-ului'}});
                                    }else{
                                        //change in messages
                                        qaMessages.update({owner: agToUpdate.id_user}, {$set: {ownerDisplay: nickname}}, {multi: true}, function (err, wRes) {
                                            if(err){
                                                logger.warn("Modify nickname "+nickname+" for user "+agToUpdate.id_user+" in published messages:");
                                                logger.error(err);
                                                res.send({message: {type: 'danger', text: 'Nickname modificat. Eroare la modificarea nickname-ului in mesajele publicate'}});
                                            }else{
                                                res.send({message: {type: 'success', text: 'Nickname modificat. S-a actualizat in '+wRes+' mesaje publicate.'}});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    router.route('/admin/applications/qa/answerGiverById/:id')
        .get(function (req, res) {
            AnswerGivers.findOne({_id: req.params.id}, function (err, ag) {
                if(err){
                    res.send(err);
                }else{
                    res.send(ag);
                }
            });
        })
        .delete(function (req, res) {
            var id_ag = req.params.id;
            id_ag = mongoose.Types.ObjectId(id_ag.toString());

            AnswerGivers.remove({_id: id_ag}, function (err, wRes) {
                if(err || wRes == 0){
                    res.send({message: {type: 'danger', text: 'Nu s-a putut sterge'}});
                }else{
                    res.send({message: {type: 'success', text: 'Raspunzatorul a fost sters'}});
                }
            });
        });

    router.route('/admin/applications/qa/medics')
        .get(function (req, res) {
            //find medics already defined as answer givers
            AnswerGivers.find(function (err, ag) {
                if(err){
                    res.send({message: {type: 'danger', text: 'Error finding medics'}});
                }else{
                    //get user ids of answer givers
                    var medicsIds = [];
                    async.each(ag, function (item, callback) {
                        medicsIds.push(item.id_user);
                        callback();
                    }, function (err) {
                        if(err){
                            res.send({message: {type: 'danger', text: 'Error finding medics'}});
                        }else{
                            //get all medics that are not already registered as answer givers
                            User.find({_id: {$nin: medicsIds}}, {username: 1}).exec(function (err, medics) {
                                if(err){
                                    res.send({message: {type: 'danger', text: 'Error finding medics'}});
                                }else{
                                    res.json(medics);
                                }
                            });
                        }
                    });
                }
            });
        });

    router.route('/admin/applications/contractManagement/templates')
        .get(function (req, res) {
            if(req.query.id){
                CM_templates.findOne({_id: req.query.id}, function (err, template) {
                    if(err || !template){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, template);
                    }
                });
            }else{
                CM_templates.find({}, function (err, templates) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, templates);
                    }
                });
            }

        })
        .post(function (req, res) {
            var template = new CM_templates({
                name: "untitled",
                last_modified: Date.now(),
                isEnabled: false
            });
            template.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            CM_templates.update({_id: idToUpdate}, {$set: req.body}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, true, 3);
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            CM_templates.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, true, 4);
                }
            });
        });

    //=================================================================================================== DPOC

    var addDeviceDPOC = function (name, email) {
        var deferred = Q.defer();
        if(typeof name !== "string" || typeof email !== "string"){
            deferred.reject("Numele si email-ul sunt obligatorii");
        }else{
            var device = new DPOC_Devices({
                name: name,
                email: email.toLowerCase()
            });
            var code;
            var codeOK = false;
            async.whilst(
                function () {
                    return !codeOK;
                },
                function (callback) {
                    codeOK = true;
                    code = crypto.randomBytes(8).toString('base64');
                    device.code = device.generateHash(code);
                    
                    
                    device.save(function (err, saved) {
                        if(err){
                            if(err.code == 11000 || err.code == 11001){
                                var field = err.err.split(".$")[1].split("_")[0];
                                
                                if(field === "code"){
                                    codeOK = false;
                                    callback();
                                }else{
                                    callback("Un device cu acelasi nume sau email exista deja");
                                }
                            }else if(err.name == "ValidationError"){
                                callback("Toate campurile sunt obligatorii");
                            }else{
                                logger.error(err);
                                callback("Eroare la creare");
                            }
                        }else{
                            callback();
                        }
                    });
                },
                function (err) {
                    if(err){
                        deferred.reject(err);
                    }else{
                        var templateContent = [
                            {
                                "name": "name",
                                "content": device.name
                            },
                            {
                                "name": "applicationLink",
                                "content": env.dpocAppLink
                            },
                            {
                                "name": "activationCode",
                                "content": code
                            }
                        ];
                        MailerModule.send(
                            "dpoc_register",
                            templateContent,
                            [{email: device.email, name: device.name}],
                            'Activare cont DPOC'
                        ).then(
                            function (success) {
                                deferred.resolve();
                            },
                            function (err) {
                                deferred.reject("Eroare la trimitere email");
                            }
                        );
                    }
                }
            );
        }
        return deferred.promise;
    };

    router.route('/admin/applications/DPOC/devices')
        .get(function (req, res) {
            if(req.query.id){
                DPOC_Devices.findOne({_id: req.query.id}, {name: 1}, function (err, device) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, device);
                    }
                });
            }else{
                DPOC_Devices.find({}, {name: 1}, function (err, devices) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, devices);
                    }
                });
            }
        })
        .post(function (req, res) {
            
            addDeviceDPOC(req.body.name, req.body.email).then(
                function () {
                    handleSuccess(res, true, 81);
                },
                function (err) {
                    handleError(res, err);
                }
            );
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            DPOC_Devices.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        });

    router.route('/admin/applications/DPOC/importDevices')
        .post(function (req, res) {
            var processedWithErrors = [];
            async.each(req.body, function (device, callback) {
                
                addDeviceDPOC(device.name, device.email).then(
                    function () {
                        callback();
                    },
                    function (err) {
                        processedWithErrors.push({
                            device: device,
                            reason: err
                        });
                        callback();
                    }
                );
            }, function () {
                if(processedWithErrors.length == 0){
                    handleSuccess(res);
                }else{
                    handleError(res, true, 409, 12, processedWithErrors);
                }
            })
        });

    router.route('/admin/applications/januvia/users')
        .get(function (req, res) {
            if(req.query.id){
                JanuviaUsers.findOne({_id: req.query.id}).populate("city users_associated").exec(function (err, user) {
                    if(err){
                        handleError(res, err);
                    }else if(!user){
                        handleError(res, false, 404, 1);
                    }else{
                        handleSuccess(res, user);
                    }
                });
            }else{
                var q = {};
                if(req.query.type){
                    q.type = req.query.type;
                }
                JanuviaUsers.find(q, function (err, users) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, users);
                    }
                });
            }
        })
        .post(function (req, res) {
            var user = new JanuviaUsers({
                name: "Untitled",
                date_created: Date.now()
            });
            user.save(function (err, user) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, user);
                }
            });
        })
        .put(function (req, res) {
            try{
                var idToEdit = ObjectId(req.query.id);
            }catch(ex){
                return handleError(res, err);
            }
            var toEdit = req.body;
            JanuviaUsers.findOne({_id: idToEdit}, function (err, user) {
                if(err){
                    handleError(res, err);
                }else if(!user){
                    handleError(res, false, 404, 1);
                }else{
                    _.extend(user, toEdit);
                    user.save(function (err, user) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, user);
                        }
                    });
                }
            })
        })
        .delete(function (req, res) {
            JanuviaUsers.findOne({_id: req.query.id}, function (err, user) {
                if(err){
                    handleError(res, err);
                }else if(!user){
                    handleError(res, false, 404, 1);
                }else{
                    user.remove(function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            //cascade delete associations
                            JanuviaUsers.update({}, {$pull: {users_associated: user._id}}, {multi: true}).exec(function (err, wres) {
                                if(err){
                                    handleError(res, err);
                                }else{
                                    handleSuccess(res);
                                }
                            });
                        }
                    });
                }
            });
        });

    router.route('/admin/applications/januvia/user_types')
        .get(function (req, res) {
            handleSuccess(res, new JanuviaUsers().schema.path('type').enumValues);
        });

    router.route('/admin/location/counties')
        .get(function (req, res) {
            if(req.query.id){
                Counties.findOne({_id: req.query.id}, function (err, county) {
                    if(err){
                        handleError(res, err);
                    }else if(!county){
                        handleError(res, false, 404, 1);
                    }else{
                        handleSuccess(res, county);
                    }
                });
            }else if(req.query.city){
                Counties.findOne({citiesID: {$in: [req.query.city]}}, function (err, county) {
                    if(err){
                        handleError(res, err);
                    }else if(!county){
                        handleError(res, false, 404, 1);
                    }else{
                        handleSuccess(res, county);
                    }
                });
            }else{
                Counties.find({}, function (err, counties) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, counties);
                    }
                });
            }
        });

    router.route('/admin/location/cities')
        .get(function (req, res) {
            if(req.query.id){
                Cities.findOne({_id: req.query.id}, function (err, city) {
                    if(err){
                        handleError(res, err);
                    }else if(!city){
                        handleError(res, false, 404, 1);
                    }else{
                        handleSuccess(res, city);
                    }
                });
            }else if(req.query.county){
                Counties.findOne({_id: req.query.county}).populate('citiesID').exec(function (err, county) {
                    if(err){
                        handleError(res, err);
                    }else if(!county){
                        handleError(res, false, 404, 1);
                    }else{
                        handleSuccess(res, county.citiesID);
                    }
                });
            }else{
                Counties.find({}, function (err, counties) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, counties);
                    }
                });
            }
        });

    router.route('/admin/system/activationCodes/codes')
        .get(function (req, res) {
            ActivationCodes.find({}).populate('profession').exec(function (err, codes) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, codes);
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            ActivationCodes.findOne({_id: idToUpdate}).select('+value').exec(function (err, code) {
                if(err || !code){
                    handleError(res, err);
                }else{
                    ActivationCodes.update({_id: idToUpdate}, {$set: {value: SHA512(req.body.new).toString()}}, function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res);
                        }
                    });
                }
            });
        });

    router.route('/admin/system/parameters')
        .get(function (req, res) {
            Parameters.find({}).exec(function (err, params) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, params);
                }
            });
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            Parameters.findOne({_id: idToUpdate}).exec(function (err, parameter) {
                if(err || !parameter) {
                    handleError(res, err);
                }else{
                    UtilsModule.allowFields(req.body, ["default_value", "value"]);
                    Parameters.update({_id: idToUpdate}, {$set: req.body}, function (err, wres) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res);
                        }
                    });
                }
            });
        });

    router.route('/admin/users/ManageAccounts/users')
        .get(function (req, res) {
            if(req.query.id){
                User.findOne({_id: req.query.id}).select('+enabled +phone').deepPopulate('profession groupsID.profession').exec(function (err, OneUser) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, OneUser);
                    }
                })
            }else{
                User.find({state:"ACCEPTED"}).select('+enabled +phone').populate('profession').exec(function (err, users) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, users);
                    }
                })
            }
        })
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            var dataToUpdate = req.body;

            var updateUser = function () {
                User.update({_id: idToUpdate}, {$set: req.body}, function (err, wres) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res);
                    }
                });
            };

            if(dataToUpdate.username){
                User.findOne({username: UtilsModule.regexes.emailQuery(dataToUpdate.username), _id:{$ne: idToUpdate}}, function (err, user) {
                    if(err){
                        handleError(res,err,500);
                    }else if(user){
                        handleSuccess(res, {userExists: true});
                    }else{
                        updateUser();
                    }
                });
            }else{
                updateUser();
            }
        });
    
    router.route('/admin/users/ManageAccounts/professions')
        .get(function (req, res) {
            Professions.find({}).exec(function (err, professions) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, professions);
                }
            });
        });

    router.route('/admin/users/ManageAccounts/groups')
        .get(function (req, res) {
            UserGroup.find({}).populate('profession').exec(function (err, groups) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, groups);
                }
            });
        });

    router.route('/admin/users/newAccounts/state/:type')
        .get(function (req, res) {
            User.find({state: req.params.type}).select('+state +proof_path').populate('profession').exec(function (err, users) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, users);
                }
            })
        })
        .put(function (req, res) {
            if(req.params.type && req.body.id){
                User.update({_id: req.body.id}, {$set: {state: req.params.type}}, function (err, wres) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        if(req.params.type == "ACCEPTED" && wres==1){
                            //email user
                            User.findOne({_id: req.body.id}).select('+title +enabled').exec(function (err, user) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    var generateToken = function (callback) {
                                        if(user.enabled){
                                            callback(null, "");
                                        }else{
                                            crypto.randomBytes(40, function(err, buf) {
                                                if(err){
                                                    callback(err);
                                                }else{
                                                    var activationToken = buf.toString('hex');
                                                    User.update({_id: user._id}, {$set: {activationToken: activationToken}}, function (err, wres) {
                                                        if(err){
                                                            callback(err);
                                                        }else{
                                                            callback(null, activationToken);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    };
                                    generateToken(function (err, activationToken) {
                                        var emailTo = [{email: user.username, name: user.name}];
                                        var emailTemplate = "Staywell_createdAccount";
                                        if(user.enabled){
                                            emailTemplate = "Staywell_createdAccount_noActivation";
                                        }
                                        var templateContent = [
                                            {
                                                "name": "title",
                                                "content": user.getEmailTitle()
                                            },
                                            {
                                                "name": "name",
                                                "content": user.name
                                            },
                                            {
                                                "name": "activationLink",
                                                "content": 'http://' + req.headers.host + '/activateAccountStaywell/' + activationToken
                                            },
                                            {
                                                "name": "loginAddress",
                                                "content": 'http://' + req.headers.host + '/login'
                                            }
                                        ];
                                        MailerModule.send(
                                            emailTemplate,
                                            templateContent,
                                            emailTo,
                                            'Activare cont MSD'
                                        ).then(
                                            function (success) {
                                                handleSuccess(res, {updateCount: wres}, 8);
                                            },
                                            function (err) {
                                                handleError(res,err,500);
                                            }
                                        );
                                    });
                                }
                            });
                        }else if(req.params.type == "REJECTED" && wres==1){
                            //email user
                            User.findOne({_id: req.body.id}).select('+title').exec(function (err, user) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    var emailTo = [{email: user.username, name: user.name}];
                                    var templateContent = [
                                        {
                                            "name": "title",
                                            "content": user.getEmailTitle()
                                        },
                                        {
                                            "name": "name",
                                            "content": user.name
                                        }
                                    ];
                                    MailerModule.send(
                                        "Staywell_rejectedAccountStaywell",
                                        templateContent,
                                        emailTo,
                                        'Activare cont MSD'
                                    ).then(
                                        function (success) {
                                            handleSuccess(res, {updateCount: wres}, 8);
                                        },
                                        function (err) {
                                            handleError(res,err,500);
                                        }
                                    );
                                }
                            });
                        }else{
                            //TODO: handle this as error
                            handleSuccess(res, {updateCount: wres}, 9);
                        }
                    }
                });
            }else{
                handleError(res,null,400,6);
            }
        });

    router.route('/admin/users/newAccounts/count')
        .get(function (req, res) {
            User.aggregate([
                {$group: {_id: "$state", total: {$sum: 1}}}
            ], function (err, result) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, result);
                }
            });
        });

    router.route('/admin/intros')
        .get(function (req, res) {
            if(req.query.id){
                var presentations={};
                Presentations.find({_id: req.query.id}).populate('groupsID').exec(function (err, presentation) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        presentations['onePresentation']=presentation[0];
                        UserGroup.find({}, {display_name: 1, profession:1}).populate('profession').exec(function(err, cont2) {
                            if(err) {
                                handleError(res,err,500);
                            }else{
                                handleSuccess(res, presentations);
                            }
                        });
                    }
                });
            }else{
                Presentations.find({}).exec(function (err, presentations) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, presentations);
                    }
                });
            }
        })
        .post(function(req,res){
            var intro = new Presentations(req.body.intro);
            intro.save(function (err, presentation) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 2);
                }
            });
        })
        .put(function(req,res){
            if(req.body.isEnabled!=undefined){
                Presentations.update({_id: req.query.id},{$set:{enabled: req.body.isEnabled}}).exec(function (err, presentation) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {}, 3);
                    }
                });
            }else{
                var intro = req.body.intro;
                Presentations.update({_id: req.query.id},{$set: intro},function (err, presentation) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {}, 3);
                    }
                });
            }
        })
        .delete(function(req,res){
            Presentations.remove({_id: req.query.idToDelete}, function (err, count) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {count: count}, 4);
                }
            });
        });

    //========================================================= NEWSLETTER

    var Newsletter = {
        distributionLists: require('./models/newsletter/distribution_lists'),
        campaigns: require('./models/newsletter/campaigns'),
        templates: require('./models/newsletter/templates')
    };

    router.route('/admin/newsletter/distribution_lists')
        .get(function (req, res) {
            if(req.query.id){
                Newsletter.distributionLists.findOne({_id: req.query.id}).populate('user_groups').exec(function (err, newsletter) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, newsletter);
                    }
                });
            }else{
                Newsletter.distributionLists.find({}, function (err, distributionLists) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, distributionLists);
                    }
                });
            }
        })
        .post(function (req, res) {
            var list = new Newsletter.distributionLists({
                name: "Untitled",
                date_created: Date.now()
            });
            list.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            UtilsModule.discardFields(req.body, ["_id"]);
            Newsletter.distributionLists.findOne({_id: req.query.id}, function (err, list) {
                if(err){
                    handleError(res, err);
                }else if(!list){
                    handleError(res, null, 404, 1);
                }else{
                    _.extend(list, req.body);
                    list.save(function (err, saved) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, saved);
                        }
                    });
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            Newsletter.distributionLists.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        });

    router.route('/admin/newsletter/campaigns')
        .get(function (req, res) {
            if(req.query.id){
                Newsletter.campaigns.findOne({_id: req.query.id}).populate("distribution_lists").exec(function (err, campaign) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, campaign);
                    }
                });
            }else{
                Newsletter.campaigns.find({}, function (err, campaigns) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, campaigns);
                    }
                });
            }
        })
        .post(function (req, res) {
            var campaign = new Newsletter.campaigns({
                name: "Untitled",
                date_created: Date.now(),
                status: "not sent"
            });
            campaign.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            UtilsModule.discardFields(req.body, ["_id", "date_created", "status"]);
            Newsletter.campaigns.findOne({_id: req.query.id}, function (err, campaign) {
                if(err){
                    handleError(res, err);
                }else if(!campaign){
                    handleError(res, null, 404, 1);
                }else{
                    _.extend(campaign, req.body);
                    campaign.save(function (err, saved) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, saved);
                        }
                    });
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            Newsletter.campaigns.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        });

    router.route('/admin/newsletter/templates')
        .get(function (req, res) {
            if(req.query.id){
                Newsletter.templates.findOne({_id: req.query.id}, function (err, template) {
                    if(err){
                        handleError(res, err);
                    }else if(!template){
                        handleError(res, false, 404, 1);
                    }else{
                        handleSuccess(res, template);
                    }
                });
            }else if(req.query.returnTypes){
                handleSuccess(res, new Newsletter.templates().schema.path('type').enumValues);
            }else{
                var q = {};
                if(req.query.type) q.type = req.query.type;
                Newsletter.templates.find(q, function (err, templates) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, templates);
                    }
                });
            }
        })
        .post(function (req, res) {
            var template = new Newsletter.templates({
                name: "Untitled",
                date_created: Date.now()
            });
            template.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        .put(function (req, res) {
            UtilsModule.discardFields(req.body, ["_id"]);
            Newsletter.templates.findOne({_id: req.query.id}, function (err, template) {
                if(err){
                    handleError(res, err);
                }else if(!template){
                    handleError(res, null, 404, 1);
                }else{
                    _.extend(template, req.body);
                    template.save(function (err, saved) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, saved);
                        }
                    });
                }
            });
        })
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            Newsletter.templates.remove({_id: idToDelete}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        });

    router.route('/admin/newsletter/users')
        .get(function (req, res) {
            if(req.query.unsubscribed){
                User.find({"subscriptions.newsletterStaywell": {$ne: true}}, {username: 1, name: 1}).exec(function (err, users) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, users);
                    }
                });
            }else{
                handleError(res, false, 400, 6);
            }
        });

    router.route('/admin/newsletter/statistics')
        .get(function (req, res) {
            NewsletterModule.getOverallStats().then(
                function (stats) {
                    handleSuccess(res, stats);
                },
                function (err) {
                    handleError(res, err);
                }
            );
        });

    //==================================================================================================================================== USER ROUTES

    router.route('/user/addPhoto')
        .post(function(req,res){
            var data = req.body.data || {};
            var imageBody = data.Body;
            var imageExtension = data.extension;
            if(imageBody && imageExtension){
                UserModule.updateUserImage(req.user._id, imageBody, imageExtension).then(
                    function (image_path) {
                        handleSuccess(res, null, 11);
                    },
                    function (err) {
                        handleError(res,err,500);
                    });
            }else{
                handleError(res,null,400,6);
            }
        });

    router.route('/specialFeatures/specialGroups')

        .get(function(req, res) {
            UserGroup.find({_id: {$in: req.user.groupsID}, content_specific: {$exists:true, $ne: false}}, function(err, groups) {
                if(err) {
                    handleError(res,err,500);
                }
                else
                {
                    handleSuccess(res,groups);
                }

            });
        });
    router.route('/specialFeatures/groupSpecialProducts')
        .get(function(req, res) {
            specialProduct.find({groups: {$in: [req.query.specialGroup]}, enabled: true}, function(err, product) {
                if(err) {
                    handleError(res,err,500);
                }
                else
                {
                    handleSuccess(res,product);
                }
            });
        });

    router.route('/specialFeatures/specialApps')
        .get(function (req, res) {
            if(req.query.group){
                specialApps.find({groups: {$in: [req.query.group]}, isEnabled: true}).exec(function (err, apps) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,apps);
                    }
                });
            }else if(req.query.id){
                specialApps.findOne({_id: req.query.id}).exec(function (err, app) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,app);
                    }
                });
            }else{
                handleError(res,null,400,6);
            }
        });


    router.route('/specialProduct')
        .get(function(req, res) {
            specialProduct.findOne({_id: req.query.id}).populate('speakers').exec(function(err, product) {
                if(err || !product) {
                    handleError(res,err,500);
                }
                else
                {
                    handleSuccess(res,product);
                }
            });
        });
    router.route('/specialProductMenu')
        .get(function(req, res) {
            specialProductMenu.distinct('children_ids', function (err,allChildren) {
                if(err)
                {
                    handleError(res,err,500);
                }
                else{
                    specialProductMenu.find({product: req.query.id,_id:{$nin:allChildren}}).sort({order_index: 1}).populate({path: 'children_ids', options: { sort: {order_index: 1}}}).exec(function(err, details) {
                        if(err) {
                            handleError(res,err,500);
                        }
                        else
                        {
                            handleSuccess(res,details);
                        }
                    });
                }

            });
        });
    router.route('/specialProductDescription')
        .get(function(req, res) {
            specialProductMenu.findOne({_id: req.query.id}).exec(function(err, details) {
                if(err) {
                    handleError(res,err,500);
                }
                else
                {
                    handleSuccess(res,details);
                }
            });
        });
    router.route('/specialProductFiles')
        .get(function(req, res) {
            specialProductFiles.find({product: req.query.id}).exec(function(err, details) {
                if(err) {
                    handleError(res,err,500);
                }
                else
                {
                    handleSuccess(res,details);
                }
            });
        });
    router.route('/specialProductGlossary')
        .get(function(req, res) {
            specialProductGlossary.find({product: req.query.id}).exec(function(err, details) {
                if(err) {
                    handleError(res,err,500);
                }
                else
                {
                    handleSuccess(res,details);
                }
            });
        });

    router.route('/specialProduct/speakers')
        .get(function (req, res) {
            Speakers.findOne({_id: req.query.speaker_id}, function (err, speaker) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,speaker);
                }
            });
        });
    router.route('/content')
        .get(function(req, res) {
            if(req.query.content_id){
                Content.findOne({_id: req.query.content_id}, function(err, cont) {
                    if(err || !cont) {
                        handleError(res, err);
                    }else{
                        handleSuccess(res, cont);
                    }
                })
            }else{
                getUserContent(req.user, req.query.content_type, req.query.specialGroupSelected, null, 'created').then(
                    function (content) {
                        handleSuccess(res,content);
                    },
                    function (err) {
                        handleError(res,err,500);
                    });
            }
        });

    router.route('/userdata')

        .get(function(req, res) {
            User.findOne({_id: req.user._id}).select("+phone +points +citiesID +jobsID +address +practiceType +title").populate('therapeutic-areasID').exec(function (err, user) {
                if(err){
                    handleError(res,err,500);
                }else{
                    var userCopy = JSON.parse(JSON.stringify(user));
                    async.parallel([
                        function (callback) {
                            if(user['jobsID'] && user['jobsID'][0]){
                                Job.findOne({_id: user.jobsID[0]}, function (err, job) {
                                    if(err){
                                        callback(err);
                                    }else{
                                        userCopy.job = job;
                                        callback();
                                    }
                                });
                            }else{
                                callback();
                            }
                        },
                        function (callback) {
                            Cities.findOne({_id: user.citiesID[0]}, function (err, city) {
                                if (err) {
                                    callback(err);
                                }else{
                                    if(city) {
                                        Counties.findOne({citiesID: {$in: [city._id]}}, function (err, county) {
                                            if(err){
                                                callback(err);
                                            }else{
                                                if(county){
                                                    userCopy['city_id'] = city._id;
                                                    userCopy['city_name'] = city.name;
                                                    userCopy['county_id'] = county._id;
                                                    userCopy['county_name'] = county.name;
                                                }
                                                callback();
                                            }
                                        });
                                    }else{
                                        callback();
                                    }
                                }
                            });
                        }
                    ], function (err) {
                        if(err){
                            handleError(res, err);
                        }else{
                            handleSuccess(res, userCopy);
                        }
                    });
                }
            });
        })
        .put(function (req, res) {
            var ans = {};

            var newData = req.body.newData;
            UtilsModule.allowFields(newData, ["name", "title", "phone", "newsletter", "therapeutic-areasID", "citiesID", "address", "subscriptions", "practiceType"]);

            var namePatt = UtilsModule.regexes.name;
            var phonePatt = UtilsModule.regexes.phone;
            if((!namePatt.test(newData.name.toString()))){ //check name
                handleError(res,null,400,26);
            }else if(newData.phone && !phonePatt.test(newData.phone.toString())){ //check phone number
                handleError(res,null,400,27);
            }else if(!newData.address){
                handleError(res,null,400,28);
            }else{
                User.update({_id: req.user._id}, {$set: newData}, function (err, wres) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, {}, 12);
                    }
                });
            }
        });

    router.route('/counties')

        .get(function(req, res) {
            Counties.find({$query:{}, $orderby: {name: 1}}, {name: 1}, function (err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res,cont);
            });
        });

    router.route('/cities')

        .get(function(req, res) {
            Counties.findOne({name: req.query.county_name}, function (err, county) {
                if(err || !county) {
                    handleError(res, err);
                }else{
                    Cities.find({_id: {$in: county.citiesID}}, function (err, cities) {
                        if(err) {
                            handleError(res, err);
                        }else
                            handleSuccess(res, cities);
                    });
                }
            });
        });

    router.route('/userJob')

        .post(function (req, res) {
            var job = req.body.job;
            var streetPatt = UtilsModule.regexes.streetName;
            var namePatt = UtilsModule.regexes.jobName;
            var numberPatt = UtilsModule.regexes.jobNumber;
            if(!numberPatt.test(job.street_number.toString())) {
                ans.error = true;
                ans.message = "Numarul strazii trebuie sa contina intre 1 si 5 cifre";
            }
            if(!streetPatt.test(job.street_name.toString())) {
                return handleError(res,null,400,40);
            }
            if(!namePatt.test(job.job_name.toString())) {
                return handleError(res,null,400,41);
            }
            if(!isNaN(parseInt(job.job_type))){
                if(parseInt(job.job_type)<1 || parseInt(job.job_type>4)){
                    return handleError(res,null,400,29);
                }
            }else{
                return handleError(res,null,400,29);
            }
            if(!job._id){
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
                        handleError(res,null,400,2);
                    }else{
                        //update user to point to new job
                        var idInserted = inserted._id.toString();
                        var upd = User.update({_id:req.user._id}, {jobsID: [idInserted]}, function () {
                            if(!upd._castError){
                                handleSuccess(res, {}, 12);
                            }else{
                                handleError(res,null,400,2);
                            }
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
                        handleSuccess(res, {}, 12);
                    }else{
                        handleError(res,null,400,2);
                    }
                });
            }
        });

    router.route('/changePassword')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            User.findOne({_id: req.user._id}).select("+password").exec(function (err, user) {
                if(err || !user){
                    handleError(res,err,500);
                }else{
                    //check if password is correct
                    if(SHA256(userData.oldPass).toString() !== user.password){
                        handleError(res,null,400,8);
                    }else{
                        if(SHA256(userData.newPass).toString() === user.password)
                        {
                            handleError(res,null,400,9);
                        }
                        else
                        {
                            if(userData.newPass.toString().length < 6 || userData.newPass.toString().length > 32){
                                handleError(res,null,400,10);
                            }else{
                                //check if passwords match
                                if(userData.newPass !== userData.confirmPass){
                                    handleError(res,null,400,11);
                                }else{
                                    //change password
                                    User.update({_id: user._id}, {password: SHA256(userData.newPass).toString()}, function (err) {
                                        if(!err){
                                            handleSuccess(res, {}, 13);
                                        }else{
                                            handleError(res,err,500);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            });
        });

    router.route('/userHomeCarousel/')
        .get(function (req,res) {
            getNonSpecificUserGroupsIds(req.user).then(
                function (nonSpecificGroupsIds) {
                    var forGroups = nonSpecificGroupsIds;
                    if(req.query.specialGroupSelected){
                        forGroups.push(req.query.specialGroupSelected.toString());
                    }
                    //get allowed articles for user
                    Content.distinct("_id", {groupsID: {$in: forGroups}, enable:true}).exec(function (err, ids) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            //get carousel content within allowed articles
                            Carousel.find({enable:true, article_id: {$in: ids}}).populate('article_id').sort({'indexNumber':1}).exec(function (err, images) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    handleSuccess(res, images);
                                }
                            })
                        }
                    });
                },
                function (err) {
                    handleError(res,err,500);
                });
        });
    router.route('/userHomeSearch/')
        .get(function(req,res){
            var data=req.query.data;
            var arr_of_items=[Products,Multimedia,Content,Events];
            var ObjectOfResults={};
            getNonSpecificUserGroupsIds(req.user).then(
                function (nonSpecificGroupsIds) {
                    var forGroups = nonSpecificGroupsIds;
                    if (req.query.specialGroupSelected) {
                        forGroups.push(req.query.specialGroupSelected);
                    }

                    async.each(arr_of_items, function (item, callback) {
                        var hydrateOp;
                        if(item == Events){
                            hydrateOp = {find: {groupsID:{$in:forGroups},enable:true,start:{$gt: new Date()}}};
                        }else{
                            hydrateOp = {find: {groupsID:{$in:forGroups},enable:true }};
                        }

                        item.search({

                            query_string: {
                                query: data,
                                default_operator: 'OR',
                                lowercase_expanded_terms: true
                                //phrase_slop: 50,
                                //analyze_wildcard: true

                            }

                        },{hydrate: true,hydrateOptions:hydrateOp}, function(err, results) {
                            if(err){
                                callback(err);
                            }else{
                                if(results && results.hits && results.hits.hits){
                                    ObjectOfResults[item.modelName]=results.hits.hits;
                                }
                                callback();
                            }
                        });

                    }, function (err) {
                        if(err)
                            handleError(res,err,500);
                        else{
                            handleSuccess(res, ObjectOfResults);
                        }
                    })
                },
                function (err) {
                    handleError(res,err,500);
                });
        });
    router.route('/userHomeEvents')
        .get(function (req,res) {
            getNonSpecificUserGroupsIds(req.user).then(
                function (nonSpecificGroupsIds) {
                    var forGroups = nonSpecificGroupsIds;
                    if (req.query.specialGroupSelected) {
                        forGroups.push(req.query.specialGroupSelected);
                    }
                    Events.find({groupsID: {$in: forGroups}, start: {$gte: new Date()}, enable: true}).sort({start: 1}).exec(function (err, events) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, events);
                        }
                    });
                },
                function (err) {
                    handleError(res,err,500);
                });
        });

    router.route('/userHomeMultimedia')
        .get(function (req,res) {
            getNonSpecificUserGroupsIds(req.user).then(
                function (nonSpecificGroupsIds) {
                    var forGroups = nonSpecificGroupsIds;
                    if (req.query.specialGroupSelected) {
                        forGroups.push(req.query.specialGroupSelected);
                    }
                    Multimedia.find({groupsID: {$in: forGroups}, enable: {$ne: false}}).sort({last_updated: 'desc'}).exec(function (err, multimedia) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, multimedia);
                        }
                    });
                },
                function (err) {
                    handleError(res,err,500);
                });
        });

    router.route('/homeNews')
        .get(function(req, res) {
            //establish content type
            var contentType = {$in: [1, 2]};
            if(req.query.scientific) contentType = 3;
            //get content
            getUserContent(req.user, contentType, req.query.specialGroupSelected, 3, "created").then(
                function (cont) {
                    handleSuccess(res, cont);
                },
                function (err) {
                    handleError(res,err,500);
                });
        });

    router.route('/products')
        .get(function(req, res) {
            if(req.query.idProduct){
                Products.findOne({_id: req.query.idProduct}, function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, cont);
                    }
                })
            }else{
                getNonSpecificUserGroupsIds(req.user).then(
                    function (groups) {
                        if (req.query.specialGroup) {
                            groups.push(req.query.specialGroup);
                        }
                        if(req.query.idArea && req.query.idArea != 0){
                            Therapeutic_Area.distinct("_id", {$or: [{_id: req.query.idArea}, {"therapeutic-areasID": {$in :[req.query.idArea]}}]}).exec(function(err, areas){
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    var q = {"therapeutic-areasID": {$in: areas}, groupsID: {$in: groups}};
                                    if(req.query.firstLetter) q["name"] = UtilsModule.regexes.startsWithLetter(req.query.firstLetter);
                                    Products.find(q).sort({"name": 1}).exec(function(err, cont) {
                                        if(err) {
                                            handleError(res,err,500);
                                        }else{
                                            handleSuccess(res, cont);
                                        }
                                    })
                                }
                            });
                        }else{
                            //get allowed articles for user
                            var q = {groupsID: {$in: groups}};
                            if(req.query.firstLetter) q["name"] = UtilsModule.regexes.startsWithLetter(req.query.firstLetter);
                            Products.find(q).sort({"name": 1}).exec(function(err, cont) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    handleSuccess(res, cont);
                                }
                            })
                        }
                    },
                    function (err) {
                        handleError(res,err,500);
                    }
                );
            }
        });

    router.route('/calendar')
        .get(function(req,res) {
            if(req.query.id){
                Events.findById(req.query.id,function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, cont);
                    }
                });
            }else{
                getNonSpecificUserGroupsIds(req.user).then(function (nonSpecificGroupsIds) {
                    var forGroups = nonSpecificGroupsIds;
                    if(req.query.specialGroup){
                        forGroups.push(req.query.specialGroup);
                    }
                    Events.find({groupsID: {$in: forGroups},enable: true}).sort({start : 1}).limit(50).exec(function (err, cont) {
                        if (err) {
                            handleError(res,err,500);
                        }
                        else
                        {
                            handleSuccess(res, cont);
                        }

                    })
                }, function (err) {
                    handleError(res,err,500);
                })
            }
        });
    router.route('/multimedia')
        .get(function(req,res){
            if(req.query.idMultimedia){
                Multimedia.findById(req.query.idMultimedia,function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }
                    else{
                        handleSuccess(res, cont);
                    }
                });
            }else{
                var findObj={};
                getNonSpecificUserGroupsIds(req.user).then(
                    function (nonSpecificGroupsIds) {
                        var forGroups = nonSpecificGroupsIds;
                        if (req.query.specialGroupSelected) {
                            forGroups.push(req.query.specialGroupSelected);
                        }
                        findObj['groupsID']={$in:forGroups};
                        findObj['enable']={$ne: false};
                        if(req.query.idArea==0){
                            Multimedia.find(findObj, function (err, multimedia) {
                                if (err) {
                                    handleError(res,err,500);
                                } else {
                                    handleSuccess(res, multimedia);
                                }
                            });
                        }else{
                            Therapeutic_Area.distinct("_id", {$or: [{_id: req.query.idArea}, {"therapeutic-areasID": {$in :[req.query.idArea]}}]}).exec(function (err, ids) {
                                if(err){
                                    handleError(res, err);
                                }else{
                                    findObj['therapeutic-areasID'] = {$in: ids};
                                    Multimedia.find(findObj, function (err, multimedia) {
                                        if (err) {
                                            handleError(res,err,500);
                                        } else {
                                            handleSuccess(res, multimedia);
                                        }
                                    });
                                }
                            });
                        }
                    },
                    function (err) {
                        handleError(res,err,500);
                    })
            }
        });

    //============================================ intro presentations

    router.route('/checkIntroEnabled')
        .get(function (req, res) {
            Presentations.findOne({groupsID: {$in: [req.query.groupID]}, enabled: true}).exec(function (err, presentation) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, presentation);
                }
            });
        });

    router.route('/rememberIntroView')
        .get(function(req,res){
            var viewStatus = SessionStorage.getElement(req, "viewedIntroPresentations") || {};
            handleSuccess(res,{isViewed: viewStatus[req.query.groupID]});
        })
        .post(function(req,res){
            var viewStatus = SessionStorage.getElement(req, "viewedIntroPresentations") || {};
            viewStatus[req.body.groupID] = true;
            SessionStorage.setElement(req, "viewedIntroPresentations", viewStatus);
            handleSuccess(res);
        });

    router.route('/introPresentation')
        .get(function (req, res) {
            Presentations.findOne({groupsID: {$in: [req.query.groupID]}, enabled: true}).exec(function (err, presentation) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, presentation);
                }
            });
        });

    //============================================ regexp object
    router.route('/regexp')
        .get(function(req,res){
            var regexp = UtilsModule.validationStrings;
            handleSuccess(res,regexp);
        });

    app.use('/api', router);
};
