var Content     = require('../models/articles');
var Products    = require('../models/products');
var Divisions   = require('../models/divisions/divisions');
var Therapeutic_Area = require('../models/therapeutic_areas');
var UserGroup = require('../models/userGroup');
var Events = require('../models/events');
var Counties = require('../models/counties');
var Cities = require('../models/cities');
var Multimedia = require('../models/multimedia');
var User = require('../models/user');
var Job = require('../models/jobs');
var Roles=require('../models/roles');
var PublicContent = require('../models/publicContent');
var PublicCategories = require('../models/publicCategories');
var PublicCarousel = require('../models/publicCarousel');
var Carousel=require('../models/carousel_Medic');
var Conferences = require('../models/conferences');
var Talks = require('../models/talks');
var Speakers = require('../models/speakers');
var Rooms = require('../models/rooms');
var Topics = require('../models/qa_topics');
var AnswerGivers = require('../models/qa_answerGivers');
var Threads = require('../models/qa_threads');
var qaMessages = require('../models/qa_messages');
var Professions = require('../models/professions');
var Presentations =require('../models/presentations');
var CM_templates =require('../models/CM_templates');
var ActivationCodes =require('../models/activationCodes');
var DPOC_Devices = require('../models/DPOC_Devices');
var Parameters = require('../models/parameters');
var JanuviaUsers = require('../models/januvia/januvia_users');
var AppUpdate = require("../models/msd-applications.js");
var _ = require('underscore');
var guidelineFile = require ("../models/guidelineFile");
var guidelineCategory = require ("../models/guidelineCategory");
var myPrescription = require("../models/myPrescription");
var pdf = require("html-pdf");
var Pathologies = require('../models/pathologies');
var brochureSection = require('../models/brochureSections');
var Speciality = require('../models/specialty');

var xlsx = require("xlsx");


//modules
var UserModule = require('../modules/user');
var MailerModule = require('../modules/mailer');
var UtilsModule = require('../modules/utils');
var SessionStorage = require('../modules/sessionStorage');
var ConferencesModule = require('../modules/Conferences');
var ModelInfos = require('../modules/modelInfos');
var ContentVerifier = require('../modules/contentVerifier');
var januviaImport = require('../modules/importJanuviaUsers');
var searchIndex = require('../modules/mongoosasticIndex/index');

//special Products
var specialProduct = require('../models/specialProduct');
var specialProductMenu = require('../models/specialProduct_Menu');
var specialProductGlossary = require('../models/specialProduct_glossary');
var specialProductFiles = require('../models/specialProduct_files');
var specialApps = require('../models/userGroupApplications');

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
var Config = require('../../config/environment');
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
var getUserContent = function (content_type, limit, sortDescendingByAttribute) {
    var deferred = Q.defer();
    //first get non specific content groups only
    var myCursor = Content.find({enable: {$exists:true, $ne: false}, type: content_type});
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
    return deferred.promise;
};

var getSpecialProductMenu = function (productID, onlyFirstItem) {
    var deferred = Q.defer();
    specialProductMenu.distinct('children_ids', function (err,allChildren) {
        if(err)
        {
            deferred.reject(err);
        }
        else {
            specialProductMenu.find({product: productID,_id:{$nin:allChildren}}).sort({order_index: 1}).populate({path: 'children_ids', options: { sort: {order_index: 1}}}).exec(function(err, details) {
                if(err) {
                    deferred.reject(err);
                }
                else
                {
                    if(onlyFirstItem){
                        if(details[0] && details[0].children_ids && details[0].children_ids.length){
                            deferred.resolve(details[0].children_ids[0]);
                        } else {
                            deferred.resolve(details[0]);
                        }
                    } else {
                        deferred.resolve(details);
                    }

                }
            });
        }
    });
    return deferred.promise;
};

var getPathologiesWithItems = function(entityToAssociate, itemQParams, pathQParams){
    var deferred = Q.defer();
    var pathologiesToSend = [];
    var queryPathology = pathQParams ? pathQParams : { enabled: true };
    //get pathologies and for each get list of products
    Pathologies.find(queryPathology).sort({order_index: 1}).populate('specialApps').exec(function(err, pathologies){
        if(err)
        {
            deferred.reject(err);
        }
        else {
            async.each(pathologies, function(pathology, callback){
                itemQParams.query.pathologiesID = {$in: [pathology._id]};
                entityToAssociate.find(itemQParams.query).sort(itemQParams.sort).exec(function (error, associated) {
                    if(err){
                        callback(err)
                    } else  {
                        if(associated.length > 0){
                            var objectToPush = {
                                _id: pathology._id,
                                display_name: pathology.display_name,
                                description: pathology.description,
                                header_image: pathology.header_image,
                                specialApps: pathology.specialApps,
                                order_index: pathology.order_index,
                                video_intro: pathology.video_intro
                            };
                            var associatedItemsClean = [];
                            async.each(associated, function(singleItem, callbackItem){
                                getSpecialProductMenu(singleItem._id, true).then(
                                    function (success) {
                                        var itemToAdd = {
                                            _id: singleItem._id,
                                            general_description : singleItem.general_description,
                                            logo_path: singleItem.logo_path,
                                            product_name: singleItem.product_name,
                                            order_index: singleItem.order_index,
                                            firstMenuItem: success
                                        };
                                        associatedItemsClean.push(itemToAdd);
                                        callbackItem();
                                    },
                                    function (err) {
                                        callbackItem(err);
                                    }
                                )
                            }, function (err) {
                                if(err){
                                    callback(err);
                                } else {
                                    associatedItemsClean = _.sortBy(associatedItemsClean, function(asociatedItemObject){
                                        return asociatedItemObject.order_index;
                                    });
                                    objectToPush['associated_items'] = associatedItemsClean;
                                    pathologiesToSend.push(objectToPush);
                                    callback();
                                }
                            });
                        } else {
                            if(queryPathology._id)
                                pathologiesToSend.push(pathology);
                            callback();
                        }
                    }
                })
            }, function(err){
                if(err){
                    deferred.reject(err);
                } else {
                    pathologiesToSend = _.sortBy(pathologiesToSend, function(pathologyObj){
                        return pathologyObj.order_index;
                    });
                    deferred.resolve(pathologiesToSend);
                }
            })
        }
    });
    return deferred.promise;
};


//======================================================================================================================================= routes for admin

module.exports = function(app, env, sessionSecret, logger, amazon, router) {

    //elearning routes
    require('./elearning')(env, logger, amazon, router);

    //============================================= Define injection dependent modules
    var handleSuccess = require('../modules/responseHandler/success.js')(logger);
    var handleError = require('../modules/responseHandler/error.js')(logger);
    var Auth = require('../modules/auth')(logger, sessionSecret);
    var NewsletterModule = require('../modules/newsletter')(logger);


    //only logged in users can access a route
    app.all("/api/*", Auth.isLoggedIn,UtilsModule.fixUpdateId, function(req, res, next) {
        next(); // if the middleware allowed us to get here,
        // just move on to the next route handler
    });

    //only admin can access "/admin" routes
    app.all("/api/admin/*", Auth.hasAdminRights, function(req, res, next) {
        next(); // if the middleware allowed us to get here,
        // just move on to the next route handler
    });

    //only admin can access "/admin" routes
    app.all("/api/streamAdmin/*", Auth.hasAdminRights, function(req, res, next) {
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
    /**
     * @apiName User_Groups
     * @apiDescription Get a list of user groups / a single groups
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/groups Get a list of user groups / a single groups
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the group
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/groups?id=null
     * @apiSuccess {Array} response.success a list of user groups / a single groups
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_User_Group
         * @apiDescription Create a user group
         * @apiGroup Admin_API
         * @api {post} /api/admin/users/groups Create a user group
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} toCreate a group object
         * @apiParam {Array} users a list of user ids for this groups
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{toCreate: {}, users: []}' http://localhost:8080/api/admin/users/groups
         * @apiSuccess {Object} response.success an object with the new group
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              created: {},
         *              updated: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_User_Group
         * @apiDescription Update a user group
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/groups Update a user group
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} toUpdate a group object
         * @apiParam {String} id the group id
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{toUpdate: {}}' http://localhost:8080/api/admin/users/groups?id=dwanawnfawnva
         * @apiSuccess {Object} response.success an object with how many users were added to the group
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              connectedUsers: 0 // or multiple
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_User_Group
         * @apiDescription Delete a user group
         * @apiGroup Admin_API
         * @api {delete} /api/admin/users/groups Delete a user group
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the group id
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/users/groups?id=dwanawnfawnva
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Professions
     * @apiDescription Get a list of professions
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/professions Get a list of professions
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/professions
     * @apiSuccess {Array} response.success a list of professions
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            Professions.find({}, function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res,cont);
            });
        });

    router.route('/admin/users/users')
    /**
     * @apiName Users_List
     * @apiDescription Get a list of Staywell users
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/users Get a list of Staywell users
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [group] a group id to filter user by it
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/users?group=null
     * @apiSuccess {Array} response.success a list of Staywell users
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Public_Content_List
     * @apiDescription Get a list of public content items / a single public content item
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/publicContent Get a list of public content items / a single public content item
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the public content
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/publicContent?id=null
     * @apiSuccess {Array} response.success a list of public content items / a single public content item
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
                PublicContent.find({}, {title: 1, author: 1, text:1, type:1, 'therapeutic-areasID':1, enable:1, date_added: 1, last_updated: 1} ,function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else
                        handleSuccess(res,cont);
                });
            }
        })
        /**
         * @apiName Create_Public_Content
         * @apiDescription Create a public content item
         * @apiGroup Admin_API
         * @api {post} /api/admin/users/publicContent Create a public content item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/users/publicContent
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
            var content = new PublicContent({
                title : "Untitled",
                date_added : new Date(),
                last_updated  : new Date()
            });
                content.save(function (err, inserted) {
                   if(err){
                        handleError(res,err,500);
                   }else{
                        handleSuccess(res, {}, 2);
                   }
                });
        })
        /**
         * @apiName Update_Public_Content
         * @apiDescription Update a public content item
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/publicContent Update a public content item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the public item to update
         * @apiParam {String} [info] an object with the old status of the public content (looks like - info : {isEnabled: true})
         * @apiParam {Object} toUpdate the updated public content
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{toUpdate: {}}' http://localhost:8080/api/admin/users/publicContent?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Public_Content
         * @apiDescription Delete a public content item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/users/publicContent Delete a public content item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the public item to delete
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/users/publicContent?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Update_Public_Content_Attached_File_Or_Image
     * @apiDescription Update a public content item's image or attached file
     * @apiGroup Admin_API
     * @api {post} /api/admin/users/publicContent/changeImageOrFile Update a public content item's image or attached file
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Object} data the info for updating the image / file path (looks like - {id: '', type: 'file', path: ''})
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -d '{id: '', type: 'file', path: ''}' http://localhost:8080/api/admin/users/publicContent/changeImageOrFile
     * @apiSuccess {Object} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
         *          error: "",
         *          data: {}
         *     }
     */
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

    router.route('/admin/pathologies')
    /**
     * @apiName Pathologies_List
     * @apiDescription Get a list of pathologies / a single pathology
     * @apiGroup Admin_API
     * @api {get} /api/admin/pathologies Get a list of pathologies / a single pathology
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the pathology
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/pathologies?id=null
     * @apiSuccess {Array} response.success a list of pathologies / a single pathology
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            if(req.query.id){
                Pathologies.findOne({_id:req.query.id}).populate('specialApps').exec(function(err, pathology) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, pathology);
                    }
                })
            }else{
                Pathologies.find(function(err, pathologies) {
                    if(err) {
                        handleError(res,err,500);
                    }
                    else {
                        handleSuccess(res, pathologies);
                    }
                });
            }
        })
        /**
         * @apiName Create_Pathology
         * @apiDescription Create a pathology
         * @apiGroup Admin_API
         * @api {post} /api/admin/pathologies Create a pathology
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/pathologies
         * @apiSuccess {Object} response.success an object with the new pathology
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *           saved: {}
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req, res) {
            var pathology = new Pathologies({
                display_name: 'Untitled',
                last_updated: new Date(),
                enabled: false
            });
            pathology.save(function(err,saved) {
                if (err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {saved: saved}, 2);
                }
            });
        })
        /**
         * @apiName Update_Pathology
         * @apiDescription Update a pathology
         * @apiGroup Admin_API
         * @api {put} /api/admin/pathologies Update a pathology
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the pathology to update
         * @apiParam {Object} obj the updated pathology
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{{}}' http://localhost:8080/api/admin/pathologies?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function(req, res) {
            // the body will contain an object with the property/properties we want to update
            Pathologies.update({_id:req.query.id},{$set: req.body}, function(err, pathology) {
                if (err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 3);
                }
            });
        })
        /**
         * @apiName Delete_Pathology
         * @apiDescription Delete a pathology
         * @apiGroup Admin_API
         * @api {delete} /api/admin/pathologies Delete a pathology
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the pathology
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/pathologies?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function(req, res) {
            var id = req.query.id;
            Pathologies.findOne({_id: id}, function (err, pathology) {
                if(pathology){
                    if(pathology.header_image)
                        pathology.associated_multimedia.push(pathology.header_image);
                    var imagesToDelete = pathology.associated_multimedia;
                    //first we'll remove any references to this pathology
                    var arrayOfObjectsToUpdate = [Multimedia, Content, Events, specialProduct];
                    async.forEach(arrayOfObjectsToUpdate, function(objectToUpdate, callback){
                        objectToUpdate.update({}, {$pull: {pathologiesID: id}}, {multi: true}, function (err, wres) {
                            if(err){
                                callback(err);
                            }else{
                               callback();
                            }
                        });
                    }, function (err) {
                        if(err){
                            handleError(res,err,500);
                        } else {
                            //after we have updated the references and deleted all
                            Pathologies.remove({_id:id},function(err,cont) {
                                if (err){
                                    handleError(res,err,500);
                                }
                                else{
                                    if(imagesToDelete.length){
                                        async.forEach(imagesToDelete, function (imagePath, callbackImage) {
                                            amazon.deleteObjectS3(imagePath, function (err, data) {
                                                if(err){
                                                    callbackImage(err);
                                                }else{
                                                    callbackImage();
                                                }
                                            });
                                        }, function (err) {
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
                        }
                    })
                }else{
                    handleError(res,err,404,1);
                }
            });
        });

    router.route('/admin/brochure')
    /**
     * @apiName Brochure_Sections
     * @apiDescription Get a list of brochure sections / a brochure section
     * @apiGroup Admin_API
     * @api {get} /api/admin/brochure Get a list of brochure sections / a brochure section
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the brochure
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/brochure?id=null
     * @apiSuccess {Array} response.success a list of brochure sections / a single brochure section
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            if(req.query.id){
                brochureSection.findOne({_id:req.query.id}, function(err, pathology) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, pathology);
                    }
                })
            }else{
                brochureSection.find(function(err, pathologies) {
                    if(err) {
                        handleError(res,err,500);
                    }
                    else {
                        handleSuccess(res, pathologies);
                    }
                });
            }
        })
        /**
         * @apiName Create_Brochure_Section
         * @apiDescription Create a brochure section
         * @apiGroup Admin_API
         * @api {post} /api/admin/brochure Create a brochure section
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/pathologies
         * @apiSuccess {Object} response.success an object with the new brochure section
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *           saved: {}
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req, res) {
            var brochure = new brochureSection({
                title: 'Untitled',
                last_updated: new Date(),
                enabled: false
            });
            brochure.save(function(err,saved) {
                if (err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {saved: saved}, 2);
                }
            });
        })
        /**
         * @apiName Update_Brochure_Section
         * @apiDescription Update a brochure section
         * @apiGroup Admin_API
         * @api {put} /api/admin/brochure Update a brochure section
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the brochure section to update
         * @apiParam {Object} obj the updated brochure section
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{{}}' http://localhost:8080/api/admin/brochure?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function(req, res) {
            // the body will contain an object with the property/properties we want to update
            brochureSection.update({_id:req.query.id},{$set: req.body}, function(err, pathology) {
                if (err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 3);
                }
            });
        })
        /**
         * @apiName Delete_Brochure_Section
         * @apiDescription Delete a brochure section
         * @apiGroup Admin_API
         * @api {delete} /api/admin/brochure Delete a brochure section
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the brochure section
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/brochure?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function(req, res) {
            var id = req.query.id;
            brochureSection.findOne({_id: id}, function (err, brochureS) {
                if(brochureS){
                    var imagesToDelete = [];
                    if(brochureS.title_image)
                        imagesToDelete.push(brochureS.title_image);
                    if(brochureS.side_image)
                        imagesToDelete.push(brochureS.side_image);
                    //first we'll remove any references to this pathology
                    brochureSection.remove({_id:id},function(err,cont) {
                        if (err){
                            handleError(res,err,500);
                        }
                        else{
                            if(imagesToDelete.length){
                                async.forEach(imagesToDelete, function (imagePath, callbackImage) {
                                    amazon.deleteObjectS3(imagePath, function (err, data) {
                                        if(err){
                                            callbackImage(err);
                                        }else{
                                            callbackImage();
                                        }
                                    });
                                }, function (err) {
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

    router.route('/admin/bulkOperations')
      .get(function(req,res){
          var modelToModify = mongoose.model(req.query.model);

          if (Array.isArray(req.query.items)){
              modelToModify.find({'_id': {$in: req.query.items}}, function(err, items){
                  if (err) {
                      console.log(err);
                      handleError(res, err, 500);
                  } else {
                      handleSuccess(res, items);
                  }
              })
          } else {
              modelToModify.find({'_id': req.query.items}).limit(1).exec(function(err, item){
                  if (err) {
                      handleError(res, err, 500);
                  } else {
                      handleSuccess(res, item)
                  }
              })
          }

      })
      .put(function(req, res){
        var modelToModify = mongoose.model(req.query.model);

         async.each(req.body.items, function(item, callback){
           modelToModify.findOneAndUpdate( {_id: item}, {$set:req.body.toSet}, function(err, updated){
             if (err){
               callback(err);
             } else {
               callback();
             }
           })
         }, function(err, updated){
           if(err) {
             handleError(res, err, 500)
           } else {
             handleSuccess(res, updated);
           }
         })
      })
      .post(function(req, res){

          //we are making the delete operation here, because on a DELETE endpoint we cannot send the array via req.body
        var modelToModify = mongoose.model(req.query.model);
          async.each(req.body.items,function(item, callback){
          modelToModify.findOneAndRemove( {_id: item}, function(err, deleted){
            if(err){
              callback(err)
            } else {
                if(req.body.coupledEntities){
                    var connectedEntites = req.body.coupledEntities;
                    async.each(Object.keys(connectedEntites), function (itemToUpdate, callbackUpdate){
                        var propertyToRemove = connectedEntites[itemToUpdate];
                        var objectForPullOp = {
                            propertyToRemove: item
                        };
                        var modelToChange = mongoose.model(itemToUpdate);
                        modelToChange.update({}, {$pull: objectForPullOp}, {multi: true}, function (err, wres) {
                            if(err){
                                callbackUpdate(err);
                            }else{
                                callbackUpdate();
                            }
                        });
                    }, function(err) {
                        callback();
                    });
                } else {
                    callback();
                }
            }
          })
        }, function(err, deleted){
          if(err) {
            handleError(res, err, 500);
          } else {
            handleSuccess(res, deleted);
          }
        })
      });

    router.route('/admin/users/publicContent/categories')
    /**
     * @apiName Public_Content_Categories
     * @apiDescription Get a list of public content categories
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/publicContent/categories Get a list of public content categories
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/publicContent/categories
     * @apiSuccess {Array} response.success a list of public content categories
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            PublicCategories.find(function (err, categories) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, categories);
                }
            });
        })
        /**
         * @apiName Create_Public_Content_Category
         * @apiDescription Create a public content category
         * @apiGroup Admin_API
         * @api {post} /api/admin/users/publicContent/categories Create a public content category
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/users/publicContent/categories
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var category = new PublicCategories({
                last_updated: new Date(),
                name: 'Untitled_' + new Date(),
                description: ''
            });
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
        /**
         * @apiName Update_Public_Content_Category
         * @apiDescription Update a public content category
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/publicContent/categories Update a public content category
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the public content category
         * @apiParam {Object} obj the updated public content category
         * @apiParam {Object} data the new path to the image of the category (looks like - {type: 'image', path: ''})
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{{}, data: null}' http://localhost:8080/api/admin/users/publicContent/categories?id=wwdmwaknfwbafajfjnabga
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Public_Content_Category
         * @apiDescription Delete a public content category
         * @apiGroup Admin_API
         * @api {delete} /api/admin/users/publicContent/categories Delete a public content category
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the public content category
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/users/publicContent/categories?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Public_Carousel
     * @apiDescription Get a list of public carousel items / a single public carousel item
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/carouselPublic Get a list of public carousel items / a single public carousel item
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/carouselPublic?id=null
     * @apiSuccess {Array} response.success a list of public carousel items / a single public carousel item
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Public_Carousel_Item
         * @apiDescription Create a public carousel item
         * @apiGroup Admin_API
         * @api {post} /api/admin/users/carouselPublic Create a public carousel item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/users/carouselPublic
         * @apiSuccess {Object} response.success the new public carousel item
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Public_Carousel
         * @apiDescription Update a public carousel item
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/carouselPublic Update a public carousel item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the public carousel item
         * @apiParam {Object} obj the updated public carousel item
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{{}}' http://localhost:8080/api/admin/users/carouselPublic?id=wwdmwaknfwbafajfjnabga
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function(req,res){
            PublicCarousel.update({_id: req.query.id}, {$set: req.body}, function (err, wRes) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res);
                }
            });
        })
        /**
         * @apiName Delete_Public_Carousel
         * @apiDescription Delete a public carousel item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/users/carouselPublic Delete a public carousel item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the public carousel item
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/users/carouselPublic?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Public_Carousel_By_Type
     * @apiDescription Get a list of public carousel associated contents
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/carouselPublic/contentByType Get a list of public carousel associated contents
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Number} type can be (1 = stire (noutati), 2 = articol (despre), 3 = elearning, 4 = download)
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/carouselPublic/contentByType?type=1
     * @apiSuccess {Array} response.success a list of public contents
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            PublicContent.find({type: req.query.type}, {title: 1, type:1}).sort({title: 1}).exec(function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });

    router.route('/admin/productPDF')
    /**
     * @apiName Create_Product_PDF
     * @apiDescription Create a PDF document for a product
     * @apiGroup Admin_API
     * @api {get} /api/admin/productPDF Create a PDF document for a product
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} html the html we want to convert to PDF
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/productPDF
     * @apiSuccess {Object} response.success an object containing the buffer for the PDF file
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *          buffer: ''
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
      .post(function(req, res){
        pdf.create(req.body.html, {format: "A3", header: {height: "40px"} , footer:{height: "40px"}}).toBuffer(function(err, buffer){
          if (err) {
            handleError(res, err, 500);
          } else {
            var newBuffer = buffer.toString('base64');
            handleSuccess(res, {buffer: newBuffer});
          }
        })
      });

    //Carousel Medic
    //===============================================================================================

    router.route('/admin/users/carouselMedic')
    /**
     * @apiName Medic_Carousel
     * @apiDescription Get a list of medic carousel items / a single medic carousel item
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/carouselMedic Get a list of medic carousel items / a single medic carousel item
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/carouselMedic?id=null
     * @apiSuccess {Array} response.success a list of medic carousel items / a single medic carousel item
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Medic_Carousel_Item
         * @apiDescription Create a medic carousel item
         * @apiGroup Admin_API
         * @api {post} /api/admin/users/carouselMedic Create a medic carousel item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/users/carouselMedic
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
                //check if content_id exists
                    var img = new Carousel({
                        title: 'Untitled',
                        enable:       false,
                        last_updated: new Date()
                    });
                    img.save(function (err, inserted) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, {}, 3);
                        }
                    });
        })
        /**
         * @apiName Update_Medic_Carousel
         * @apiDescription Update a medic carousel item
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/carouselMedic Update a medic carousel item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the medic carousel item
         * @apiParam {Object} data object containing 'toUpdate' property (object) which is the updated medic carousel item and 'imagePath' property (string) which is optional
         * @apiParam {Object} [info] object containing the current status of the medic carousel item (looks like - {isEnabled: true})
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{data : {toUpdate :{}}}' http://localhost:8080/api/admin/users/carouselMedic?id=wwdmwaknfwbafajfjnabga
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         * @apiUse BadRequest
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 BadRequest Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Medic_Carousel
         * @apiDescription Delete a medic carousel item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/users/carouselMedic Delete a medic carousel item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the medic carousel item
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/users/carouselMedic?id=djwafnan95252nfnwef
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Medic_Carousel_By_Type
     * @apiDescription Get a list of medic carousel items filtered by type
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/carouselMedic/contentByType Get a list of medic carousel items filtered by type
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Number} type can be (1 = national, 2 = international, 3 = stiintific)
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/carouselMedic/contentByType?type=3
     * @apiSuccess {Array} response.success a list of articles
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            Content.find({type: req.query.type}, {title: 1, type:1}).sort({title: 1}).exec(function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });


    router.route('/admin/divisions')
    /**
     * @apiName Get_Divisions
     * @apiDescription Get a list of divisions / a single division
     * @apiGroup Admin_API
     * @api {get} /api/admin/divisions Get a list of divisions / a single division
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the division
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/divisions?id=null
     * @apiSuccess {Array} response.success a list of divisions / a single division
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            if (req.query.id) {
                Divisions.findOne({_id: req.query.id}).exec(function (err, division) {
                    if (err) {
                        handleError(res, err, 500);
                    } else {
                        handleSuccess(res, division);
                    }
                })
            }
            else {
                Divisions.find({}).exec(function (err, divisions) {
                    if (err) {
                        handleError(res, err, 500);
                    }
                    else {
                        handleSuccess(res, divisions);
                    }
                })
            }
        })
        /**
         * @apiName Create_Division
         * @apiDescription Create a division
         * @apiGroup Admin_API
         * @api {post} /api/admin/divisions Create a division
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/divisions
         * @apiSuccess {Object} response.success the new division
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *     },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var division = new Divisions({
                name: 'Untitled'
            });
            division.save(function (err, saved) {
                if (err) {
                    handleError(res, err, 500)
                }
                else {
                    handleSuccess(res, saved, 2);
                }
            })
        })
        /**
         * @apiName Update_Division
         * @apiDescription Update a division
         * @apiGroup Admin_API
         * @api {put} /api/admin/divisions Update a division
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the division
         * @apiParam {Object} obj the updated division
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{name: '', code: ''}' http://localhost:8080/api/admin/divisions?id=widngnen222
         * @apiSuccess {Object} response.success the updated division
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *     },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            Divisions.findOne({_id: idToUpdate}).exec(function (err, division) {
                if (err || !division) {
                    handleError(res, err)
                }
                else {
                    Divisions.update({_id: idToUpdate}, {
                        $set: {
                            name: req.body.name,
                            code: SHA512(req.body.code).toString(),
                            lastUpdated: new Date()
                        }
                    }, function (err, updated) {
                        if (err) {
                            handleError(res, err);
                        }
                        else {
                            handleSuccess(res, updated, 3)
                        }
                    })
                }
            })
        })
        /**
         * @apiName Delete_Division
         * @apiDescription Delete a division
         * @apiGroup Admin_API
         * @api {delete} /api/admin/divisions Delete a division
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the division
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/divisions?id=widngnen222
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *     },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function (req, res) {
            var id = req.query.id;
            Divisions.findOne({_id: id}, function (err, division) {
                if (err) {
                    handleError(res, err, 500);
                }
                if (division) {
                    Divisions.remove({_id: id}).exec(function (err, div) {
                        if (err) {
                            handleError(res, err, 500);
                        }
                        else {
                            handleSuccess(res, {division: div}, 4);
                        }
                    })
                }
            })
        });

    router.route('/admin/products')
    /**
     * @apiName Get_Products
     * @apiDescription Get a list of products / a single product
     * @apiGroup Admin_API
     * @api {get} /api/admin/products Get a list of products / a single product
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the product
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/products?id=null
     * @apiSuccess {Array} response.success a list of products / a single product
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            if(req.query.id){
                Products.findOne({_id: req.query.id}).populate("therapeutic-areasID pathologiesID groupsID").exec(function(err, product) {
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
        /**
         * @apiName Add_Product
         * @apiDescription Add a product
         * @apiGroup Admin_API
         * @api {post} /api/admin/products Add a product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/products
         * @apiSuccess {Object} response.success the saved product
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              saved: {
         *
         *              }
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req, res) {
            var product = new Products({
                last_updated: new Date(),
                enable: true,
                name: 'Untitled'
            });
            product.save(function(err, saved) {
                if (err)
                    handleError(res,err,500);
                else
                    handleSuccess(res, {saved: saved}, 2);
            });
        })
        /**
         * @apiName Update_Product
         * @apiDescription Update a product
         * @apiGroup Admin_API
         * @api {put} /api/admin/products Update a product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} product the product object
         * @apiParam {Object} [info] an object for updating logo image / attached RCP (looks like - {logo: true //or false for RCP , path: ''})
         * @apiParam {String} id the id of the product
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{product: {}, info: {logo: true, path: ''}}' http://localhost:8080/api/admin/content/products?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Product
         * @apiDescription Delete a product
         * @apiGroup Admin_API
         * @api {delete} /api/admin/products Delete a product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the product
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/products?id=djwanfjan29152hnfha
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Articles
     * @apiDescription Get a list of articles / a single article
     * @apiGroup Admin_API
     * @api {get} /api/admin/content Get a list of articles / a single article
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the article
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content?id=null
     * @apiSuccess {Array} response.success a list of articles / a single article
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *             specialProduct: {},
     *             associatedProduct: {}
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            if(req.query.id){
                Content.findOne({_id:req.query.id}).populate('pathologiesID').exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, cont);
                    }
                })
            }else{
                Content.find({}).populate('pathologiesID').exec(function(err, cont) {
                    if(err) {
                        handleError(res,err,500);
                    }
                    else {
                        handleSuccess(res, cont);
                    }
                });
            }
        })
        /**
         * @apiName Add_Article
         * @apiDescription Add an article
         * @apiGroup Admin_API
         * @api {post} /api/admin/content Add an article
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/content
         * @apiSuccess {Object} response.success the saved article
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              saved: {
         *
         *              }
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req, res) {
            var content = new Content({
                title: 'Untitled',
                created: new Date(),
                last_updated: new Date(),
                author: 'Untitled'
            });
            content.save(function(err,saved) {
                if (err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {saved: saved}, 2);
                }
            });
        })
        /**
         * @apiName Update_Article
         * @apiDescription Update an article
         * @apiGroup Admin_API
         * @api {put} /api/admin/content Update an article
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} article the article object
         * @apiParam {Object} [info] an object containing the path to the new logo of the article or an array of associated images paths (looks like - {image: '', associated_images: ['','']})
         * @apiParam {Object} [enableArticle] an object containing the new status of the article (looks like - {enable: true //or false})
         * @apiParam {String} id the id of the article
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{file_path_prod: ''}' http://localhost:8080/api/admin/content/specialProducts/products?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
                            searchIndex.mongoosasticIndex(Content);
                            handleSuccess(res, {}, 3);
                        }
                    });
                }
            }
    })
        /**
         * @apiName Delete_Article
         * @apiDescription Delete article
         * @apiGroup Admin_API
         * @api {delete} /api/admin/content Delete article
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the article
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/content?id=djwanfjan29152hnfha
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Filtered_User_Groups
     * @apiDescription Get a list of user groups filtered by ids
     * @apiGroup Admin_API
     * @api {post} /api/admin/content/groupsByIds Get a list of user groups filtered by ids
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Array} ids the ids of user groups we want
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -d '{ids: []}' http://localhost:8080/api/admin/content/groupsByIds?id=null
     * @apiSuccess {Array} response.success a list of user groups filtered by ids
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Get_Special_Products
     * @apiDescription Get a list of special products / a single special product & it's simple product counterpart
     * @apiGroup Admin_API
     * @api {get} /api/admin/content/specialProducts/products Get a list of special products / a single special product & it's simple product counterpart
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the special product
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content/specialProducts/products?id=null
     * @apiSuccess {Array} response.success a list of special products / a single special product & it's simple product counterpart
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *             specialProduct: {},
     *             associatedProduct: {}
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            var q = {};
            if(req.query.id){
                q._id = req.query.id;
            }
            specialProduct.find(q).populate('pathologiesID').exec(function (err, products) {
                if(err){
                    handleError(res,err,500);
                }else{
                    if(products.length > 1){
                        handleSuccess(res, products);
                    } else {
                        Products.findOne({name: products[0].product_name}).exec(function (err, foundProd) {
                            if(err){
                                handleError(res,err,500);
                            } else {
                                var objectToSend = {};
                                objectToSend.specialProduct = products[0];
                                if(foundProd){
                                    objectToSend.associatedProduct = foundProd;
                                }
                                handleSuccess(res, objectToSend);
                            }
                        })
                    }
                }
            })
        })
        /**
         * @apiName Add_Special_Product
         * @apiDescription Add a special product
         * @apiGroup Admin_API
         * @api {post} /api/admin/content/specialProducts/products Add a special product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} productType the type of the special product (can be "product", "resource")
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{productType: 'product'}' http://localhost:8080/api/admin/content/specialProducts/products
         * @apiSuccess {Object} response.success the saved special product
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              justSaved: {
         *
         *              }
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var toCreate = new specialProduct({
                product_name: 'Untitled',
                header_title: 'Untitled',
                productType: req.body.productType
            });
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {justSaved: saved}, 2);
                }
            });
        })
        /**
         * @apiName Update_Special_Product
         * @apiDescription Update a special product
         * @apiGroup Admin_API
         * @api {put} /api/admin/content/specialProducts/products Update a special product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the menu object
         * @apiParam {String} file_path_prod the path for the RCP file to attach to the simple product counterpart (included in previous parameter as property)
         * @apiParam {String} id the id of the special product
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{file_path_prod: ''}' http://localhost:8080/api/admin/content/specialProducts/products?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function (req, res) {
            if(req.body.file_path_prod){
                var forAssociatedProd = {
                    file_path: req.body.file_path_prod
                };
                var prodKey = req.body.file_key;
                delete req.body.file_key;
                delete req.body.file_path_prod;
            }
            specialProduct.update({_id: req.query.id}, {$set: req.body}, function (err, wRes) {
                if(err){
                    console.log(err);
                    handleError(res,err,500);
                }else{
                    searchIndex.mongoosasticIndex(specialProduct);
                    if(forAssociatedProd){
                        Products.update({_id: prodKey},{$set:forAssociatedProd}, function (err, wRes) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                handleSuccess(res, {updated:wRes}, 3);
                            }
                        });
                    } else {
                        handleSuccess(res, {}, 3);
                    }
                }
            });
        })
        /**
         * @apiName Delete_Special_Product
         * @apiDescription Delete special product
         * @apiGroup Admin_API
         * @api {delete} /api/admin/content/specialProducts/products Delete special product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the special product
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/content/specialProducts/products?id=djwanfjan29152hnfha
         * @apiSuccess {Object} response.success an object with how many special products were deleted and how many related items were deleted
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *            deletedProducts : 1,
         *            deletedConnections: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Special_Product_Menu
     * @apiDescription Get a special product's menu / a single menu item
     * @apiGroup Admin_API
     * @api {get} /api/admin/content/specialProducts/menu Get a special product's menu / a single menu item
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the menu item
     * @apiParam {String} product_id the id of the special product
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content/specialProducts/menu?id=null&product_id=jdwajuugeugbnbdbv999
     * @apiSuccess {Array} response.success a special product's menu / a single menu item
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Add_Menu_Item_To_Special_Product
         * @apiDescription Add a menu item to a special product
         * @apiGroup Admin_API
         * @api {post} /api/admin/content/specialProducts/menu Add a menu item to a special product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj a menu item (see specialProduct_Menu model)
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/content/specialProducts/menu
         * @apiSuccess {Object} response.success the saved menu item
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              saved: {
         *
         *              }
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Special_Product_Menu_Item
         * @apiDescription Update a special product menu item
         * @apiGroup Admin_API
         * @api {put} /api/admin/content/specialProducts/menu Update a special product menu item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the menu object
         * @apiParam {String} id the id of the menu item
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/content/specialProducts/menu?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function (req, res) {
            specialProductMenu.update({_id: req.query.id}, {$set: req.body}, function (err, wRes) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 3);
                }
            })
        })
        /**
         * @apiName Delete_Special_Product_Menu_Item
         * @apiDescription Delete special product menu item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/content/specialProducts/menu Delete special product menu item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the special product menu item
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/content/specialProducts/menu?id=djwanfjan29152hnfha
         * @apiSuccess {Object} response.success an object with how many menu items were deleted
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *            deleteCount : 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Update_Special_Product_Child_Menu_Item
     * @apiDescription Update a special product child menu item
     * @apiGroup Admin_API
     * @api {put} /api/admin/content/specialProducts/addMenuChild Update a special product child menu item
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Object} child_id the child menu item object
     * @apiParam {String} id the id of the child menu item
     * @apiExample {curl} Example usage:
     *     curl -i -x PUT -d '{child_id: {}}' http://localhost:8080/api/admin/content/specialProducts/addMenuChild?id=nfnbnuebvneajab
     * @apiSuccess {Object} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
         *          error: "",
         *          data: {}
         *     }
     */
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
    /**
     * @apiName Get_Special_Product_Glossary
     * @apiDescription Get a special product's glossary / a single glossary item
     * @apiGroup Admin_API
     * @api {get} /api/admin/content/specialProducts/glossary Get a special product's glossary / a single glossary item
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} _id the id of the glossary item
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content/specialProducts/glossary?_id=null
     * @apiSuccess {Array} response.success a special product's glossary / a single glossary item
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Add_Glossary_Item_To_Special_Product
         * @apiDescription Add a glossary item to a special product
         * @apiGroup Admin_API
         * @api {post} /api/admin/content/specialProducts/glossary Add a glossary item to a special product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj a glossary item (see specialProduct_glossary model)
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/content/specialProducts/glossary
         * @apiSuccess {Object} response.success the saved glossary item
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              saved: {
         *
         *              }
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Special_Product_Glossary_Item
         * @apiDescription Update a special product glossary item
         * @apiGroup Admin_API
         * @api {put} /api/admin/content/specialProducts/glossary Update a special product glossary item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the glossary object
         * @apiParam {String} id the id of the glossary item
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/content/specialProducts/glossary?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with the number of updated glossary items
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          updateCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Special_Product_Glossary_Item
         * @apiDescription Delete special product glossary item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/content/specialProducts/glossary Delete special product glossary item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the special product glossary item
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/content/specialProducts/glossary?id=djwanfjan29152hnfha
         * @apiSuccess {Object} response.success an object with how many glossary item were deleted
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *            removeCount : 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Special_Product_Resources
     * @apiDescription Get a list of special product resources / a single resource
     * @apiGroup Admin_API
     * @api {get} /api/admin/content/specialProducts/resources Get a list of special product resources / a single resource
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} _id the id of the resource
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content/specialProducts/resources?_id=null
     * @apiSuccess {Array} response.success a list of special product resources / a single resource
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {resources : [{
     *
     *        }]},
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Add_Resource_To_Special_Product
         * @apiDescription Add a resource to a special product
         * @apiGroup Admin_API
         * @api {post} /api/admin/content/specialProducts/resources Add a resource to a special product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj a resource (see specialProduct_files model)
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/content/specialProducts/resources
         * @apiSuccess {Object} response.success the saved resource
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              saved: {
         *
         *              }
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Special_Product_Resource
         * @apiDescription Update a special product resource
         * @apiGroup Admin_API
         * @api {put} /api/admin/content/specialProducts/resources Update a special product resource
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the resource object
         * @apiParam {String} id the id of the resource
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/content/specialProducts/resources?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with the number of updated resources
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          updateCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Special_Product_Resource
         * @apiDescription Delete special product resource
         * @apiGroup Admin_API
         * @api {delete} /api/admin/content/specialProducts/resources Delete special product resource
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the special product resource
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/content/specialProducts/resources?id=djwanfjan29152hnfha
         * @apiSuccess {Object} response.success an object with how many resources were deleted
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *            removeCount : 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Special_Product_Speakers
     * @apiDescription Get a list of speakers / speakers for a special product / a single speaker
     * @apiGroup Admin_API
     * @api {get} /api/admin/content/specialProducts/speakers Get a list of speakers / speakers for a special product / a single speaker
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [product] the id of the special product
     * @apiParam {String} [id] the id of the speaker
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content/specialProducts/speakers?id=null
     * @apiSuccess {Array} response.success a list of speakers / speakers for a special product / a single speaker
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with speaker id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Add_Speaker_To_Special_Product
         * @apiDescription Add a speaker to a special product
         * @apiGroup Admin_API
         * @api {post} /api/admin/content/specialProducts/speakers Add a speaker to a special product
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} speaker_id the id of the speaker to add
         * @apiParam {String} product_id the id of the special product to update speakers list
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{speaker_id: '', product_id: ''}' http://localhost:8080/api/admin/content/specialProducts/speakers
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Speaker_From_Special_Product
         * @apiDescription Delete speaker from special product speaker list
         * @apiGroup Admin_API
         * @api {delete} /api/admin/content/specialProducts/speakers Delete speaker from special product speaker list
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} speaker_id the id of the speaker to remove from list
         * @apiParam {String} product_id the id of the special product to update speakers list
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE -d '{speaker_id: '', product_id: ''}' http://localhost:8080/api/admin/content/specialProducts/speakers
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Special_Apps
     * @apiDescription Get a list of special apps / a single special app
     * @apiGroup Admin_API
     * @api {get} /api/admin/content/specialApps/apps Get a list of special apps / a single special app
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the special app
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content/specialApps/apps?id=djwanfvaenbvabnev
     * @apiSuccess {Array} response.success a list of special apps / a single special app
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Special_App
         * @apiDescription Create a special app
         * @apiGroup Admin_API
         * @api {post} /api/admin/content/specialApps/apps Create a special app
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/content/specialApps/apps
         * @apiSuccess {Object} response.success the new special app
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var toSave = new specialApps({
                name: 'Untitled'
            });
            toSave.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        /**
         * @apiName Update_Special_App
         * @apiDescription Update a special app
         * @apiGroup Admin_API
         * @api {put} /api/admin/content/specialApps/apps Update a special app
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the special app object
         * @apiParam {String} id the id of the special app
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/content/specialApps/apps?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Special_App
         * @apiDescription Delete a special app
         * @apiGroup Admin_API
         * @api {delete} /api/admin/content/specialApps/apps Delete a special app
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the special app
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/content/specialApps/apps?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            Pathologies.update({}, {$pull: {specialApps: idToDelete}}, {multi: true}, function (err, wres) {
                if(err){
                    handleError(res,err,500);
                }else{
                    specialApps.remove({_id: idToDelete}, function (err, wres) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, wres);
                        }
                    });
                }
            });
        });

    router.route('/admin/content/specialApps/groups')
    /**
     * @apiName Get_Groups_For_Special_Apps
     * @apiDescription Get a list of groups for special apps
     * @apiGroup Admin_API
     * @api {get} /api/admin/content/specialApps/groups Get a list of groups for special apps
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/content/specialApps/groups
     * @apiSuccess {Array} response.success a list of groups
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            UserGroup.find({content_specific: true}).populate('profession').exec(function (err, groups) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, groups);
                }
            });
        });


    router.route('/admin/applications/upgrade')
    /**
     * @apiName Get_Hybrid_App
     * @apiDescription Get a list of hybrid apps / a single hybrid app
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/upgrade Get a list of hybrid apps / a single hybrid app
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the hybrid app
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/upgrade?id=null
     * @apiSuccess {Array} response.success a list of hybrid apps / a single hybrid app
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req,res){
            if(req.query.id){
                AppUpdate.findOne({_id:req.query.id},function(err,edit){
                    if (err){
                        handleError(res,err,500)
                    }else{
                        handleSuccess(res,edit);
                    }
                })
            }else {
                AppUpdate.find({}, function (err, apps) {
                    if (err) {
                        handleError(res, err, 500);
                    } else {
                        handleSuccess(res, apps);
                    }
                })
            }
        })
        /**
         * @apiName Create_Hybrid_App
         * @apiDescription Create a hybrid app
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/upgrade Create a hybrid app
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/applications/upgrade
         * @apiSuccess {Object} response.success the new hybrid app
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
            var app = new AppUpdate({
                name:'Untitled',
                upgradeDate:new Date()
            });
            app.save(function(err,saved){
                if(err){
                    handleError(res,err);
                }else{
                    handleSuccess(res,saved);
                }
            })
        })
        /**
         * @apiName Update_Hybrid_App
         * @apiDescription Update a hybrid app
         * @apiGroup Admin_API
         * @api {put} /api/admin/applications/upgrade Update a hybrid app
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the hybrid app object
         * @apiParam {String} id the id of the hybrid app
         * @apiParam {String} name the name of the hybrid app
         * @apiParam {String} downloadUrl the download Url of the hybrid app
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/applications/upgrade?id=sjafah&downloadUrl=SomeURL&name=someName
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function(req,res) {
            AppUpdate.findOne({$or: [{'downloadUrl': req.query.downloadUrl}, {'name': req.query.name}]}, function (err, resp) {
                if (err){
                    handleError(res,err,500);
                }else{
                    if(!resp){
                        AppUpdate.update({_id: req.query.id}, {$set: req.body}, function (err, wres) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                handleSuccess(res, wres);
                            }
                        });
                    } else if(req.query.id == resp._id){
                        AppUpdate.update({_id: req.query.id}, {$set: req.body}, function (err, wres) {
                            if(err){
                                handleError(res,err,500);
                            }else{
                                handleSuccess(res, wres);
                            }
                        });
                    } else {
                        handleError(res,null,400,43);
                    }
                }
            })
        })
        /**
         * @apiName Delete_Hybrid_App
         * @apiDescription Delete a hybrid app
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/upgrade Delete a hybrid app
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the hybrid app
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/upgrade?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function(req,res){
            var idToDelete = ObjectId(req.query.id)
            AppUpdate.remove({_id:idToDelete},function(err,wres){
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,wres);
                }
            });
        });


        var updateCategory = function(id,body,res){
          guidelineCategory.update({_id:id},{$set:body},function(err,wres){
              if(err){
                  handleError(res,err,500);
              }else{
                  ModelInfos.recordLastUpdate("guideline");
                  handleSuccess(res,wres);
              }
          });
        };

        var updateCategoryNameInFiles = function(id,name,res,body){
        guidelineCategory.findOne({_id:id}).populate('guidelineFiles').exec(function(err,resp){
          if (resp.guidelineFiles.length != 0){
            async.each(resp.guidelineFiles,function(file,callback){
              guidelineFile.update({_id:file._id},{$set:{guidelineCategoryName:name}},function(err,nres){
                if(err){
                  callback(err);
                }else{
                  callback();
                }
              })
            },function(err,nres){
              if(err){
                handleError(res,err,500);
              }else{
                handleSuccess(res,nres);
              }
            })

          }else{
            updateCategory(id,body,res);
          }
        })
      };

    router.route('/admin/applications/guidelines/Category')
    /**
     * @apiName Get_Guidelines_Category
     * @apiDescription Get a list of guidelines categories / a single guidelines category
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/guidelines/Category Get a list of guidelines categories / a single guidelines category
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the guidelines category
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/guidelines/Category?id=null
     * @apiSuccess {Array} response.success a list of guidelines categories / a single guidelines category
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req,res){
              if(req.query.id){
                  guidelineCategory.findOne({_id:req.query.id},function(err,category){
                      if(err){
                          handleError(res,err,500);
                      }else {
                          handleSuccess(res,category);
                      }
                  })
              }  else{
                  guidelineCategory.find({}).sort({'creationDate':'desc'}).exec(function(err,categories){
                      if(err){
                          handleError(res,err,500);
                      }else{
                          handleSuccess(res,categories);
                      }
                  });
              }
        })
        /**
         * @apiName Create_Guidelines_Category
         * @apiDescription Create a guidelines Category
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/guidelines/Category Create a guidelines Category
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/applications/guidelines/Category
         * @apiSuccess {Object} response.success the new guidelines Category
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
            var toSave = new guidelineCategory({
                name:'Untitled',
                lastModified:new Date(),
                creationDate:new Date()
            });
            toSave.save(function(err,saved){
                if(err){
                    handleError(res,err,500);
                }
                handleSuccess(res,saved);
            })

        })
        /**
         * @apiName Update_Category
         * @apiDescription Update a Category
         * @apiGroup Admin_API
         * @api {put} /api/admin/applications/guidelines/Category Update a Category
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the Category object
         * @apiParam {String} id the id of the Category
         * @apiParam {String} name the name of the Category
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/applications/guidelines/Category?id=nfnbnuebvneajab&name=SomeName
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function(req,res){
            guidelineCategory.findOne({name:req.query.name},function(err,resp){
                if (err){
                    handleError(res,err,500);
                }else{
                    if(!resp){
                        guidelineCategory.update({_id:req.query.id},{$set:req.body},function(err,wres){
                            if(err){
                                handleError(res,err,500);
                            }else{
                                  updateCategoryNameInFiles(req.query.id,req.query.name,res,req.body);
                            }
                        });
                    }else if (req.query.id == resp._id ){
                        updateCategory(req.query.id,req.body,res);
                    }
                    else{
                        handleError(res,null,400,43);
                    }
                }
            })
        })
        /**
         * @apiName Delete_Guidelines_Category
         * @apiDescription Delete a guidelines Category
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/guidelines/Category Delete a guidelines Category
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the guidelines Category
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/guidelines/Category?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function(req,res){
            guidelineCategory.findOne({_id:req.query.id}).populate('guidelineFiles').exec(function(err,resp){
                if (err){
                    return handleError(res,err,500);
                }else{
                 async.each(resp.guidelineFiles,function(file,callback){
                    guidelineFile.findOneAndUpdate({_id:file._id},{$set:{guidelineCategoryName:null}},function(err,nres){
                        if(err){
                            callback(err);
                        }else{
                            callback();
                        }
                    })
                },function(err,nres){
                    if(err){
                        handleError(res,err,500);
                    }else{
                        guidelineCategory.remove({_id:req.query.id},function(err,deleted){
                            if(err){
                                handleError(res,err,500);
                            }
                            else{
                                ModelInfos.recordLastUpdate("guideline");
                                handleSuccess(res,deleted)
                            }
                        })
                     }
                });
            }
         })

        });

        var removeFileRefFromCategory = function(id,res){
            guidelineCategory.update({guidelineFiles:id},{$pull:{guidelineFiles:id},lastModified:new Date()},function(err,removed){
              if (err){
                return handleError(res,err,500);
              }
              ModelInfos.recordLastUpdate("guideline");
                handleSuccess(res,removed);
            })
        };

        var updateFile = function(id,body,res){
          guidelineFile.update({_id:id},{$set:body},function(err,updated){
            if (err){
              return handleError(res,err,500);
            }
            ModelInfos.recordLastUpdate("guideline");
            handleSuccess(res,updated);
          })
        };

        var putFileInNewCategory = function(categoryId,fileId,fileBody,res){
          guidelineCategory.update({guidelineFiles:fileId},{$pull:{guidelineFiles:fileId}},function(err,wres){
              if(err){
                  return handleError(res,err,500);
              }
              guidelineCategory.update({_id:categoryId},{$addToSet:{guidelineFiles:fileId}},function(err,nres){
                  if(err){
                      return handleError(res,err,500);
                  }
                    updateFile(fileId,fileBody,res);
              })
          })
        };

    router.route('/admin/applications/guidelines/File')
    /**
     * @apiName Get_Guidelines_Files
     * @apiDescription Get a list of guidelines files / a single guidelines file
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/guidelines/File Get a list of guidelines files / a single guidelines file
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the guidelines file
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/guidelines/File?id=null
     * @apiSuccess {Array} response.success a list of guidelines files / a single guidelines file
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req,res){
            if(req.query.id){
                guidelineFile.findOne({_id:req.query.id},function(err,file){
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,file);
                    }
                })
            }else{
                guidelineFile.find({}).sort({'creationDate':'desc'}).exec(function(err,files){
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,files);
                    }
                })
            }
        })
        /**
         * @apiName Create_Guidelines_File
         * @apiDescription Create a guidelines file
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/guidelines/File Create a guidelines file
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/applications/guidelines/File
         * @apiSuccess {Object} response.success the new guidelines file
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
              var toSave = new guidelineFile({
                  displayName:'Untitled',
                  actualName:'Untitled',
                  lastModified:new Date(),
                  creationDate:new Date()
              });
              toSave.save(function(err,saved){
                  if(err){
                      handleError(res,err,500);
                  }else{
                      handleSuccess(res,saved);
                  }
                })
        })
        /**
         * @apiName Update_Guidelines_File
         * @apiDescription Update a guidelines file
         * @apiGroup Admin_API
         * @api {put} /api/admin/applications/guidelines/File Update a guidelines file
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the guidelines file object
         * @apiParam {String} fileId the id of the guidelines file
         * @apiParam {String} [categoryId] the id of the category the file is attached to
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/applications/guidelines/File?fileId=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with the updated guidelines file
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function(req,res){
            if(req.query.categoryId){
                guidelineCategory.find({_id:req.query.categoryId}).populate('guidelineFiles',null,{displayName:req.body.displayName}).exec(function(err,resp){
                    if(resp[0].guidelineFiles.length == 0){
                          putFileInNewCategory(req.query.categoryId,req.query.fileId,req.body,res);
                    }else if(resp[0].guidelineFiles[0]._id == req.query.fileId){
                          updateFile(req.query.fileId,req.body,res);
                    }
                    else if(resp[0].guidelineFiles.length > 0 ){
                        return handleError(res,null,400,43);
                    }
                })
            }else{
                updateFile(req.query.fileId,req.body,res);
            }
        })
        /**
         * @apiName Delete_Guidelines_File
         * @apiDescription Delete a guidelines file
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/guidelines/File Delete a guidelines file
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the guidelines file
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/guidelines/File?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function(req,res){
           guidelineFile.remove({_id:req.query.id},function(err,wres){
               if(err){
                   handleError(res,err,500);
               }else{
                   removeFileRefFromCategory(req.query.id,res);
               }
           })
        });

    router.route('/admin/applications/myPrescription')
    /**
     * @apiName Get_Prescription
     * @apiDescription Get a list of prescriptions
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/myPrescription Get a list of prescriptions
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/myPrescription
     * @apiSuccess {Array} response.success a list of prescriptions
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
      .get(function(req, res){
        myPrescription.find({},function(err,info){
          if(err){
            return handleError(res,err,500);
          }else{
            handleSuccess(res,info);
          }
        })
      })
      /**
       * @apiName Update_Prescription
       * @apiDescription Update a prescription
       * @apiGroup Admin_API
       * @api {put} /api/admin/applications/myPrescription Update a prescription
       * @apiVersion 1.0.0
       * @apiPermission admin
       * @apiPermission devModeAdmin
       * @apiParam {Object} update the prescription object
       * @apiParam {String} id the id of the prescription
       * @apiExample {curl} Example usage:
       *     curl -i -x PUT -d '{update: {}}' http://localhost:8080/api/admin/applications/myPrescription?id=nfnbnuebvneajab
       * @apiSuccess {Object} response.success an object with the updated prescription
       * @apiSuccess {String} response.message A message
       * @apiSuccessExample {json} Success-Response:
       *     HTTP/1.1 200 OK
       *     {
         *        success : {
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
       * @apiUse ErrorOnServer
       * @apiErrorExample {json} Error-Response (500):
       *     HTTP/1.1 500 Server Error
       *     {
         *          error: "",
         *          data: {}
         *     }
       */
      .put(function(req,res){
        myPrescription.update({_id:req.query.id},{$set:req.body.update},function(err,updated){
          if(err){
            return handleError(res,err,500);
          }else{
            ModelInfos.recordLastUpdate("myPrescription");
            handleSuccess(res,updated);
          }
        })
      });

    router.route('/admin/events/events')
    /**
     * @apiName Get_Events
     * @apiDescription Get a list of events / a single event
     * @apiGroup Admin_API
     * @api {get} /api/admin/events/events Get a list of events / a single event
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the event
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/events/events?id=null
     * @apiSuccess {Array} response.success a list of events / a single event
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with talk id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            if(req.query.id){
                Events.findOne({_id: req.query.id}).select('-listconferences').populate('groupsID pathologiesID').exec(function (err, event) {
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
        /**
         * @apiName Create_Event
         * @apiDescription Create a event
         * @apiGroup Admin_API
         * @api {post} /api/admin/events/events Create a event
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the event object
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/events/events
         * @apiSuccess {Object} response.success the new event
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Event
         * @apiDescription Update an event
         * @apiGroup Admin_API
         * @api {put} /api/admin/events/events Update an event
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the event object
         * @apiParam {String} id the id of the event
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/events/events?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with how many events were updated
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          updateCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function (req, res) {
            var idToUpdate = ObjectId(req.query.id);
            Events.update({_id: idToUpdate}, {$set: req.body}, function (err, wres) {
                if(err){
                    handleError(res,err);
                }else{
                    searchIndex.mongoosasticIndex(Events);
                    handleSuccess(res,{updateCount: wres},3);
                }
            });
        })
        /**
         * @apiName Delete_Event
         * @apiDescription Delete an event
         * @apiGroup Admin_API
         * @api {delete} /api/admin/events/events Delete an event
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the event
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/events/events?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Speakers
     * @apiDescription Get a list of speakers / a single speaker
     * @apiGroup Admin_API
     * @api {get} /api/admin/events/speakers Get a list of speakers / a single speaker
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the speaker
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/events/speakers?id=null
     * @apiSuccess {Array} response.success a list of speakers / a single speaker
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Speaker
         * @apiDescription Create a speaker
         * @apiGroup Admin_API
         * @api {post} /api/admin/events/speakers Create a speaker
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/events/speakers
         * @apiSuccess {Object} response.success the new speaker
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var toCreate = new Speakers({
                first_name: 'Untitled',
                last_name: 'Untitled',
                last_updated: new Date()
            });
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, saved);
                }
            });
        })
        /**
         * @apiName Update_Speaker
         * @apiDescription Update a speaker
         * @apiGroup Admin_API
         * @api {put} /api/admin/events/speakers Update a speaker
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the speaker object
         * @apiParam {String} id the id of the speaker
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/events/speakers?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with how many speakers were updated
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          updateCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Speaker
         * @apiDescription Delete a speaker
         * @apiGroup Admin_API
         * @api {delete} /api/admin/events/speakers Delete a speaker
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the speaker
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/events/speakers?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Conference
     * @apiDescription Get a list of conferences / conferences associated to a event / a single conference
     * @apiGroup Admin_API
     * @api {get} /api/admin/events/conferences Get a list of conferences / conferences associated to a event / a single conference
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [event] the id of the event
     * @apiParam {String} [id] the id of the conference
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/events/conferences?event=null&id=null
     * @apiSuccess {Array} response.success a list of conferences / conferences associated to a event / a single conference
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with conference id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Conference
         * @apiDescription Create a conference
         * @apiGroup Admin_API
         * @api {post} /api/admin/events/rooms Create a conference
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the conference object
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/events/conferences
         * @apiSuccess {Object} response.success the new conference
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Conference
         * @apiDescription Update a conference
         * @apiGroup Admin_API
         * @api {put} /api/admin/events/conferences Update a conference
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the conference object
         * @apiParam {String} id the id of the conference
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/events/conferences?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with how many conferences were updated
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          updateCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Conference
         * @apiDescription Delete a conference
         * @apiGroup Admin_API
         * @api {delete} /api/admin/events/conferences Delete a conference
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the conference
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/events/conferences?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Rooms
     * @apiDescription Get a list of rooms associated to a event / a single room
     * @apiGroup Admin_API
     * @api {get} /api/admin/events/rooms Get a list of rooms associated to a event / a single room
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} event the id of the event
     * @apiParam {String} [id] the id of the room
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/events/rooms?event=dwafgwt3t&id=null
     * @apiSuccess {Array} response.success a list of rooms associated to a event / a single room
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with talk id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Room
         * @apiDescription Create a room
         * @apiGroup Admin_API
         * @api {post} /api/admin/events/rooms Create a room
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the room object
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/events/rooms
         * @apiSuccess {Object} response.success the new room
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Room
         * @apiDescription Update a room
         * @apiGroup Admin_API
         * @api {put} /api/admin/events/rooms Update a room
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the room object
         * @apiParam {String} id the id of the room
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/events/rooms?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with how many rooms were updated
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          updateCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Room
         * @apiDescription Delete a room
         * @apiGroup Admin_API
         * @api {delete} /api/admin/events/rooms Delete a room
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the room
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/events/rooms?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Talks
     * @apiDescription Get a list of talks associated to a conference / a single talk
     * @apiGroup Admin_API
     * @api {get} /api/admin/events/talks Get a list of talks associated to a conference / a single talk
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} conference the id of the conference
     * @apiParam {String} [id] the id of the talk
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/events/talks?conference=dwafgwt3t&id=null
     * @apiSuccess {Array} response.success a list of talks associated to a conference / a single talk
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with talk id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Talk
         * @apiDescription Create a talk
         * @apiGroup Admin_API
         * @api {post} /api/admin/events/talks Create a talk
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the talk object
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/events/talks
         * @apiSuccess {Object} response.success the new talk
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Talk
         * @apiDescription Update a talk
         * @apiGroup Admin_API
         * @api {put} /api/admin/events/talks Update a talk
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj the talk object
         * @apiParam {String} id the id of the talk
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/events/talks?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with how many talks were updated
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          updateCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Talk
         * @apiDescription Delete a talk
         * @apiGroup Admin_API
         * @api {delete} /api/admin/events/talks Delete a talk
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the talk
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/events/talks?id=nfnbnuebvneajab
         * @apiSuccess {Object} response.success an object with how many talks were deleted
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *          deleteCount: 1
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Conference_To_Event
     * @apiDescription Add a conference to a event
     * @apiGroup Admin_API
     * @api {get} /api/admin/events/conferenceToEvent Add a conference to a event
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} idEvent the id of the event
     * @apiParam {String} idConference the id of the conference
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/events/conferenceToEvent?idEvent=dwafgwt3t&idConference=dwamnfnawbfabw
     * @apiSuccess {Object} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Get_Multimedia_List
     * @apiDescription Get a list of multimedia / a single multimedia
     * @apiGroup Admin_API
     * @api {get} /api/admin/multimedia Get a list of multimedia / a single multimedia
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the multimedia
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/multimedia?id=null
     * @apiSuccess {Array} response.success an array of multimedia / a single multimedia
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            if(req.query.id){
                Multimedia.findOne({_id: req.query.id}).populate("therapeutic-areasID pathologiesID groupsID").exec(function(err, product) {
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
        /**
         * @apiName Create_Multimedia
         * @apiDescription Create a multimedia item
         * @apiGroup Admin_API
         * @api {post} /api/admin/multimedia Create a multimedia item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/multimedia
         * @apiSuccess {Object} response.success the new multimedia item
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *              justSaved : {
         *
         *              }
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var toCreate = new Multimedia({
                author : 'Untitled',
                last_updated : new Date(),
                title : 'Untitled'
            });
            toCreate.save(function (err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {justSaved: saved}, 2);
                }
            });
        })
        /**
         * @apiName Update_Multimedia
         * @apiDescription Update a multimedia item
         * @apiGroup Admin_API
         * @api {put} /api/admin/multimedia Update a multimedia item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} [info] used for updating thumb image / video attached (looks like this: {image: '', video: null})
         * @apiParam {Object} [enableMultimedia] used for enable/disable (looks like this: enableMultimedia: {isEnabled: true})
         * @apiParam {Object} multimedia the updated multimedia item
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{multimedia: {}}' http://localhost:8080/api/admin/multimedia?id=wdnajfnugfew2chfbec
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
                            searchIndex.mongoosasticIndex(Multimedia);
                            handleSuccess(res, {}, 3);
                        }
                    });
                }
            }
        })
        /**
         * @apiName Delete_Multimedia
         * @apiDescription Delete a multimedia item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/multimedia Delete a multimedia item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} id the id of the multimedia item
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/multimedia?id=wdnajfnugfew2chfbec
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Therapeutic_Areas_List
     * @apiDescription Get a list of therapeutic areas / a single therapeutic area
     * @apiGroup Admin_API
     * @api {get} /api/admin/areas Get a list of therapeutic areas / a single therapeutic area
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [id] the id of the therapeutic area
     * @apiParam {Boolean} [parentsOnly] if we want only parent therapeutic areas
     * @apiParam {Array} [exclude] array of therapeutic area ids to exclude
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/areas?id=null&parentsOnly=true&exclude=null
     * @apiSuccess {Array} response.success an array of therapeutic areas
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Therapeutic_Area
         * @apiDescription Create a therapeutic area
         * @apiGroup Admin_API
         * @api {post} /api/admin/areas Create a therapeutic area
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/areas
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req, res) {
            var therapeutic = new Therapeutic_Area({
                last_updated: new Date(),
                name: 'Untitled'
            });
            therapeutic.save(function(err, saved) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res);
                }
            });
        })
        /**
         * @apiName Update_Therapeutic_Area
         * @apiDescription Update a therapeutic area
         * @apiGroup Admin_API
         * @api {put} /api/admin/areas Update a therapeutic area
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the area
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/areas?id=dnwajfnae87gtnvbvsbe
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function(req, res) {
            var area = req.body;
            area.last_updated = Date.now();
            Therapeutic_Area.update({_id: req.query.id}, {$set: area}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        })
        /**
         * @apiName Delete_Therapeutic_Area
         * @apiDescription Delete a therapeutic area
         * @apiGroup Admin_API
         * @api {delete} /api/admin/areas Delete a therapeutic area
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the area
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/areas?id=dnwajfnae87gtnvbvsbe
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Therapeutic_Areas
     * @apiDescription Get a list of therapeutic areas
     * @apiGroup Admin_API
     * @api {get} /api/admin/therapeutic_areas Get a list of therapeutic areas
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/therapeutic_areas
     * @apiSuccess {Array} response.success an array of therapeutic areas
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res, cont);
            });
        });


    router.route('/admin/applications/qa/topics')
    /**
     * @apiName QA_Topic_List
     * @apiDescription Get a list of QA topics
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/qa/topics Get a list of QA topics
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/qa/topics
     * @apiSuccess {Array} response.success an array with topics
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       [{
     *
     *       }]
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
        .get(function (req, res) {
            Topics.find({}, function (err, topics) {
                if(err){
                    res.send(err);
                }else{
                    res.json(topics);
                }
            });
        })
        /**
         * @apiName Create_QA_Topic
         * @apiDescription Create a QA topic
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/qa/topics Create a QA topic
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} name the topic name
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{name: ""}' http://localhost:8080/api/admin/applications/qa/topics
         * @apiSuccess {Object} response.success an object with a response message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *         message : {
         *              type: '',
         *              text: ''
         *         }
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *         message : {
         *              type: '',
         *              text: ''
         *         }
         *     }
         */
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
        /**
         * @apiName Update_QA_Topic
         * @apiDescription Update a QA topic
         * @apiGroup Admin_API
         * @api {put} /api/admin/applications/qa/topics Update a QA topic
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} name the topic name
         * @apiParam {String} id the id of the topic
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{id: "", name: ""}' http://localhost:8080/api/admin/applications/qa/topics
         * @apiSuccess {Object} response.success an object with a response message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *         message : {
         *              type: '',
         *              text: ''
         *         }
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *         message : {
         *              type: '',
         *              text: ''
         *         }
         *     }
         */
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
    /**
     * @apiName QA_Topic
     * @apiDescription Get a QA topic by id
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/qa/topicById/:id Get a QA topic by id
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the topic
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/qa/topicById/dwah8t8375fnnvnvbvye
     * @apiSuccess {Object} response.success an object with the topic
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
        .get(function (req, res) {
            Topics.findOne({_id: req.params.id}, function (err, topic) {
                if(err){
                    res.send(err);
                }else{
                    res.send(topic);
                }
            });
        })
        /**
         * @apiName Delete_QA_Topic
         * @apiDescription Delete a QA topic by id
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/qa/topicById/:id Delete a QA topic by id
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the topic
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/qa/topicById/dwah8t8375fnnvnvbvye
         * @apiSuccess {Object} response.success an object with a response message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *          message: {
         *              type: '',
         *              text: ''
         *          }
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          message: {
         *              type: '',
         *              text: ''
         *          }
         *     }
         */
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
    /**
     * @apiName QA_Medic_Answerers
     * @apiDescription Get a list of QA Medic Answerers
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/qa/answerGivers Get a list of QA Medic Answerers
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/qa/answerGivers
     * @apiSuccess {Array} response.success an array of QA medics answerers
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       [{
     *
     *       }]
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
        .get(function (req, res) {
            AnswerGivers.find({}).populate('id_user').exec(function (err, ag) {
                if(err){
                    res.send(err);
                }else{
                    res.json(ag);
                }
            });
        })
        /**
         * @apiName Create_QA_Medic_Answerer
         * @apiDescription Create a QA Medic Answerer
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/qa/answerGivers Create a QA Medic Answerer
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id_user the id of the medic who will become an QA answerer
         * @apiParam {String} nickname the nickname of the QA answerer
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{id_user: "", nickname: ""}' http://localhost:8080/api/admin/applications/qa/answerGivers
         * @apiSuccess {Object} response.success an object with response message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       message: {
         *          type: '',
         *          text: ''
         *       }
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *       message: {
         *          type: '',
         *          text: ''
         *       }
         *     }
         */
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
        /**
         * @apiName Update_QA_Medic_Answerer
         * @apiDescription Update a QA Medic Answerer
         * @apiGroup Admin_API
         * @api {put} /api/admin/applications/qa/answerGivers Update a QA Medic Answerer
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the medic who will become an QA answerer
         * @apiParam {String} nickname the nickname of the QA answerer
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{id: "", nickname: ""}' http://localhost:8080/api/admin/applications/qa/answerGivers
         * @apiSuccess {Object} response.success an object with response message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       message: {
         *          type: '',
         *          text: ''
         *       }
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *       message: {
         *          type: '',
         *          text: ''
         *       }
         *     }
         */
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
    /**
     * @apiName QA_Medic_Answerer
     * @apiDescription Get a QA Medic Answerer
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/qa/answerGiverById/:id Get a QA Medic Answerer
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of QA medic
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/qa/answerGiverById/djawihfyafjwabca727488ybdf
     * @apiSuccess {Object} response.success an array of QA medics
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
        .get(function (req, res) {
            AnswerGivers.findOne({_id: req.params.id}, function (err, ag) {
                if(err){
                    res.send(err);
                }else{
                    res.send(ag);
                }
            });
        })
        /**
         * @apiName Delete_QA_Medic_Answerer
         * @apiDescription Delete a QA Medic Answerer
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/qa/answerGiverById/:id Delete a QA Medic Answerer
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of QA medic
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/qa/answerGiverById/djawihfyafjwabca727488ybdf
         * @apiSuccess {Object} response.success an array of QA medics
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *         message: {
         *              type: '',
         *              text: ''
         *         }
         *     }
         */
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
    /**
     * @apiName QA_Medics
     * @apiDescription Get a list of QA Medics
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/qa/medics Get a list of QA Medics
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/qa/medics
     * @apiSuccess {Array} response.success an array of QA medics
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        [{
     *
     *        }]
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          message: {
     *              type: '',
     *              text: ''
     *          }
     *     }
     */
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
    /**
     * @apiName Get_Contract_Templates
     * @apiDescription Get a list of contract templates / a single contract template
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/contractManagement/templates Get a list of contract templates / a single contract template
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id a contract template id
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/contractManagement/templates?id=null
     * @apiSuccess {Array} response.success an array of contract templates / a single contract template
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Contract_Template
         * @apiDescription Create a contract template
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/contractManagement/templates Create a contract template
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj a contract template object
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/applications/contractManagement/templates
         * @apiSuccess {Object} response.success the newly created contract template
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Contract_Template
         * @apiDescription Update a contract template
         * @apiGroup Admin_API
         * @api {put} /api/admin/applications/contractManagement/templates Update a contract template
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id a contract template id
         * @apiParam {Object} obj a contract template object
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/applications/contractManagement/templates?id=dwafdjawghf2cnahfgawhfnawf
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Contract_Template
         * @apiDescription Delete a contract template
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/contractManagement/templates Delete a contract template
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id a contract template id
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/contractManagement/templates?id=dwafdjawghf2cnahfgawhfnawf
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
            deferred.reject({errorCode: 52});
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
                                    callback({errorCode: 48});
                                }
                            }else if(err.name == "ValidationError"){
                                callback({errorCode: 49});
                            }else{
                                logger.error(err);
                                callback({errorCode: 2});
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
                                deferred.reject({errorCode: 50});
                            }
                        );
                    }
                }
            );
        }
        return deferred.promise;
    };

    router.route('/admin/applications/DPOC/devices')
    /**
     * @apiName Get_DPOC_Users
     * @apiDescription Get a list of DPOC users / a single DPOC user
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/DPOC/devices Get a list of DPOC users / a single DPOC user
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id a DPOC user id
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/DPOC/devices?id=diwajfawfh7fenvnbfbb
     * @apiSuccess {Array} response.success an array of DPOC users / a single DPOC user
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
                DPOC_Devices.find({}, {name: 1, email: 1, code: 1}, function (err, devices) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, devices);
                    }
                });
            }
        })
        /**
         * @apiName Create_DPOC_User
         * @apiDescription Create DPOC user
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/DPOC/devices Create DPOC user
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj a DPOC user
         * @apiExample {curl} Example usage:
         *     curl -i -x POST -d '{name: "", email: ""}' http://localhost:8080/api/admin/applications/DPOC/devices
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
        .post(function (req, res) {

            addDeviceDPOC(req.body.name, req.body.email).then(
                function () {
                    handleSuccess(res, true, 81);
                },
                function (err) {
                    handleError(res, err, 500, err.errorCode);
                }
            );
        })
        /**
         * @apiName Delete_DPOC_User
         * @apiDescription Delete DPOC user
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/DPOC/devices Delete DPOC user
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} obj a DPOC user
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/DPOC/devices?id=diwajfawfh7fenvnbfbb
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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
    /**
     * @apiName Import_DPOC_Users
     * @apiDescription Import DPOC users
     * @apiGroup Admin_API
     * @api {post} /api/admin/applications/DPOC/importDevices Import DPOC users
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Array} arr an array of DPOC users
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -d '{[{name: "", email: ""}]}' http://localhost:8080/api/admin/applications/DPOC/importDevices
     * @apiSuccess {Object} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Get_Januvia_Users
     * @apiDescription Retrieve a list of Januvia users / a single Januvia user
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/januvia/users Retrieve a list of Januvia users / a single Januvia user
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the user
     * @apiParam {String} type can be "manager", "reprezentant" or "medic"
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/januvia/users?id=null
     * @apiSuccess {Array} response.success an array containing Januvia users / a single Januvia user
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
                JanuviaUsers.find(q).deepPopulate('city.county', {
                    populate: {
                        'city.county': {
                            select: 'name'
                        }
                    }
                }).exec(function (err, users) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, users);
                    }
                });
            }
        })
        /**
         * @apiName Create_Januvia_User
         * @apiDescription Create a Januvia user
         * @apiGroup Admin_API
         * @api {post} /api/admin/applications/januvia/users Create a Januvia user
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/applications/januvia/users
         * @apiSuccess {Object} response.success the new user
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Update_Januvia_User
         * @apiDescription Update a Januvia user
         * @apiGroup Admin_API
         * @api {put} /api/admin/applications/januvia/users Update a Januvia user
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the user
         * @apiParam {Object} obj the updated user info
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/applications/januvia/users?id=dwajhd824ynfghmnvyug
         * @apiSuccess {Object} response.success the updated user
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Januvia_User
         * @apiDescription Delete a Januvia user
         * @apiGroup Admin_API
         * @api {delete} /api/admin/applications/januvia/users Delete a Januvia user
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the user
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/applications/januvia/users?id=dwajhd824ynfghmnvyug
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Januvia_User_types
     * @apiDescription Retrieve a list of Januvia user types
     * @apiGroup Admin_API
     * @api {get} /api/admin/applications/januvia/user_types Retrieve a list of Januvia user types
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/applications/januvia/user_types
     * @apiSuccess {Array} response.success an array containing Januvia user types
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            handleSuccess(res, new JanuviaUsers().schema.path('type').enumValues);
        });

    router.route('/admin/applications/januvia/parseExcel')
    /**
     * @apiName Parse_Januvia_Users_Excel
     * @apiDescription Import Januvia users from Excel
     * @apiGroup Admin_API
     * @api {post} /api/admin/applications/januvia/parseExcel Import Januvia users from Excel
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Object} obj a file object
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -d '{}' http://localhost:8080/api/admin/applications/januvia/parseExcel
     * @apiSuccess {Object} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .post(function (req, res) {
            var file = req.body.file;
            var workbook = xlsx.read(file, {type: 'binary'});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var toJson = xlsx.utils.sheet_to_json(worksheet);
            januviaImport.insertUsers(toJson).then(
                function (success) {
                    handleSuccess(res);
                },
                function (err) {
                    handleError(res,err,500);
                }
            );
        });

    router.route('/admin/location/counties')
    /**
     * @apiName Get_County_Or_City
     * @apiDescription Retrieve a county / array of counties
     * @apiGroup Admin_API
     * @api {get} /api/admin/location/counties Retrieve a county / array of counties
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the county
     * @apiParam {String} city the id of the city
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/location/counties?id=null&city=dwahdjajwdjawhdjadawdawda
     * @apiSuccess {Array} response.success an array containing counties / an object containing a county
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with city id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Get_City_Or_County
     * @apiDescription Retrieve a city / array of counties / array of cities of a county
     * @apiGroup Admin_API
     * @api {get} /api/admin/location/cities Retrieve a city / array of counties / array of cities of a county
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the city
     * @apiParam {String} county the id of the county
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/location/cities?id=null&county=dwahdjajwdjawhdjadawdawda
     * @apiSuccess {Array} response.success an array containing counties / cities of a county / an object containing a city
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with county id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Get_Activation_Codes
     * @apiDescription Retrieve an array of activation codes
     * @apiGroup Admin_API
     * @api {get} /api/admin/system/activationCodes/codes Retrieve an array of activation codes
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/system/activationCodes/codes
     * @apiSuccess {Array} response.success an array containing activation codes
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            ActivationCodes.find({}).populate('profession').exec(function (err, codes) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, codes);
                }
            });
        })
        /**
         * @apiName Update_Activation_Code
         * @apiDescription Update an activation code
         * @apiGroup Admin_API
         * @api {put} /api/admin/system/activationCodes/codes Update an activation code
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the activation code
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{new: ""}' http://localhost:8080/api/admin/system/activationCodes/codes?id=djawijdfaiwnf823525
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Params
     * @apiDescription Retrieve an array of system parameteres
     * @apiGroup Admin_API
     * @api {get} /api/admin/system/parameters Retrieve an array of system parameteres
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/system/parameters
     * @apiSuccess {Array} response.success an array containing system parameteres
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            Parameters.find({}).exec(function (err, params) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, params);
                }
            });
        })
        /**
         * @apiName Update_Params
         * @apiDescription Update a system parameter
         * @apiGroup Admin_API
         * @api {put} /api/admin/system/parameters Update a system parameter
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the parameter
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{default_value: "", value: ""}' http://localhost:8080/api/admin/system/parameters?id=djawijdfaiwnf823525
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Users
     * @apiDescription Retrieve an array of users / a single user
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/ManageAccounts/users Retrieve an array of users / a single user
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the user
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/ManageAccounts/users?id=null
     * @apiSuccess {Array} response.success an array containing users / an object with a user
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            if(req.query.id){
                User.findOne({_id: req.query.id}).select('+enabled +phone +routing_role').populate('division specialty').deepPopulate('profession groupsID.profession').exec(function (err, OneUser) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, OneUser);
                    }
                })
            }else{
                User.find({state:"ACCEPTED"}).select('+enabled +phone +routing_role').populate('profession therapeutic-areasID groupsID conferencesID').exec(function (err, users) {
                    if(err){
                        console.log(err);
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, users);
                    }
                })
            }
        })
        /**
         * @apiName Update_User
         * @apiDescription Update a user's data
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/ManageAccounts/users Update a user's data
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the user
         * @apiParam {Object} obj the user's new data
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/users/ManageAccounts/users?id=wda21451dcascacwafa
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Professions
     * @apiDescription Retrieve an array of professions
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/ManageAccounts/professions Retrieve an array of professions
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/ManageAccounts/professions
     * @apiSuccess {Array} response.success an array containing professions
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Get_Groups
     * @apiDescription Retrieve an array of special groups
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/ManageAccounts/groups Retrieve an array of special groups
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/ManageAccounts/groups
     * @apiSuccess {Array} response.success an array containing special groups
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Get_Accounts_By_State
     * @apiDescription Retrieve an array of accounts filtered by state
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/newAccounts/state/:type Retrieve an array of accounts filtered by state
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} type the status of the account (can be ACCEPTED, PENDING, REJECTED)
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/newAccounts/state/ACCEPTED
     * @apiSuccess {Array} response.success an array containing the filtered accounts
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            User.find({state: req.params.type}).select('+state +proof_path').populate('profession').exec(function (err, users) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, users);
                }
            })
        })
        /**
         * @apiName Change_Account_State
         * @apiDescription Change the status of an account
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/newAccounts/state/:type Change the status of an account
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} type the status of the account (can be ACCEPTED, PENDING, REJECTED)
         * @apiParam {String} id the id of the account
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{id: ""}' http://localhost:8080/api/admin/users/newAccounts/state/ACCEPTED
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : [{
         *
         *        }],
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         * @apiUse BadRequest
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 BadRequest Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
    /**
     * @apiName Get_Number_Of_New_Accounts
     * @apiDescription Retrieve the number of new accounts
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/newAccounts/count Retrieve the number of new accounts
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/newAccounts/count
     * @apiSuccess {Object} response.success an object containing the number of new accounts
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *          total: 11
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

    router.route('/admin/users/specialty')
    /**
     * @apiName Get_Specialty
     * @apiDescription Retrieve a list of specialties / a single specialty
     * @apiGroup Admin_API
     * @api {get} /api/admin/users/specialty Retrieve a list of specialties / a single specialty
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the specialty
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/users/specialty?id=null
     * @apiSuccess {Array} response.success an array of specialties / a single specialty
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function (req, res) {
            if(req.query.id){
                Speciality.findOne({_id: req.query.id},function(err,speciality){
                    if (err) {
                        handleError(res, err, 500);
                    } else {
                        handleSuccess(res, speciality);
                    }
                })
            }
            else{
                Speciality.find({}).exec(function (err, specialities) {
                    if (err) {
                        handleError(res, err, 500)
                    } else {
                        handleSuccess(res, specialities);
                    }
                });
            }
        })
        /**
         * @apiName Create_Specialty
         * @apiDescription Create a specialty item
         * @apiGroup Admin_API
         * @api {post} /api/admin/users/specialty Create a specialty item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/users/specialty
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function (req, res) {
            var newSpecialty = new Speciality ({
                name: 'Untitled'
            });
            newSpecialty.save(function (err, saved) {
                if (err) {
                    handleError(res, err);
                } else {
                    handleSuccess(res, saved, 2);
                }
            })
        })
        /**
         * @apiName Update_Specialty
         * @apiDescription Update a specialty item
         * @apiGroup Admin_API
         * @api {put} /api/admin/users/specialty Update a specialty item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {Object} specialty the updated specialty
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{specialty: {}}' http://localhost:8080/api/admin/intros?id=mndkawmndknawnfw
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .put(function (req, res) {
            var updated = req.body.specialty;
            updated.lastUpdated = new Date();
            Speciality.update({_id: updated._id},{$set: updated},(function (err, updatedSpecialty) {
                if (err) {
                    handleError(res, err);
                } else {
                    handleSuccess(res, {updated: updatedSpecialty}, 3);
                }
            }))

        })
        /**
         * @apiName Delete_Specialty
         * @apiDescription Delete a specialty item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/users/specialty Delete a specialty item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the specialty
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/users/specialty?id=mndkawmndknawnfw
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .delete(function (req, res) {
            Speciality.findOne({_id: req.query.id}, function (err, specialty) {
                if (err) {
                    handleError(res, err, 500)
                }
                if (specialty) {
                    Speciality.remove({_id: req.query.id}).exec(function (err, spec) {
                        if (err) {
                            handleError(res, err, 500);
                        }
                        else{
                            handleSuccess(res, {specialty: spec}, 4)
                        }
                    })
                }
            })
        });
    router.route('/admin/intros')
    /**
     * @apiName Get_Intro
     * @apiDescription Retrieve a list of intros / a single intro
     * @apiGroup Admin_API
     * @api {get} /api/admin/intros/ Retrieve a list of intros / a single intro
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the intro
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/intros?id=null
     * @apiSuccess {Array} response.success an array of intros / a single intro
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Intro
         * @apiDescription Create a intro item
         * @apiGroup Admin_API
         * @api {post} /api/admin/intros/ Create a intro item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/intros
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
            var intro = new Presentations({
                description: 'Untitled'
            });
            intro.save(function (err, presentation) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, {}, 2);
                }
            });
        })
        /**
         * @apiName Update_Intro
         * @apiDescription Update a intro item
         * @apiGroup Admin_API
         * @api {put} /api/admin/intros/ Update a intro item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the intro
         * @apiParam {Object} intro the updated intro
         * @apiParam {Boolean} isEnabled disable/enable a intro
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{intro: {}}' http://localhost:8080/api/admin/intros?id=mndkawmndknawnfw
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        /**
         * @apiName Delete_Intro
         * @apiDescription Delete a intro item
         * @apiGroup Admin_API
         * @api {delete} /api/admin/intros/ Delete a intro item
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} idToDelete the id of the intro
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/intros?id=mndkawmndknawnfw
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
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
        distributionLists: require('../models/newsletter/distribution_lists'),
        campaigns: require('../models/newsletter/campaigns'),
        templates: require('../models/newsletter/templates'),
        unsubscribers: require('../models/newsletter/unsubscribers')
    };

    router.route('/admin/newsletter/distribution_lists')
    /**
     * @apiName Newsletter_Distribution_Lists
     * @apiDescription Retrieve a list of distribution lists / a single distribution list
     * @apiGroup Admin_API
     * @api {get} /api/admin/newsletter/distribution_lists Retrieve a list of distribution lists / a single distribution list
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the distribution list
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/newsletter/distribution_lists?id=null
     * @apiSuccess {Array} response.success an array of distribution lists / an object with a distribution list
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Newsletter_Distribution_List
         * @apiDescription Create a newsletter distribution list
         * @apiGroup Admin_API
         * @api {post} /api/admin/newsletter/distribution_lists Create a newsletter distribution list
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/newsletter/distribution_lists
         * @apiSuccess {Object} response.success the newly created distribution list
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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
        /**
         * @apiName Update_Newsletter_Distribution_List
         * @apiDescription Update a newsletter distribution list
         * @apiGroup Admin_API
         * @api {put} /api/admin/newsletter/distribution_lists Update a newsletter distribution list
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the template
         * @apiParam {Object} obj a distribution list object
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/newsletter/distribution_lists?id=0nncknkwawa
         * @apiSuccess {Object} response.success the updated distribution list
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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
        /**
         * @apiName Delete_Newsletter_Distribution_list
         * @apiDescription Delete a newsletter distribution list
         * @apiGroup Admin_API
         * @api {delete} /api/admin/newsletter/distribution_lists Delete a newsletter distribution list
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the distribution list
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/newsletter/distribution_lists?id=jdwkandnadnawnfwubfabf
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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
    /**
     * @apiName Newsletter_Campaigns
     * @apiDescription Retrieve a list of newsletter campaigns / a single campaign
     * @apiGroup Admin_API
     * @api {get} /api/admin/newsletter/templates Retrieve a list of newsletter campaigns / a single campaign
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the camapign
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/newsletter/campaigns?id=null
     * @apiSuccess {Array} response.success an array of campaigns / an object with a campaign
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
                Newsletter.campaigns.find({deleted: {$ne: true}}, {
                    name: 1,
                    date_created: 1,
                    send_date: 1,
                    status: 1
                }, function (err, campaigns) {
                    if(err){
                        handleError(res, err);
                    }else{
                        handleSuccess(res, campaigns);
                    }
                });
            }
        })
        /**
         * @apiName Create_Newsletter_Campaign
         * @apiDescription Create a newsletter campaign
         * @apiGroup Admin_API
         * @api {post} /api/admin/newsletter/campaigns Create a newsletter campaign
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} [clone] the id of the campaign we want to clone
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/newsletter/campaigns?clone=0210infnf93f813s
         * @apiSuccess {Object} response.success the newly created template / an empty object if we clone a campaign
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
        .post(function (req, res) {
            if(req.query.clone){
                Newsletter.campaigns.findOne({_id: req.query.clone}, function (err, campaign) {
                    if(err){
                        handleError(res, err);
                    }else if(!campaign){
                        handleError(res, false, 404, 1);
                    }else{
                        var clone = new Newsletter.campaigns({
                            date_created: Date.now(),
                            name: campaign.name + " (copy)",
                            distribution_lists: campaign.distribution_lists,
                            templates: campaign.templates,
                            status: "not sent"
                        });
                        clone.save(function (err) {
                            if(err){
                                handleError(res, err);
                            }else{
                                handleSuccess(res);
                            }
                        });
                    }
                });
            }else{
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
            }
        })
        /**
         * @apiName Update_Newsletter_Campaign
         * @apiDescription Update a newsletter campaign
         * @apiGroup Admin_API
         * @api {put} /api/admin/newsletter/campaigns Update a newsletter campaign
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the campaign
         * @apiParam {Object} obj a campaign object
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/newsletter/templates?id=jwiadjij141441mdd
         * @apiSuccess {Object} response.success the updated campaign
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
        .put(function (req, res) {
            UtilsModule.discardFields(req.body, ["_id", "date_created", "status"]);
            Newsletter.campaigns.findOne({_id: req.query.id, status: "not sent"}, function (err, campaign) {
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
        /**
         * @apiName Delete_Newsletter_Campaign
         * @apiDescription Delete a newsletter campaign
         * @apiGroup Admin_API
         * @api {delete} /api/admin/newsletter/campaigns Delete a newsletter campaign
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the campaign
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/newsletter/campaigns?id=jdwkandnadnawnfwubfabf
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
        .delete(function (req, res) {
            var idToDelete = ObjectId(req.query.id);
            Newsletter.campaigns.update({_id: idToDelete}, {$set: {deleted: true}}, function (err, wres) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res);
                }
            });
        });

    /**
     * @apiName Newsletter_Templates
     * @apiDescription Retrieve a list of newsletter templates
     * @apiGroup Admin_API
     * @api {get} /api/admin/newsletter/templates Retrieve a list of newsletter templates
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} id the id of the template
     * @apiParam {Boolean} [returnTypes] if true, the newsletter types are returned
     * @apiParam {String} type filter newsletters by type (can be header, content or footer)
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/newsletter/templates?id=null&type=header
     * @apiSuccess {Array} response.success an array of templates
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Create_Newsletter_Template
         * @apiDescription Create a newsletter template
         * @apiGroup Admin_API
         * @api {post} /api/admin/newsletter/templates Create a newsletter template
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiExample {curl} Example usage:
         *     curl -i -x POST http://localhost:8080/api/admin/newsletter/templates
         * @apiSuccess {Object} response.success the newly created template
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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
        /**
         * @apiName Update_Newsletter_Template
         * @apiDescription Update a newsletter template
         * @apiGroup Admin_API
         * @api {put} /api/admin/newsletter/templates Update a newsletter template
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the template
         * @apiParam {Object} obj a template object
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{}' http://localhost:8080/api/admin/newsletter/templates?id=dknwandandwaid
         * @apiSuccess {Object} response.success the updated template
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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
        /**
         * @apiName Delete_Newsletter_Template
         * @apiDescription Delete a newsletter template
         * @apiGroup Admin_API
         * @api {delete} /api/admin/newsletter/templates Delete a newsletter template
         * @apiVersion 1.0.0
         * @apiPermission admin
         * @apiPermission devModeAdmin
         * @apiParam {String} id the id of the template
         * @apiExample {curl} Example usage:
         *     curl -i -x DELETE http://localhost:8080/api/admin/newsletter/templates?id=wndkandandawodjaw
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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

    /**
     * @apiName Newsletter_Users_Unsubscribed_Yet
     * @apiDescription Retrieve a list of users who haven't subscribed to the newsletter yet
     * @apiGroup Admin_API
     * @api {post} /api/admin/newsletter/users Retrieve a list of users who haven't subscribed to the newsletter yet
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {Boolean} unsubscribed if the user haven't subscribed to the newsletter
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/newsletter/users?unsubscribed=true
     * @apiSuccess {Array} response.success an array with users
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

    /**
     * @apiName Newsletter_Unsubscribed
     * @apiDescription Retrieve a list of users who unsubscribed from MSD Newsletter
     * @apiGroup Admin_API
     * @api {post} /api/admin/newsletter/unsubscribedEmails Retrieve a list of users who unsubscribed from MSD Newsletter
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/newsletter/unsubscribedEmails
     * @apiSuccess {Array} response.success an array with users
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/admin/newsletter/unsubscribedEmails')
        .get(function (req, res) {
            Newsletter.unsubscribers.find({}).exec(function (err, people) {
                if(err){
                    handleError(res, err);
                }else{
                    handleSuccess(res, people);
                }
            });
        });

    /**
     * @apiName Newsletter_Statistics
     * @apiDescription Retrieve newsletter statistics
     * @apiGroup Admin_API
     * @api {post} /api/admin/newsletter/statistics Retrieve newsletter statistics
     * @apiVersion 1.0.0
     * @apiPermission admin
     * @apiPermission devModeAdmin
     * @apiParam {String} [campaign] The id of a newsletter campaign
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/admin/newsletter/statistics?campaign=null
     * @apiSuccess {Object} response.success an object with statistics
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/admin/newsletter/statistics')
        .get(function (req, res) {
            if(req.query.campaign){
                Newsletter.campaigns.findOne({_id: req.query.campaign}, function (err, campaign) {
                    if(err){
                        handleError(res, err);
                    }else if(!campaign){
                        handleError(res, false, 404, 1);
                    }else{
                        if(campaign.statistics && campaign.statistics.recorded){
                            handleSuccess(res, campaign.statistics);
                        }else{
                            NewsletterModule.getCampaignStats(req.query.campaign).then(
                                function (stats) {
                                    handleSuccess(res, stats.last_30_days);
                                },
                                function (err) {
                                    handleError(res, err);
                                }
                            );
                        }
                    }
                });
            }else{
                NewsletterModule.getOverallStats().then(
                    function (stats) {
                        handleSuccess(res, stats);
                    },
                    function (err) {
                        handleError(res, err);
                    }
                );
            }
        });

    //==================================================================================================================================== USER ROUTES
    /**
     * @apiName Change_User_Profile_Pic
     * @apiDescription Change user's profile pic
     * @apiGroup Medic_API
     * @api {post} /api/user/addPhoto Change user's profile pic
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} data An object containing the new picture
     * @apiExample {curl} Example usage:
     *     curl -i  -x POST -d '{data : {Body: '', extension: ''}}' http://localhost:8080/api/user/addPhoto
     * @apiSuccess {Object} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse BadRequest
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 400 BadRequest Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_Special_Product_By_Group
     * @apiDescription Retrieve an array of special products by a user's special group
     * @apiGroup Medic_API
     * @api {get} /api/specialFeatures/groupSpecialProducts Retrieve an array of special products by a user's special group
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} specialGroup The id of the special group the user belongs
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialFeatures/groupSpecialProducts?id=dawiy8271515h125s
     * @apiSuccess {Array} response.success an array with special products associated with the special group
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_Special_Apps
     * @apiDescription Retrieve an array of special apps / a single special app (hybrid apps)
     * @apiGroup Medic_API
     * @api {get} /api/specialFeatures/specialApps Retrieve an array of special apps / a single special app (hybrid apps)
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} [id] The id of the special app
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialFeatures/specialApps?id=dawiy8271515h125s
     * @apiSuccess {Array} response.success an array with special apps objects / a single special app
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (no id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/specialFeatures/specialApps')
        .get(function (req, res) {
            if(req.query.id){
                ContentVerifier.getContentById(specialApps,req.query.id,false,false,'isEnabled',null,'groups').then(
                    function(success){
                        handleSuccess(res,success);
                    },function(err){
                        if (err.status == 404)
                            var message = 45;
                        else
                            var message = 46;
                        handleError(res,null,err.status, message);
                    }
                );
            }else{
                specialApps.find({isEnabled: true}).exec(function (err, apps) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,apps);
                    }
                });
            }
        });

    /**
     * @apiName Retrieve_Default_Group
     * @apiDescription Retrieve the default group of the user
     * @apiGroup Medic_API
     * @api {get} /api/defaultPharma Retrieve the default group of the user
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/defaultPharma
     * @apiSuccess {Object} response.success an object with the default group
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/defaultPharma')

        .get(function(req, res) {
            UserGroup.find({_id: {$in: req.user.groupsID}, restrict_CRUD: {$exists:true, $ne: false}}).populate('profession').exec(function(err, groups) {
                if(err || !groups) {
                    handleError(res,err,500);
                }
                else
                {
                    handleSuccess(res,groups[0].profession);
                }
            });
        });
    /**
     * @apiName Retrieve_Special_Product
     * @apiDescription Retrieve a special product
     * @apiGroup Medic_API
     * @api {get} /api/specialProductMenu Retrieve a special product's menu
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} id The id of the special product
     * @apiParam {String} idPathology Filter special products by pathology (0 means no filter)
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialProduct?id=null&idPathology=wjdjadada924142nn24
     * @apiSuccess {Array} response.success an array containing special products / a single special product
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (no id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/specialProduct')
        .get(function(req, res) {
            if(req.query.id){
                ContentVerifier.getContentById(specialProduct,req.query.id,null,false,'enabled','speakers pathologiesID','groups').then(
                    function(success){
                        handleSuccess(res,success);
                    },function(err){
                        if (err.status == 404)
                            var message = 45;
                        else
                            var message = 46;
                        handleError(res,null,err.status, message);
                    }
                );
            } else {
                var itemQParams = {
                    query: {
                        enabled: { $exists: true, $ne : false },
                        productType: 'product'
                    },
                    sort: {
                        product_name: 1
                    }
                };
                var queryPathObject = {
                    enabled: true
                };
                if(req.query.idPathology && req.query.idPathology != 0)
                    queryPathObject._id = req.query.idPathology;
                getPathologiesWithItems(specialProduct, itemQParams, queryPathObject).then(
                    function (success) {
                        handleSuccess(res,success);
                    },
                    function (err) {
                        handleError(res,err,500);
                    }
                )
            }
        });
    /**
     * @apiName Retrieve_Special_Product_Menu
     * @apiDescription Retrieve a special product's menu
     * @apiGroup Medic_API
     * @api {get} /api/specialProductMenu Retrieve a special product's menu
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} id The id of the special product
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialProductMenu?id=dnjwandawh8264y181b241
     * @apiSuccess {Array} response.success an array containing the menu of the product
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/specialProductMenu')
        .get(function(req, res) {
            getSpecialProductMenu(req.query.id).then(
                function (success) {
                    handleSuccess(res,success);
                },
                function (err) {
                    handleError(res,err,500);
                }
            )
        });
    /**
     * @apiName Retrieve_Special_Product_Description
     * @apiDescription Retrieve a special product menu item
     * @apiGroup Medic_API
     * @api {get} /api/specialProductDescription Retrieve a special product menu item
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} id The id of the special product
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialProductDescription?id=dnjwandawh8264y181b241
     * @apiSuccess {Object} response.success an object containing a menu item
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_Special_Product_Files
     * @apiDescription Retrieve an array of files for a special product
     * @apiGroup Medic_API
     * @api {get} /api/specialProductFiles Retrieve an array of files for a special product
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} id The id of the special product
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialProductFiles?id=dnjwandawh8264y181b241
     * @apiSuccess {Array} response.success an array of files objects
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_Special_Product_Glossary
     * @apiDescription Retrieve an array of glossary objects for a special product
     * @apiGroup Medic_API
     * @api {get} /api/specialProductGlossary Retrieve a glossary array for a special product
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} id The id of the special product
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialProductGlossary?id=dnjwandawh8264y181b241
     * @apiSuccess {Array} response.success an array of glossary objects
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_Special_Product_Speaker
     * @apiDescription Retrieve a speaker for a special product
     * @apiGroup Medic_API
     * @api {get} /api/specialProduct/speakers Retrieve a speaker for a special product
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} speaker_id The id of the speaker
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/specialProduct/speakers?speaker_id=dnjwandawh8264y181b241
     * @apiSuccess {Object} response.success a speaker object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_Articles
     * @apiDescription Retrieve an array of articles / a single article
     * @apiGroup Medic_API
     * @api {get} /api/content Retrieve an array of articles / a single article
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} content_id The id of the article
     * @apiPAram {Number} content_type The type of the content (1 = national, 2 = international or 3 = stiintific)
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/content?id=null&content_type=3
     * @apiSuccess {Array} response.success an array of articles / a single article
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (with article id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (no article id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/content')
        .get(function(req, res) {
            if(req.query.content_id){
                ContentVerifier.getContentById(Content,req.query.content_id,false,true,'enable',null,'groupsID').then(
                    function(success){
                        handleSuccess(res,success);
                    },function(err){
                        if (err.status == 404)
                            var message = 45;
                        else
                            var message = 46;
                        handleError(res,null,err.status, message);
                    }
                );
            }else{
                //send most read and recent articles at the same time
                var contentToSend = [];
                getUserContent(req.query.content_type, null, 'created').then(
                    function (contentRecent) {
                        contentToSend.push(contentRecent);
                        getUserContent(req.query.content_type, 3, 'nrOfViews').then(
                            function (content) {
                                contentToSend.push(content);
                                handleSuccess(res,contentToSend);
                            },
                            function (err) {
                                handleError(res,err,500);
                            });
                    },
                    function (err) {
                        handleError(res,err,500);
                    });
            }
        });

    /**
     * @apiName Retrieve_User_Data
     * @apiDescription Retrieve user data for profile page
     * @apiGroup Medic_API
     * @api {get} /api/userdata Retrieve user data for profile page
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/userdata
     * @apiSuccess {Object} response.success an object containing the current user info
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
        /**
         * @apiName Update_User_Data
         * @apiDescription Update user's data
         * @apiGroup Medic_API
         * @api {put} /api/userdata Change User Job
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiPermission devModeMedic
         * @apiParam {String} name the user's name
         * @apiParam {String} title the user's title
         * @apiParam {Array} therapeutic-areasID an array of therapeutic areas ids
         * @apiParam {String} phone the user's phone number
         * @apiParam {String} address the user's address
         * @apiParam {Object} subscriptions subscribe to : newsletterStaywell or infoMSD
         * @apiParam {Number} practiceType 1 = Public , 2 = Private
         * @apiParam {Boolean} newsletter subscribe to newsletter
         * @apiParam {Array} citiesID an array with the city which is the user's hometown
         * @apiExample {curl} Example usage:
         *     curl -i -x PUT -d '{newData: {name: '' , title : '', phone:'', therapeutic-areasID: 3, address: '',
         *     subscriptions: {newsletterStaywell: true, infoMSD: false},
         *     practiceType: '', newsletter: '', citiesID: []}}' http://localhost:8080/api/userdata
         * @apiSuccess {Array} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
         * @apiUse BadRequest
         * @apiErrorExample {json} Error-Response (4xx):
         *     HTTP/1.1 400 BadRequest Error
         *     {
     *          error: "",
     *          data: {}
     *     }
         */
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

    /**
     * @apiName Retrieve_Counties
     * @apiDescription Retrieve an array of counties
     * @apiGroup Medic_API
     * @api {get} /api/counties Retrieve an array of counties
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/counties
     * @apiSuccess {Array} response.success an array of cities
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/counties')

        .get(function(req, res) {
            Counties.find({$query:{}, $orderby: {name: 1}}, {name: 1}, function (err, cont) {
                if(err) {
                    handleError(res,err,500);
                }else
                    handleSuccess(res,cont);
            });
        });

    /**
     * @apiName Retrieve_Cities
     * @apiDescription Retrieve an array of cities based on county name
     * @apiGroup Medic_API
     * @api {get} /api/cities Retrieve an array of cities based on county name
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} county_name The county's name
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/cities?county_name=Bucuresti
     * @apiSuccess {Array} response.success an array of cities
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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

    /**
     * @apiName Change_Job
     * @apiDescription Change User Job
     * @apiGroup Medic_API
     * @api {post} /api/userJob Change User Job
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} street_number the street number
     * @apiParam {String} street_name the street name
     * @apiParam {String} job_name job name
     * @apiParam {Number} job_type the job type (1 = Spital; 2 = CMI; 3 = Policlinica; 4 = Farmacie)
     * @apiParam {String} postal_code the postal code
     * @apiParam {String} job_address the job address
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -d '{job: {street_number: '' , street_name : '', job_name:'', job_type: 3, postal_code: '', job_address: ''}}' http://localhost:8080/api/userJob
     * @apiSuccess {Array} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse BadRequest
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 400 BadRequest Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/userJob')

        .post(function (req, res) {
            var job = req.body.job;
            var streetPatt = UtilsModule.regexes.streetName;
            var namePatt = UtilsModule.regexes.jobName;
            var numberPatt = UtilsModule.regexes.jobNumber;
            if(job.street_number && !numberPatt.test(job.street_number.toString())) {
                ans.error = true;
                ans.message = "Numarul strazii trebuie sa contina intre 1 si 5 cifre";
            }
            if(job.street_name && !streetPatt.test(job.street_name.toString())) {
                return handleError(res,null,400,40);
            }
            if(job.job_name && !namePatt.test(job.job_name.toString())) {
                return handleError(res,null,400,41);
            }
            if(job.job_type && !isNaN(parseInt(job.job_type))){
                if(parseInt(job.job_type)<1 || parseInt(job.job_type>4)){
                    return handleError(res,null,400,29);
                }
            }else if(job.job_type){
                return handleError(res,null,400,29);
            }
            if(!job._id){
                //create new
                var newJob = new Job({
                    job_type: job.job_type ? job.job_type : "",
                    job_name: job.job_name ? job.job_name : "",
                    street_name: job.street_name ? job.street_name : "",
                    street_number: job.street_number ? job.street_number : "",
                    postal_code: job.postal_code ? job.postal_code : "",
                    job_address: job.job_address ? job.job_address : ""
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
                Job.update({_id: job._id}, {
                $set: {
                    job_type: job.job_type ? job.job_type : "",
                    job_name: job.job_name ? job.job_name : "",
                    street_name: job.street_name ? job.street_name : "",
                    street_number: job.street_number ? job.street_number : "",
                    postal_code: job.postal_code ? job.postal_code : "",
                    job_address: job.job_address ? job.job_address : ""
                }
            }, function (err, jobs) {
                if (err) {
                    console.log('err', err)
                    handleError(res, null, 400, 2);

                } else {
                    handleSuccess(res, {}, 12);
                }
            });
        }
        });

    /**
     * @apiName Change_Password
     * @apiDescription Change User Password
     * @apiGroup Medic_API
     * @api {post} /api/changePassword Change User Password
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} oldPass the old password
     * @apiParam {String} newPass the new password
     * @apiExample {curl} Example usage:
     *     curl -i -x POST -d '{userData: {oldPass: '' , newPass : ''}}' http://localhost:8080/api/changePassword
     * @apiSuccess {Array} response.success an empty object
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
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
    /**
     * @apiName Retrieve_Carousel_Images
     * @apiDescription Retrieve an array of carousel images
     * @apiGroup Medic_API
     * @api {get} /api/userHomeCarousel Retrieve an array of carousel images
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/userHomeCarousel
     * @apiSuccess {Array} response.success an array of carousel images
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/userHomeCarousel/')
        .get(function (req,res) {
            Content.distinct("_id", {enable:true}).exec(function (err, ids) {
                if(err){
                    handleError(res,err,500);
                }else{
                    //get carousel content within allowed articles
                    Carousel.find({enable:{ $exists: true, $ne : false }, article_id: {$in: ids}}).populate('article_id').sort({'indexNumber':1}).exec(function (err, images) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, images);
                        }
                    })
                }
            });
        });

    /**
     * @apiName Retrieve_Search_Content
     * @apiDescription Retrieve an array of medic specific content for search page
     * @apiGroup Medic_API
     * @api {get} /api/userHomeSearch Retrieve an array of medic specific content for search page
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} data the string to search for
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/userHomeSearch?data=someString
     * @apiSuccess {Array} response.success an array of medic specific content
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/userHomeSearch/')
        .get(function(req,res){
            var data=req.query.data;
            var arr_of_items=[specialProduct,Multimedia,Content,Events];
            var ObjectOfResults={};
            async.each(arr_of_items, function (item, callback) {
                var hydrateOp;
                switch (item) {
                    case Events :
                        hydrateOp = {find: {enable:{ $exists: true, $ne : false },start:{$gt: new Date()}}};
                        break;
                    case Content :
                        hydrateOp = {find: {enable:{ $exists: true, $ne : false } , type: 3}};
                        break;
                    case specialProduct:
                        hydrateOp = {find: {enabled:{ $exists: true, $ne : false }}};
                        break;
                    default :
                        hydrateOp = {find: {enable:{ $exists: true, $ne : false } }};
                        break;
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
        });

    /**
     * @apiName Retrieve_Home_Events
     * @apiDescription Retrieve an array of calendar events for home page
     * @apiGroup Medic_API
     * @api {get} /api/userHomeEvents Retrieve an array of calendar events for home page
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/userHomeEvents
     * @apiSuccess {Array} response.success an array of calendar events
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/userHomeEvents')
        .get(function (req,res) {
            Events.find({start: {$gte: new Date()}, enable: { $exists: true, $ne : false }}).sort({start: 1}).exec(function (err, events) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, events);
                }
            });
        });

    /**
     * @apiName Retrieve_Home_Multimedia
     * @apiDescription Retrieve an array of multimedias for home page
     * @apiGroup Medic_API
     * @api {get} /api/userHomeMultimedia Retrieve an array of multimedias for home page
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/userHomeMultimedia
     * @apiSuccess {Array} response.success an array of multimedias
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/userHomeMultimedia')
        .get(function (req,res) {
            Multimedia.find({enable: { $exists: true, $ne : false }}).sort({last_updated: 'desc'}).exec(function (err, multimedia) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, multimedia);
                }
            });
        });
    /**
     * @apiName Retrieve_Home_News
     * @apiDescription Retrieve an array of articles for home page
     * @apiGroup Medic_API
     * @api {get} /api/homeNews Retrieve an array of articles for home page
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {Boolean} [scientific] If we want scientific articles
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/homeNews?scientific=true
     * @apiSuccess {Array} response.success an array of articles
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/homeNews')
        .get(function(req, res) {
            //establish content type
            var contentType = {$in: [1, 2]};
            if(req.query.scientific) contentType = 3;
            //get content
            getUserContent(contentType, 3, "created").then(
                function (cont) {
                    handleSuccess(res, cont);
                },
                function (err) {
                    handleError(res,err,500);
                });
        });

    /**
     * @apiName Retrieve_Products
     * @apiDescription Retrieve an array of products / a single product
     * @apiGroup Medic_API
     * @api {get} /api/products Retrieve an array of products / a single product
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} idProduct The id of the product
     * @apiParam {String} idPathology Filter products based on a pathology (0 means don't filter by pathology)
     * @apiParam {String} [firstLetter] Filter products based on the first letter
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/products?idProduct=dwhad841895715195151&idPathology=null
     * @apiSuccess {Array} response.success an array of calendar events / a single calendar event
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (without product id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with product id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/products')
        .get(function(req, res) {
            if(req.query.idProduct){
                ContentVerifier.getContentById(Products,req.query.idProduct,false, false,'enable',null,'groupsID').then(
                    function(success){
                        handleSuccess(res,success);
                    },function(err){
                        if (err.status == 404)
                            var message = 45;
                        else
                            var message = 46;
                        handleError(res,null,err.status, message);
                    }
                );
            }else{
                if(req.query.idPathology && req.query.idPathology != 0){
                    Pathologies.distinct("_id", {$and: [{_id: req.query.idPathology}, { enabled: { $exists: true, $ne : false }}]}).exec(function(err, pathologies){
                        if(err){
                            handleError(res,err,500);
                        }else{
                            var q = {"pathologiesID": {$in: pathologies}, enable: { $exists: true, $ne : false }};
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
                    var q = {enable: { $exists: true, $ne : false }};
                    if(req.query.firstLetter) q["name"] = UtilsModule.regexes.startsWithLetter(req.query.firstLetter);
                    Products.find(q).sort({"name": 1}).exec(function(err, cont) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res, cont);
                        }
                    })
                }
            }
        });

    /**
     * @apiName Retrieve_Calendar_Events
     * @apiDescription Retrieve an array of calendar events / a single event
     * @apiGroup Medic_API
     * @api {get} /api/calendar Retrieve an array of calendar events / a single event
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} id The id of the calendar event
     * @apiParam {String} idPathology Filter calendar events items based on a pathology (0 means don't filter by pathology)
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/calendar?id=dwhad841895715195151&idPathology=null
     * @apiSuccess {Array} response.success an array of calendar events / a single calendar event
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (without calendar event id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with calendar event id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/calendar')
        .get(function(req,res) {
            if(req.query.id){
                Events.findById(req.query.id,function(err, event) {
                    var queryResult={};
                    if(err) {
                        handleError(res,err,500);
                    }else{
                        queryResult.event=event;

                        function getConferencesInDepth(callback){
                            ConferencesModule.getConferencesInDepth(event.listconferences, function(err,conferences){
                                if(err){
                                    callback(err);
                                }
                                else{
                                    queryResult.conferences = conferences;
                                    callback();
                                }
                            })
                        }
                       function getSpeakersForConferences(callback){
                           ConferencesModule.getSpeakersForConferences(event.listconferences,function(err,speakers){
                               if(err){
                                   callback(err);
                               }
                               else{
                                   queryResult.speakers=speakers;
                                   callback();
                               }
                           })
                       }

                        async.parallel([getConferencesInDepth,getSpeakersForConferences],function(err){
                            if(err){
                                handleError(err);
                            }
                            else{
                                handleSuccess(res,queryResult);
                            }
                        })

                    }
                });
            }else{
                var findObj={};
                findObj['enable']= { $exists: true, $ne : false };
                if(req.query.idPathology && req.query.idPathology != 0){
                    findObj['pathologiesID'] = {$in: [req.query.idPathology]};
                }
                Events.find(findObj).sort({start : 1}).limit(50).exec(function (err, cont) {
                    if (err) {
                        handleError(res,err,500);
                    }
                    else
                    {
                        handleSuccess(res, cont);
                    }
                })
            }
        });
    /**
     * @apiName Retrieve_Multimedia
     * @apiDescription Retrieve an array of multimedia items / a single multimedia item
     * @apiGroup Medic_API
     * @api {get} /api/multimedia Retrieve an array of multimedia items / a single multimedia item
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} idMultimedia The id of the multimedia item
     * @apiParam {String} idPathology Filter multimedia items based on a pathology (0 means don't filter by pathology)
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/multimedia?idMultimedia=null&idPathology=jdiwahd9aw8dd0111d
     * @apiSuccess {Array} response.success an array of multimedia items / a single multimedia item
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response (without multimedia id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiSuccessExample {json} Success-Response (with multimedia id):
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     * @apiUse EntityNotFound
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 404 EntityNotFound Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/multimedia')
        .get(function(req,res){
            if(req.query.idMultimedia){
                ContentVerifier.getContentById(Multimedia,req.query.idMultimedia,false,false,'enable',null,'groupsID').then(
                    function(success){
                        handleSuccess(res,success);
                    },function(err){
                        if (err.status == 404)
                            var message = 45;
                        else
                            var message = 46;
                        handleError(res,null,err.status, message);
                    }
                );
            }else{
                var findObj={};
                findObj['enable']={ $exists: true, $ne : false };
                if(req.query.idPathology==0){
                    Multimedia.find(findObj, function (err, multimedia) {
                        if (err) {
                            handleError(res,err,500);
                        } else {
                            handleSuccess(res, multimedia);
                        }
                    });
                }else{
                    findObj['pathologiesID'] = {$in: [req.query.idPathology]};
                    Multimedia.find(findObj, function (err, multimedia) {
                        if (err) {
                            handleError(res,err,500);
                        } else {
                            handleSuccess(res, multimedia);
                        }
                    });
                }
            }
        });

    //============================================ intro presentations

    /**
     * @apiName Check_Intro_Enabled
     * @apiDescription Check if a intro is enabled
     * @apiGroup Medic_API
     * @api {get} /api/checkIntroEnabled Check if a intro is enabled
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/checkIntroEnabled
     * @apiSuccess {Object} response.success an array of intro presentations
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/checkIntroEnabled')
        .get(function (req, res) {
            Presentations.findOne({enabled: { $exists: true, $ne : false }}).exec(function (err, presentation) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, presentation);
                }
            });
        });

    router.route('/rememberIntroView')
    /**
     * @apiName Check_Intro_Viewed
     * @apiDescription Check if the intro was viewed in this session
     * @apiGroup Medic_API
     * @api {get} /api/rememberIntroView Check if the intro was viewed in this session
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} groupID The id of the group the user belongs to
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/rememberIntroView?groupID=wdkakdwa99713n
     * @apiSuccess {Object} response.success an object telling if the intro was viewed in this session
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *           isViewed: ""
     *        },
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
        .get(function(req,res){
            var viewStatus = SessionStorage.getElement(req, "viewedIntroPresentations") || {};
            handleSuccess(res,{isViewed: viewStatus[req.query.groupID]});
        })
        /**
         * @apiName Set_Intro_As_Viewed
         * @apiDescription Mark an intro as viewed for this session
         * @apiGroup Medic_API
         * @api {post} /api/pathologies Mark an intro as viewed for this session
         * @apiVersion 1.0.0
         * @apiPermission medic
         * @apiPermission devModeMedic
         * @apiParam {String} groupID The group id the user belong to
         * @apiExample {curl} Example usage:
         *     curl -i -X POST -d '{groupID : ""}' http://localhost:8080/api/rememberIntroView
         * @apiSuccess {Object} response.success an empty object
         * @apiSuccess {String} response.message A message
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *        success : {
         *
         *        },
         *        message: "Cererea a fost procesata cu succes!"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *          error: "",
         *          data: {}
         *     }
         */
        .post(function(req,res){
            var viewStatus = SessionStorage.getElement(req, "viewedIntroPresentations") || {};
            viewStatus[req.body.groupID] = true;
            SessionStorage.setElement(req, "viewedIntroPresentations", viewStatus);
            handleSuccess(res);
        });

    /**
     * @apiName Get_Intro
     * @apiDescription Retrieve an array of intro presentations
     * @apiGroup Medic_API
     * @api {get} /api/introPresentation Retrieve an array of intro presentations
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/introPresentation
     * @apiSuccess {Object} response.success an array of intro presentations
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/introPresentation')
        .get(function (req, res) {
            Presentations.findOne({enabled: { $exists: true, $ne : false }}).exec(function (err, presentation) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, presentation);
                }
            });
        });

    //============================================ regexp object
    /**
     * @apiName Regexp
     * @apiDescription Retrieve the regexp validation strings from back-end
     * @apiGroup Medic_API
     * @api {get} /api/regexp Retrieve the regexp validation strings from back-end
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/api/regexp
     * @apiSuccess {Array} response.success an object containing the validation strings
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
     */
    router.route('/regexp')
        .get(function(req,res){
            var regexp = UtilsModule.validationStrings;
            handleSuccess(res,regexp);
        });

    /**
     * @apiName Get_Pathologies
     * @apiDescription Retrieve an array of pathologies
     * @apiGroup Medic_API
     * @api {get} /api/pathologies Retrieve an array of pathologies
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {String} id The id of the pathology
     * @apiParam {Boolean} forDropdown If we want to retrieve the patohlogies without their special products/resources
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/pathologies?id=null&forDropdown=true
     * @apiSuccess {Object} response.success an array containing the pathologies
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/pathologies')
        .get(function(req, res) {
            var queryPathObject = {
                enabled: { $exists: true, $ne : false }
            };
            if(req.query.id){
                queryPathObject._id = req.query.id;
            }
            if(req.query.forDropdown){
                queryPathObject.description = { $exists: true, $ne : '' };
                Pathologies.find(queryPathObject).sort({order_index: 1}).exec(function (err, pathologies) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res, pathologies);
                    }
                })
            } else {
                var itemQParams = {
                    query: {
                        enabled: { $exists: true, $ne : false }
                    },
                    sort: {
                        product_name: 1
                    }
                };
                if(!req.query.id){
                    itemQParams.query.productType = 'product';
                }
                getPathologiesWithItems(specialProduct, itemQParams, queryPathObject).then(
                    function (success) {
                        handleSuccess(res,success);
                    },
                    function (err) {
                        handleError(res,err,500);
                    }
                )
            }
        });

    /**
     * @apiName Get_Brochure
     * @apiDescription Retrieve MSD brochure
     * @apiGroup Medic_API
     * @api {get} /api/brochure Retrieve MSD brochure
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiParam {Boolean} firstOnly If we want only the first section of the brochure
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/brochure?firstOnly=true
     * @apiSuccess {Object} response.success an array containing the brochure sections
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : [{
     *
     *        }],
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/brochure')
        .get(function(req, res) {
            var queryToExec = req.query.firstOnly ? brochureSection.find({enabled: { $exists: true, $ne : false }}).sort({orderIndex: 1}).limit(1) : brochureSection.find({enabled: { $exists: true, $ne : false }}).sort({orderIndex: 1});
            queryToExec.exec(function (err, brochureSections) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res, brochureSections);
                }
            });
        });

    /**
     * @apiName Medical_Courses_Redirect
     * @apiDescription Obtain a token from Medical Courses and send URL for redirect
     * @apiGroup Medic_API
     * @api {get} /api/medicalCourses Obtain a token from Medical Courses and send URL for redirect
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiPermission devModeMedic
     * @apiExample {curl} Example usage:
     *     curl -i  http://localhost:8080/api/medicalCourses
     * @apiSuccess {Object} response.success an object containing the url for redirect
     * @apiSuccess {String} response.message A message
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *        success : {},
     *        message: "Cererea a fost procesata cu succes!"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *          error: "",
     *          data: {}
     *     }
     */
    router.route('/medicalCourses')
        .get(function (req, res) {
            User.findOne({_id: req.user._id}).select("+citiesID").populate('specialty profession').deepPopulate('citiesID.county').exec(function (err, foundUser) {
                if(err){
                    handleError(res, err);
                }else{
                    var dataToSend = {
                        nume : foundUser.name,
                        specialitate : foundUser.specialty ? foundUser.specialty.name : null,
                        email: foundUser.username,
                        oras: foundUser.citiesID ? foundUser.citiesID[0].name : null,
                        judet: foundUser.citiesID ? foundUser.citiesID[0].county.name : null,
                        profesia: foundUser.profession ? foundUser.profession.display_name : null
                    };
                    request({
                        url: Config().onlineCoursesTokenUrl,
                        method: "POST",
                        form: dataToSend
                    }, function (error, message, response) {
                        if(error){
                            handleError(res,error,500);
                        }else{
                            var responseData = JSON.parse(response);
                            var urlToRedirect = responseData.redirect_to.replace(/\\\//g, "/");
                            handleSuccess(res, urlToRedirect);
                        }
                    });
                }
            });
        });


    app.use('/api', router);
};
