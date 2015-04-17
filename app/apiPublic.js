var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
var PublicCategories = require('./models/publicCategories');
var Events = require('./models/events');
var TherapeuticAreas = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');

var ObjectId = require('mongoose').Types.ObjectId;

var getIds = function (documentsArray) {
    var ret = [];
    for(var i=0; i<documentsArray.length; i++){
        ret.push(documentsArray[i]._id.toString());
    }
    return ret;
};

module.exports = function(app, logger, router) {

    router.route('/getCarouselData')

        .get(function (req, res) {
            PublicCarousel.find({enable: true}).sort({order_index: 1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
        });

    router.route('/content')
        .get(function (req, res) {
            if(req.query.id){
                PublicContent.findOne({_id: req.query.id, enable: true}, function (err, resp) {
                    if(err){
                        res.send({error: true});
                    }else{
                        res.send({success: resp});
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
                            res.send({error: true});
                        }else{
                            res.send({success: content});
                        }
                    });
                };

                if(params.area != 0){
                    //form an array of this area's id and all it's children id's
                    TherapeuticAreas.find({$or: [{_id: ObjectId(params.area)}, {'therapeutic-areasID': {$in: [params.area.toString()]}}]}, function (err, areas) {
                        if(err){
                            console.log(err);
                            res.send({error: true});
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
                        res.send({error: true});
                    }else{
                        res.send({success: resp});
                    }
                })
            }else if(req.query.category){
                PublicContent.find({type:2, category: req.query.category, enable: true}).sort({date_added: -1}).exec(function (err, content) {
                    if(err){
                        res.send({error: true});
                    }else{
                        res.send({success: content});
                    }
                })
            }
        });

    router.route('/publicSearchResults')
        .post(function(req,res){
            var checker=0;
            var data=req.body.data;
            PublicContent.search({

                query_string: {
                    query: data,
                    default_operator: 'OR',
                    lowercase_expanded_terms: true
                }

            },{hydrate: true}, function(err, results) {
                if(err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    console.log(results.hits.hits);
                    if(results.hits.hits.length===0)
                    {
                        checker+=1;
                        res.json([{answer:"Cautarea nu a returnat nici un rezultat!"}]);
                    }
                    else
                    {
                        //var myResults=[];
                        //for(var i=0;i<results.hits.hits.length;i++)
                        //{
                        //    if(results.hits.hits[i].groupsID.indexOf(req.user.groupsID)>-1)
                        //        myResults.push(results.hits.hits[i]);
                        //}
                        res.json(results.hits.hits);
                    }

                }
            });
        });

    router.route('/therapeuticAreas')

        .get(function (req, res) {
            TherapeuticAreas.find({enabled: true}).sort({name: 1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
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
                        res.send({error: true});
                    }else{
                        res.send({success: resp});
                    }
                })
            }else{
                res.send({error: "Missing query param: type"});
            }

        });

    router.route('/events')

        .get(function (req, res) {
            var daysToReturn = 80;
            var startDate = new Date(new Date().setDate(new Date().getDate()-(daysToReturn/2)));
            var endDate = new Date(new Date().setDate(new Date().getDate()+(daysToReturn/2)));
            Events.find({enable: {$exists: true, $ne: false}, start: {$gt: startDate, $lt: endDate}, isPublic: true}).sort({start: 1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            });
        });

    router.route('/categories')
        .get(function (req, res) {
            if(req.query.id){
                PublicCategories.findOne({_id: req.query.id}, function (err, category) {
                    if(err){
                        logger.error(err);
                        res.send({error: true});
                    }else{
                        res.send({success: category});
                    }
                });
            }else{
                PublicCategories.find({isEnabled: true}, function (err, categories) {
                    if(err){
                        logger.error(err);
                        res.send({error: true});
                    }else{
                        res.send({success: categories});
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