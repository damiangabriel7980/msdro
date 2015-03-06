const AMAZON_BUCKET = process.env.amazonBucket;
const AMAZON_PREFIX = "https://s3-eu-west-1.amazonaws.com/"+AMAZON_BUCKET+"/";

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