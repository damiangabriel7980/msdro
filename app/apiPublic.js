var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
var PublicCategories = require('./models/publicCategories');
var Events = require('./models/events');
var TherapeuticAreas = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');

var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');

var Utils = require('./modules/utils');

module.exports = function(app, logger, router) {
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);
    var ContentVerifier = require('./modules/contentVerifier');

    /**
     * @apiName Public_Carousel_Images
     * @apiDescription Retrive carousel images for public section
     * @apiGroup Public Carousel
     * @api {get} /apiPublic/getCarouselData retrieve carousel images for public section
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/getCarouselData
     * @apiSuccess {Array} response.success         list of public carousel entities.
     * @apiSuccess {String}   response.message       A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "title": "",
     *         "enable": true,
     *         "order_index": 0,
     *         "image_path": "",
     *         "description": "",
     *         "link_name": "",
     *         "last_updated": "",
     *         "content_id": "",
     *         "type": 1,
     *         "links": {
     *             "url": "",
     *             "content": {
     *                  "_id": "",
     *                  "title": "",
     *                  "author": "",
     *                  "description": "",
     *                  "type": 4,
     *                  "text" : ""
     *                  "enable": true,
     *                  "date_added": "",
     *                  "last_updated": "",
     *                  "file_path": "",
     *                  "image_path": "",
     *                  "therapeutic-areasID": []
     *         }
     * }
     *       ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Query Error",
     *       "data" : {}
     *     }
     */
    router.route('/getCarouselData')
        .get(function (req, res) {
            PublicCarousel.find({enable: true}).sort({order_index: 1}).populate("links.content").exec(function (err, resp) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,resp);
                }
            })
        });

    /**
     * @apiName Retrive_Public_Content
     * @apiDescription Retrive content for public section
     * @apiGroup Public Content
     * @api {get} /apiPublic/content retrieve content for public section
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiParam {String} [id] Optional id for retrieving a specific content instead of all public content.
     * @apiParam {Boolean} [isFile] If the requested specific content is a file (use it in conjunction with the id param).
     * @apiParam {Number} [type] Public content type (1 = stire (noutati); 2 = articol (despre); 3 = elearning; 4 = download).
     * @apiParam {String} [area] Filter the public content by therapeutic area.
     * @apiParam {String} [category] The category of the public content.
     * @apiExample {curl} Example usage (for a single item):
     *     curl -i http://localhost:8080/apiPublic/content?type=1&area=23assdsdw&category=221ssaww
     * @apiExample {curl} Example usage (for all items):
     *     curl -i http://localhost:8080/apiPublic/content?id=232aasd&isFile=true
     * @apiSuccess {Array} response.success a list of public content entities (or a single public content item).
     * @apiSuccess {String} response.message A success message.
     * @apiSuccessExample {json} Success-Response (in case of missing id in query params):
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "title": "",
     *         "enable": true,
     *         "author": 0,
     *         "description": "",
     *         "text": "",
     *         "type": Number,
     *         "date_added": "",
     *         "last_updated": "",
     *         "image_path": "",
     *         "file_path": "",
     *         "nrOfViews" : Number,
     *         "therapeutic-areasID" : Array
     *         "category" : ""
     *       }
     *     ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiSuccessExample {json} Success-Response (in case of id in query params):
     *     HTTP/1.1 200 OK
     *     {
     *       "success": {
     *         "_id": "",
     *         "title": "",
     *         "enable": true,
     *         "author": 0,
     *         "description": "",
     *         "text": "",
     *         "type": Number,
     *         "date_added": "",
     *         "last_updated": "",
     *         "image_path": "",
     *         "file_path": "",
     *         "nrOfViews" : Number,
     *         "therapeutic-areasID" :
     *         "category" : ""
     *       },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiError {Object} ContentNotFound The requested public content was not found.
     * @apiError {Object} AccessForbidden You don't have access to the requested public content.
     * * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 4xx Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/content')
        .get(function (req, res) {
            if(req.query.id){
                var updateQuery = {$inc: {}};
                var upd = "nrOfViews";
                updateQuery.$inc[upd] = 1;
                if(req.query.isFile){
                    ContentVerifier.getContentById(PublicContent,req.query.id,null,false,'enable').then(
                      function(success){
                          handleSuccess(res,success);
                      },function(err){
                            handleError(res,null,err.status,45);
                        }
                    );
                } else {
                    ContentVerifier.getContentById(PublicContent,req.query.id,null,true,'enable').then(
                        function(success){
                            handleSuccess(res,success);
                        },function(err){
                            handleError(res,null,err.status,45);
                        }
                    );
                }

            }else if(req.query.type && req.query.area){
                var params = req.query;

                //get documents once we know their therapeutic areas
                var getDocuments = function (areasIds) {
                    var q = {type: params.type, enable: true};
                    if(areasIds){
                        q['therapeutic-areasID'] = {$in: areasIds};
                    }
                    if(params.withFile){
                        q['file_path'] = {$exists: true, $nin:[null,""]};
                    }
                    PublicContent.find(q).sort({date_added: -1}).exec(function (err, content) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            handleSuccess(res,content);
                        }
                    });
                };

                if(params.area != 0){
                    //form an array of this area's id and all it's children id's
                    TherapeuticAreas.distinct("_id", {$or: [{_id: params.area}, {'therapeutic-areasID': {$in: [params.area]}}], enabled: true, is_public: true}, function (err, areas) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            getDocuments(areas);
                        }
                    })
                }else{
                    //we need all documents
                    getDocuments();
                }
            }else if(req.query.type){
                var q = {type: req.query.type, enable: true};
                if(req.query.withFile){
                    q['file_path'] = {$exists: true, $nin:[null,""]};
                }
                PublicContent.find(q).sort({date_added: -1}).exec(function (err, resp) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,resp);
                    }
                })
            }else if(req.query.category){
                PublicContent.find({type:2, category: req.query.category, enable: true}).sort({date_added: -1}).exec(function (err, content) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,content);
                    }
                })
            }
        })

        /**
         * @apiName Update_Public_Content
         * @apiDescription Update number of views for a public content item
         * @apiGroup Public Content
         * @api {put} /apiPublic/content update number of views for a public content item
         * @apiVersion 1.0.0
         * @apiPermission None
         * @apiParam {String} id The id of the public content item which will be updated.
         * @apiExample {curl} Example usage:
         *     curl -i -X PUT http://localhost:8080/apiPublic/content?id=232aasd
         * @apiSuccess {Object} response.success The public content item before update.
         * @apiSuccess {String}   response.message  A success message.
         * @apiSuccessExample {json} Success-Response:
         *     HTTP/1.1 200 OK
         *     {
         *       "success": {
         *         "_id": "",
         *         "title": "",
         *         "enable": true,
         *         "author": 0,
         *         "description": "",
         *         "text": "",
         *         "type": Number,
         *         "date_added": "",
         *         "last_updated": "",
         *         "image_path": "",
         *         "file_path": "",
         *         "nrOfViews" : Number,
         *         "therapeutic-areasID" : Array
         *         "category" : ""
         *       },
         *       "message": "Cererea a fost procesata cu succes"
         *     }
         * @apiUse ErrorOnServer
         * @apiErrorExample {json} Error-Response (500):
         *     HTTP/1.1 500 Server Error
         *     {
         *       "error": "Query Error",
         *       "data" : {}
         *     }
         */
        .put(function(req,res){
            var updateQuery = {$inc: {}};
            var upd = "nrOfViews";
            updateQuery.$inc[upd] = 1;
            PublicContent.findOneAndUpdate({_id: req.query.id, enable: true},updateQuery, {upsert: false}, function (err, resp) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,resp);
                }
            })
        });

    /**
     * @apiName Retrive_Public_Content_For_Mobile
     * @apiDescription Retrive content for public section (mobile version)
     * @apiGroup Public Content
     * @api {get} /apiPublic/mobileContent retrieve content for public section (mobile version)
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/mobileContent
     * @apiSuccess {Array} response.success a list of public content entities.
     * @apiSuccess {String} response.message A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "title": "",
     *         "enable": true,
     *         "author": 0,
     *         "description": "",
     *         "text": "",
     *         "type": Number,
     *         "date_added": "",
     *         "last_updated": "",
     *         "image_path": "",
     *         "file_path": "",
     *         "nrOfViews" : Number,
     *         "therapeutic-areasID" : Array
     *         "category" : ""
     *       }
     *     ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/mobileContent')
        .get(function (req, res) {
            var types = {
                "1": "news",
                "2": "articles",
                "3": "elearning",
                "4": "downloads",
                "5": "mobileCategories"
            };
            var ret = {};
            async.each([1,2,4,5], function (type, callback) {
                var q = {type: type, enable: true};
                if(type == 4){
                    q['file_path'] = {$exists: true, $nin:[null,""]};
                }
                if(type == 5){
                    PublicCategories.find({isEnabled: true}).limit(2).sort({name: 1}).exec(function (err, categories) {
                        if(err){
                            callback(err);
                        }else{
                            ret[types[type]] = categories;
                            callback();
                        }
                    });
                }else{
                    PublicContent.find(q).sort({date_added: -1}).limit(2).exec(function (err, resp) {
                        if(err){
                            callback(err);
                        }else{
                            ret[types[type]] = resp;
                            callback();
                        }
                    })
                }
            }, function (err) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,ret);
                }
            });
        });

    /**
     * @apiName Search_Public_Content
     * @apiDescription Search in public content for keyword/phrase
     * @apiGroup Public Content
     * @api {get} /apiPublic/publicSearch search in public content for keyword/phrase
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiParam {String} term String/phrase to search.
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/publicSearch?term=something
     * @apiSuccess {Array} response.success a list of public content entities.
     * @apiSuccess {String} response.message A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "title": "",
     *         "enable": true,
     *         "author": 0,
     *         "description": "",
     *         "text": "",
     *         "type": Number,
     *         "date_added": "",
     *         "last_updated": "",
     *         "image_path": "",
     *         "file_path": "",
     *         "nrOfViews" : Number,
     *         "therapeutic-areasID" : Array
     *         "category" : ""
     *       }
     *     ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/publicSearch')
        .get(function(req,res){
            var term = req.query.term;

            PublicContent.search({
                query_string: {
                    query: term,
                    default_operator: 'OR',
                    lowercase_expanded_terms: true
                }
            },{ hydrate: true, hydrateOptions: {find: {enable:true}}}, function(err, results) {
                if(err){
                    handleError(res,err,500);
                }else{
                    //console.log(results.hits.hits);
                    if(!results || !results.hits || !results.hits.hits){
                        handleError(res,null,500);
                    }else{
                        handleSuccess(res,results.hits.hits);
                    }

                }
            });
        });

    /**
     * @apiName Retrive_Therapeutic_Areas
     * @apiDescription Get the public therapeutic areas
     * @apiGroup Therapeutic Areas
     * @api {get} /apiPublic/therapeuticAreas Get the public therapeutic areas
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/therapeuticAreas
     * @apiSuccess {Array} response.success a list of public therapeutic areas.
     * @apiSuccess {String} response.message A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "name": "",
     *         "enabled": true,
     *         "last_updated": ""
     *       }
     *     ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/therapeuticAreas')

        .get(function (req, res) {
            var q = {enabled: true};
            if(!req.isAuthenticated()) q.is_public = true;
            TherapeuticAreas.find(q).sort({name: 1}).exec(function (err, resp) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,resp);
                }
            })
        });

    /**
     * @apiName Retrive_Most_Read_Public_Content
     * @apiDescription Retrive the most read content for public section
     * @apiGroup Public Content
     * @api {get} /apiPublic/content retrieve the most read content for public section
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiParam {Number} type Public content type (1 = stire (noutati); 2 = articol (despre); 3 = elearning; 4 = download).
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/content?type=1
     * @apiSuccess {Array} response.success a list of public content entities.
     * @apiSuccess {String} response.message A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "title": "",
     *         "enable": true,
     *         "author": 0,
     *         "description": "",
     *         "text": "",
     *         "type": Number,
     *         "date_added": "",
     *         "last_updated": "",
     *         "image_path": "",
     *         "file_path": "",
     *         "nrOfViews" : Number,
     *         "therapeutic-areasID" : Array
     *         "category" : ""
     *       }
     *     ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/mostRead')

        .get(function (req, res) {
            if(req.query.type){
                var q = {type: req.query.type, enable: true};
                if(req.query.withFile){
                    q['file_path'] = {$exists: true, $nin:[null,""]};
                }
                PublicContent.find(q).sort({nrOfViews: -1}).limit(3).exec(function (err, resp) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,resp);
                    }
                })
            }else{
                handleError(res,null,400,6);
            }

        });

    /**
     * @apiName Retrive_Public_Events
     * @apiDescription Get the public events
     * @apiGroup Public Events
     * @api {get} /apiPublic/events Get the public events
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/events
     * @apiSuccess {Array} response.success a list of public events.
     * @apiSuccess {String} response.message A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "description": "",
     *         "enable": true,
     *         "end": "",
     *         "groupsID" : Array,
     *         "last_updated" : "",
     *         "name" : ""
     *         "place" : "",
     *         "start" : "",
     *         "type" : "",
     *         "listconferences" : Array,
     *         "pathologiesID" : Array,
     *         "isPublic" : true
     *       }
     *     ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/events')

        .get(function (req, res) {
            var daysToReturn = 80;
            var startDate = new Date(new Date().setDate(new Date().getDate()-(daysToReturn/2)));
            var endDate = new Date(new Date().setDate(new Date().getDate()+(daysToReturn/2)));
            Events.find({enable: {$exists: true, $ne: false}, start: {$gt: startDate, $lt: endDate}, isPublic: true}).exec(function (err, resp) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,resp);
                }
            });
        });

    /**
     * @apiName Retrive_Public_Categories
     * @apiDescription Get the public categories
     * @apiGroup Public Categories
     * @api {get} /apiPublic/categories Get the public categories
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiParam {String} id Id for retrieving a specific public category instead of all public categories.
     * @apiExample {curl} Example usage (all categories):
     *     curl -i http://localhost:8080/apiPublic/categories
     * @apiExample {curl} Example usage (single category):
     *     curl -i http://localhost:8080/apiPublic/categories?id=wdjhwdnw11
     * @apiSuccess {Array} response.success a list of public categories (or a specific category).
     * @apiSuccess {String} response.message A success message.
     * @apiSuccessExample {json} Success-Response (all categories):
     *     HTTP/1.1 200 OK
     *     {
     *       "success": [
     *       {
     *         "_id": "",
     *         "name": "",
     *         "isEnabled": true,
     *         "description": "",
     *         "image_path" : Array,
     *         "last_updated" : ""
     *       }
     *     ],
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiSuccessExample {json} Success-Response (one category):
     *     HTTP/1.1 200 OK
     *     {
     *       "success":
     *       {
     *         "_id": "",
     *         "name": "",
     *         "isEnabled": true,
     *         "description": "",
     *         "image_path" : Array,
     *         "last_updated" : ""
     *       },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/categories')
        .get(function (req, res) {
            if(req.query.id){
                PublicCategories.findOne({_id: req.query.id}, function (err, category) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,category);
                    }
                });
            }else{
                PublicCategories.find({isEnabled: true}).sort({last_updated: -1}).exec(function (err, categories) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,categories);
                    }
                });
            }
        });

    /**
     * @apiName Retrive_Terms_Conditions
     * @apiDescription Get the terms & conditions
     * @apiGroup Terms & conditions
     * @api {get} /apiPublic/termsAndConditionsStaywell Get the terms & conditions
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/termsAndConditionsStaywell
     * @apiSuccess {HTML} HTMLContent The HTML page containing the terms & conditions.
     * @apiSuccessExample {HTML} Success-Response:
     *     HTTP/1.1 200 OK
     *     '<html></html>'
     */
    router.route('/termsAndConditionsStaywell')
        .get(function (req, res) {
            res.sendFile('/private_storage/termsAndConditionsStaywell.html', {root: __dirname});
        });

    /**
     * @apiName Retrive_Terms_Conditions_MSD
     * @apiDescription Get the terms & conditions (MSD)
     * @apiGroup Terms & conditions MSD
     * @api {get} /apiPublic/termsAndConditionsStaywell Get the terms & conditions (MSD)
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiPublic/termsAndConditionsMSD
     * @apiSuccess {HTML} HTMLContent The HTML page containing the terms & conditions.
     * @apiSuccessExample {HTML} Success-Response:
     *     HTTP/1.1 200 OK
     *     '<html></html>'
     */
    router.route('/termsAndConditionsMSD')
        .get(function (req, res) {
            res.sendFile('/private_storage/termsAndConditionsMSD.html', {root: __dirname});
        });


    app.use('/apiPublic', router);
};