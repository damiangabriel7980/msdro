var ObjectId = require('mongoose').Types.ObjectId;

var SHA512   = require('crypto-js/sha512');

var Parameters = require('./models/parameters');
var DPOC_Devices = require('./models/DPOC_Devices');

var MailerModule = require('./modules/mailer');

module.exports = function(app, logger, router) {

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

    /**
     * @apiName Send_Email_From_DPOC_App
     * @apiDescription Send an email from DPOC Application
     * @apiGroup DPOC
     * @api {post} /apiDPOC/report Send an email from DPOC Application
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiParam {String} message The message to send via email
     * @apiParam {String} phone The phone number of the sender
     * @apiParam {Boolean} [accepted] If the sender doesn't agree to be contacted
     * @apiParam {String} patientNumber The patient's number
     * @apiParam {String} patientSex The patient's sex
     * @apiParam {String} name The name of the patient
     * @apiParam {String} reportType The type of the report
     * @apiParam {String} reporterType The sender's type
     * @apiExample {curl} Example usage:
     *     curl -i -X POST -H "Authorization: Bearer " -d '{"message":"someMessage","phone":"1234141222", "accepted": true,
     *    "patientNumber": "34", "patientSex": "M", "name": "John", "reportType": "someType", "reporterType": "medic"}'
     *     http://localhost:8080/apiDPOC/report
     * @apiSuccess {Object} response an empty object
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
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

                    var templateContent = [
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
                    ];
                    MailerModule.send(
                        "DPOC",
                        templateContent,
                        emailTo,
                        'DPOC Report'
                    ).then(
                        function (success) {
                            res.statusCode = 200;
                            res.end();
                        },
                        function (err) {
                            logger.error(err);
                            res.statusCode = 500;
                            res.end();
                        }
                    );
                }
            });
        });

    /**
     * @apiName validate_Device_DPOC_App
     * @apiDescription Validate a device for DPOC application
     * @apiGroup DPOC
     * @api {get} /apiDPOC/validate Validate a device for DPOC application
     * @apiVersion 1.0.0
     * @apiPermission medic
     * @apiUse HeaderAuthorization
     * @apiHeader {String} authorization-code a code specific to a registered DPOC device
     * @apiHeader {String} authorization-uuid the id of the registered DPOC device
     * @apiExample {curl} Example usage:
     *     curl -i -H "Authorization: Bearer " -H "authorization-code: someCode" -H
     *     "authorization-uuid: someUUID" http://localhost:8080/apiDPOC/report
     * @apiSuccess {Object} response an empty object
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *
     *     }
     */
    router.route('/validate')
        .get(validateDevice, function (req, res) {
            //if we got here, the device is valid
            //console.log(req.nameDPOC);
            res.statusCode = 200;
            res.end();
        });

    app.use('/apiDPOC', router);
};