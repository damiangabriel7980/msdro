var ObjectId = require('mongoose').Types.ObjectId;

var SHA512   = require('crypto-js/sha512');

var Parameters = require('./models/parameters');
var DPOC_Devices = require('./models/DPOC_Devices');

module.exports = function(app, mandrill, logger, router) {

    //access control allow origin *
    app.all("/apiDPOC/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    //========================================================================================================================================== ROUTES

    router.route('/report')
        .post(function (req, res) {
            //validate device uuid
            var uuid = req.headers.authorization;
            DPOC_Devices.findOne({uuid: SHA512(uuid).toString()}, function (err, device) {
                if(err){
                    logger.error(err);
                    res.statusCode = 500;
                    res.end();
                }else if(!device){
                    res.statusCode = 403;
                    res.end();
                }else{
                    //get email
                    Parameters.findOne({name: "DPOC_MAIL_TO"}, function (err, param) {
                        if(err || !param){
                            logger.error(err);
                            res.statusCode = 500;
                            res.end();
                        }else{
                            var emailTo = param.value?param.value:param.default_value;
                            console.log(req.body);
                            mandrill('/messages/send-template', {
                                "template_name": "DPOC",
                                "template_content": [
                                    {
                                        "name": "message",
                                        "content": req.body.message
                                    },
                                    {
                                        "name": "name",
                                        "content": req.body.name
                                    },
                                    {
                                        "name": "patientNumber",
                                        "content": req.body.patientNumber
                                    },
                                    {
                                        "name": "patientSex",
                                        "content": req.body.patientSex
                                    },
                                    {
                                        "name": "phone",
                                        "content": req.body.phone
                                    },
                                    {
                                        "name": "reportType",
                                        "content": req.body.reportType
                                    },
                                    {
                                        "name": "reporterType",
                                        "content": req.body.reporterType
                                    },
                                    {
                                        "name": "selectedProduct",
                                        "content": req.body.selectedProduct
                                    }
                                ],
                                "message": {
                                    from_email: 'adminMSD@qualitance.ro',
                                    to: [{email: emailTo}],
                                    subject:'DPOC Report'
                                }

                            }, function(err){
                                if(err) {
                                    logger.error(err);
                                    res.statusCode = 500;
                                    res.end();
                                }else{
                                    res.statusCode = 200;
                                    res.end();
                                }
                            });
                        }
                    });
                }
            });
        });

    app.use('/apiDPOC', router);
};