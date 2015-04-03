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

    var validateDevice = function (req, res, next) {
        var deviceCode = req.headers["authorization-code"];
        var deviceUUID = req.headers["authorization-uuid"];
        if(!deviceCode || !deviceUUID){
            res.statusCode = 403;
            res.end();
        }else{
            //find a device with the same code as the sent code
            DPOC_Devices.findOne({code: SHA512(deviceCode).toString()}, function (err, device) {
                if(err){
                    logger.error(err);
                    res.statusCode = 500;
                    res.end();
                }else if(!device){
                    res.statusCode = 403;
                    res.end();
                }else if(!device.uuid){ //if the device has no uuid, assign it the one just sent
                    DPOC_Devices.update({_id: device._id}, {$set: {uuid: deviceUUID}}, function (err, wres) {
                        if(err){
                            res.statusCode = 500;
                            res.end();
                        }else{
                            //allow pass
                            req.nameDPOC = device.name;
                            next();
                        }
                    });
                }else if(device.uuid === deviceUUID){ //check the device's uuid against the one just sent
                    //allow pass
                    req.nameDPOC = device.name;
                    next();
                }else{
                    res.statusCode = 403;
                    res.end();
                }
            });
        }
    };

    router.route('/report')
        .post(validateDevice, function (req, res) {
            //get email
            Parameters.findOne({name: "DPOC_MAIL_TO"}, function (err, param) {
                if(err || !param){
                    logger.error(err);
                    res.statusCode = 500;
                    res.end();
                }else{
                    var emailTo = [];
                    if(param.default_value) emailTo.push({email: param.default_value});
                    if(param.value) emailTo.push({email: param.value});

                    var message = req.body.message || "";
                    message = message.replace(/\n/g,'<br>');

                    var phone = req.body.phone || "";
                    if(!req.body.accepted){
                        phone = phone + " (nu doreste sa fie contactat)";
                    }

                    var patientNumber = req.body.patientNumber || 0;
                    var patientSex = req.body.patientSex;

                    if(!patientSex || (patientNumber !=1 && patientNumber != "N/A")){
                        patientSex = "Vezi descriere";
                    }

                    mandrill('/messages/send-template', {
                        "template_name": "DPOC",
                        "template_content": [
                            {
                                "name": "message",
                                "content": message
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
                                "content": patientSex
                            },
                            {
                                "name": "phone",
                                "content": phone
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
                            },
                            {
                                "name": "deviceName",
                                "content": req.nameDPOC
                            }
                        ],
                        "message": {
                            from_email: 'adminMSD@qualitance.ro',
                            to: emailTo,
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
        });

    router.route('/validate')
        .get(validateDevice, function (req, res) {
            //if we got here, the device is valid
            //console.log(req.nameDPOC);
            res.statusCode = 200;
            res.end();
        });

    app.use('/apiDPOC', router);
};