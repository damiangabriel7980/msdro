var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
var Events = require('./models/events');
var TherapeuticAreas = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');

var email = require('mandrill-send')('XKp6n_7NhHB5opUWo0WWmw');

var getIds = function (documentsArray) {
    var ret = [];
    for(var i=0; i<documentsArray.length; i++){
        ret.push(documentsArray[i]._id.toString());
    }
    return ret;
};

module.exports = function(app,email, router) {

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

    router.route('/contentByType/:type')

        .get(function (req, res) {
            var paramsObject = {type: req.params.type, enable: true};
                if(req.params.type==4 || req.params.type==3)
                    paramsObject = {$and : [paramsObject,{file_path:{$exists: true,$nin:[null,""]}}]};
            PublicContent.find(paramsObject).sort({date_added: -1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
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

    router.route('/contentByTypeAndTherapeuticArea')

        .post(function (req, res) {

            var requestData = req.body;

            //get documents once we know their therapeutic areas
            var getDocuments = function (areasIds) {
                var q = {type: requestData.type, enable: true};
                if(areasIds){
                    q['therapeutic-areasID'] = {$in: areasIds};
                }
                if(requestData.type==3)
                    q = {$and : [q,{file_path:{$exists: true,$nin:[null,""]}}]};
                PublicContent.find(q).sort({date_added: -1}).exec(function (err, content) {
                    if(err){
                        res.send(err);
                    }else{
                        res.send(content);
                    }
                });
            };


            if(requestData.area && requestData.type){
                var area = requestData.area;
                if(area._id != 0){
                    if(area.has_children){
                        //form an array of parent's id and all it's children id's
                        TherapeuticAreas.find({$or: [{_id: area._id}, {'therapeutic-areasID': {$in: [area._id.toString()]}}]}, function (err, areas) {
                            if(err){
                                res.send(err);
                            }else{
                                var areasIds = getIds(areas);
                                getDocuments(areasIds);
                            }
                        })
                    }else{
                        //we only need the parent's id
                        getDocuments([area._id.toString()]);
                    }
                }else{
                    //we need all documents
                    getDocuments();
                }
            }else{
                res.statusCode = 400;
                res.end();
            }
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

    router.route('/mostReadContentByType/:type')

        .get(function (req, res) {
            PublicContent.find({type: req.params.type, enable: true}).sort({date_added: -1}).limit(3).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
        });

    router.route('/contentById/:id')

        .get(function (req, res) {
            PublicContent.findOne({_id: req.params.id, enable: true}, function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
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

    router.route('/termsAndConditions')
        .get(function (req, res) {
            res.sendFile('/private_storage/termsAndConditions.html', {root: __dirname});
        });


    app.use('/apiPublic', router);
};