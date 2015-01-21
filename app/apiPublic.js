var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
var Events = require('./models/events');

var email = require('mandrill-send')('XKp6n_7NhHB5opUWo0WWmw');

module.exports = function(app,email, router) {

    router.route('/getCarouselData')

        .get(function (req, res) {
            PublicCarousel.find({}).sort({order_index: 1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
        });

    router.route('/contentByType/:type')

        .get(function (req, res) {
            PublicContent.find({type: req.params.type}).sort({date_added: -1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
        });

    router.route('/mostReadContentByType/:type')

        .get(function (req, res) {
            PublicContent.find({type: req.params.type}).sort({date_added: -1}).limit(3).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
        });

    router.route('/contentById/:id')

        .get(function (req, res) {
            PublicContent.findOne({_id: req.params.id}, function (err, resp) {
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
            console.log(startDate);
            console.log(endDate);
            Events.find({enable: {$exists: true, $ne: false}, start: {$gt: startDate, $lt: endDate}}).sort({start: 1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    console.log(resp);
                    res.send(resp);
                }
            })
        });


    app.use('/apiPublic', router);
};