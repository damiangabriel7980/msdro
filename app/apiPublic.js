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

    router.route('/events')

        .get(function (req, res) {
            Events.find({enable: {$exists: true, $ne: false}}).sort({start: 1}).exec(function (err, resp) {
                if(err){
                    res.send(err);
                }else{
                    res.send(resp);
                }
            })
        });


    app.use('/apiPublic', router);
};