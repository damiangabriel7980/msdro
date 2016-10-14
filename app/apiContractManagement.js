var Config = require('../config/environment.js'),
    my_config = new Config();

const AMAZON_PREFIX = my_config.amazonPrefix + my_config.amazonBucket + "/";

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var CM_templates = require('./models/CM_templates');

module.exports = function(app, logger, router) {

    //access control allow origin *
    app.all("/apiContractManagement/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    /**
     * @apiName Contract_Management
     * @apiDescription Retrieve a contract template
     * @apiGroup Contract Management
     * @api {get} /apiPublic/apiContractManagement/templates Retrieve a contract template
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {Date} timestamp A date to filter the number of template
     * @apiExample {curl} Example usage:
     *     curl -i -H 'Authorization: Bearer ' http://localhost:8080/apiContractManagement/templates?timestamp=09/26/2016
     * @apiSuccess {Object} response.success         an object containing the current version and the download URL
     * @apiSuccess {String}   response.message       A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success":
     *       {
     *
     *       }
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Query Error",
     *       "data" : {}
     *     }
     */
    //=================================================================================================================== ROUTES
    router.route('/templates')
        .get(function (req, res) {
            var templates = [];
            var q = {isEnabled: true};
            if(req.query.timestamp){
                q['last_modified'] = {$gt: new Date(req.query.timestamp)};
            }
            CM_templates.find(q).stream()
                .on('data', function (doc) {
                    //console.log(doc);
                    templates.push({
                        name: doc.name,
                        path: AMAZON_PREFIX+"contractManagement/"+doc._id+"/",
                        last_modified: doc.last_modified
                    });
                })
                .on('error', function (err) {
                    return res.send({error: "Error retrieving templates"});
                })
                .on('end', function () {
                    res.send({success: templates});
                });
//                CM_templates.aggregate([
//                    {$match: {isEnabled: true}},
//                    {$project: {
//                        "name": 1,
//                        "last_modified": 1,
//                        "path": {$concat: [AMAZON_PREFIX,"contractManagement/","$_id"]}
//                    }}
//                ], function (err, templates) {
//                    if(err){
//                        logger.error(err);
//                        res.send({error: "Error retrieving templates"});
//                    }else{
//                        res.send({success: templates});
//                    }
//                });
        });

    app.use('/apiContractManagement', router);
};