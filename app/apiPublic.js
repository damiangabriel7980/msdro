var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
var Events = require('./models/events');
var TherapeuticAreas = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');

var email = require('mandrill-send')('XKp6n_7NhHB5opUWo0WWmw');

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
            PublicContent.find({type: req.params.type, enable: true}).sort({date_added: -1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
        });

    router.route('/contentByTypeAndTherapeuticArea/:type:tpa')

        .get(function (req, res) {
            var q = {type: req.params.type, enable: true};
            if(req.params.tpa != 0){
                q["therapeutic-areasID"] = {$in: [req.params.tpa]};
            }
            PublicContent.find(q).sort({date_added: -1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
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
            UserGroup.findOne({"display_name":"Pacienti"}, function (err, group) {
                if(err){
                    res.send(err);
                }else if(!group){
                    res.send([]);
                }else{
                    Events.find({enable: {$exists: true, $ne: false}, start: {$gt: startDate, $lt: endDate}, groupsID: {$in: [group._id.toString()]}}).sort({start: 1}).exec(function (err, resp) {
                        if(err){
                            res.send(err);
                        }else{
                            res.send(resp);
                        }
                    })
                }
            });
        });

    router.route('/termsAndConditions')
        .get(function (req, res) {
            res.sendFile('/private_storage/termsAndConditions.html', {root: __dirname});
        });


    app.use('/apiPublic', router);
};