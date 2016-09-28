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
    /**
     * @apiName IPad_Applications_Update
     * @apiDescription Check if there are newer versions of Staywell iPad apps
     * @apiGroup IPad Applications
     * @api {get} /apiPublic/apiAplicationUpgrade Check if there are newer versions of Staywell iPad apps
     * @apiVersion 1.0.0
     * @apiPermission None
     * @apiParam {String} name The name of the application
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiAplicationUpgrade?name=arcoxia
     * @apiSuccess {Object} response.success         an object containing the current version and the download URL
     * @apiSuccess {String}   response.message       A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success":
     *         {
     *         "version": "1.2",
     *         "downloadUrl": "https://"
     *         }
     *     },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Query Error",
     *       "data" : {}
     *     }
     * @apiError {Object} ApplicationNotFound The requested app was not found.
     * @apiErrorExample {json} Error-Response (4xx):
     *     HTTP/1.1 4xx Error
     *     {
     *       "error": "Error Message",
     *       "data" : {}
     *     }
     */
    router.route('/').get(function (req, res) {

        AppUpdate.find({name:req.query.name}).limit(1).exec(function(err, apps)
        {
            if (err) {
                handleError(res,err);
            }
            else {
                if(apps.length > 0){
                    var appInfo ={};
                    appInfo.version = apps[0].version;
                    appInfo.downloadUrl = apps[0].downloadUrl;
                    handleSuccess(res, appInfo);
                }
                    else
                        handleError(res, false, 404, 44);
            }
        })
    });

    app.use('/apiAplicationUpgrade', router);
};