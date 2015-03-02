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
            if(req.query.timestamp){
                CM_templates.find({last_modified: {$gt: new Date(req.query.timestamp)}, isEnabled: true}, function (err, templates) {
                    if(err){
                        logger.error(err);
                        res.send({error: "Error retrieving templates"});
                    }else{
                        res.send({success: templates});
                    }
                });
            }else{
                CM_templates.find({isEnabled: true}, function (err, templates) {
                    if(err){
                        logger.error(err);
                        res.send({error: "Error retrieving templates"});
                    }else{
                        res.send({success: templates});
                    }
                });
            }
        });

    app.use('/apiContractManagement', router);
};