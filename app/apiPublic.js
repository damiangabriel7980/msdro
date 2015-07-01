var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
var PublicCategories = require('./models/publicCategories');
var Events = require('./models/events');
var TherapeuticAreas = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');

var ObjectId = require('mongoose').Types.ObjectId;
var async = require('async');

var getIds = function (documentsArray) {
    var ret = [];
    for(var i=0; i<documentsArray.length; i++){
        ret.push(documentsArray[i]._id.toString());
    }
    return ret;
};

module.exports = function(app, logger, router) {
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

    router.route('/getCarouselData')
        .get(function (req, res) {
            PublicCarousel.find({enable: true}).sort({order_index: 1}).exec(function (err, resp) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,resp);
                }
            })
        });

    router.route('/content')
        .get(function (req, res) {
            if(req.query.id){
                PublicContent.findOne({_id: req.query.id, enable: true}, function (err, resp) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,resp);
                    }
                })
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
                    TherapeuticAreas.find({$or: [{_id: ObjectId(params.area)}, {'therapeutic-areasID': {$in: [params.area.toString()]}}]}, function (err, areas) {
                        if(err){
                            handleError(res,err,500);
                        }else{
                            var areasIds = getIds(areas);
                            getDocuments(areasIds);
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
        });

    router.route('/mobileContent')
        .get(function (req, res) {
            var types = {
                "1": "news",
                "2": "articles",
                "3": "elearning",
                "4": "downloads"
            };
            var ret = {};
            async.each([1,2,4], function (type, callback) {
                var q = {type: type, enable: true};
                if(type == 4){
                    q['file_path'] = {$exists: true, $nin:[null,""]};
                }
                PublicContent.find(q).sort({date_added: -1}).limit(2).exec(function (err, resp) {
                    if(err){
                        callback(err);
                    }else{
                        ret[types[type]] = resp;
                        callback();
                    }
                })
            }, function (err) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,ret);
                }
            });
        });

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

    router.route('/therapeuticAreas')

        .get(function (req, res) {
            TherapeuticAreas.find({enabled: true}).sort({name: 1}).exec(function (err, resp) {
                if(err){
                    handleError(res,err,500);
                }else{
                    handleSuccess(res,resp);
                }
            })
        });

    router.route('/mostRead')

        .get(function (req, res) {
            if(req.query.type){
                var q = {type: req.query.type, enable: true};
                if(req.query.withFile){
                    q['file_path'] = {$exists: true, $nin:[null,""]};
                }
                PublicContent.find(q).sort({date_added: -1}).limit(3).exec(function (err, resp) {
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
                PublicCategories.find({isEnabled: true}, function (err, categories) {
                    if(err){
                        handleError(res,err,500);
                    }else{
                        handleSuccess(res,categories);
                    }
                });
            }
        });

    router.route('/termsAndConditionsStaywell')
        .get(function (req, res) {
            res.sendFile('/private_storage/termsAndConditionsStaywell.html', {root: __dirname});
        });

    router.route('/termsAndConditionsMSD')
        .get(function (req, res) {
            res.sendFile('/private_storage/termsAndConditionsMSD.html', {root: __dirname});
        });


    app.use('/apiPublic', router);
};