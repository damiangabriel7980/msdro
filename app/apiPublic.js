var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');

module.exports = function(app, router) {

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