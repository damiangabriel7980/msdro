var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
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


    app.use('/apiPublic', router);
};