/**
 * Created by user on 05.10.2015.
 */
var AppUpdate = require('./models/msd-applications');

module.exports = function(app, logger, router) {

    //=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

    app.all('/apiAplicationUpgrade', function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Last-Modified");
        next();
    });

    router.route('/').get(function (req, res) {

        AppUpdate.findOne({name:req.query.name},function(err, apps)
        {   console.log(req.query);
            if (err) {
                handleError(err);
            }
            else {
                handleSuccess(res, apps);
            }
        })
    });

    app.use('/apiAplicationUpgrade', router);
};