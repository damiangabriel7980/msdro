/**
 * Created by user on 29.10.2015.
 */
var guidelineCategory = require('./models/guidelineCategory');
var guidelineFile = require ('./models/guidelineFile');
var ModelInfos = require('./modules/modelInfos');
var async = require('async');

module.exports = function(app, logger, router) {

    //=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

    app.all('/apiGuidelines', function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET");
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Last-Modified");
        next();
    });

    router.route('/last_updated')
        .get(function (req, res) {
            ModelInfos.getLastUpdate('guideline').then(function(resp){
                if(new Date(resp).getTime() > req.query.timestamp){
                    guidelineCategory.find({'enabled':true},function(err,categories){
                        if(err){
                            handleError(res,err ,500);
                        }
                        else if (categories.length == 0){
                            handleSuccess(res,304,16);
                        }else{
                            handleSuccess(res,categories);
                        }
                    });
                }else{
                    handleSuccess(res,304,16);
                }
            });
        });
    router.route('/category')
        .get(function(req,res){
            guidelineFile.find({$and:[{'enabled':true},{'guidelineCategoryId':req.query.id}]}).select('_id type guidelineFileUrl displayName lastModified creationDate').exec(function(err,files){
                if(err){
                    handleError(res,err,500);
                }
                else if (files.length == 0){
                    handleSuccess(res,304,16);
                }
                else{
                    var filesToSend = [];
                    async.each(files,function(file,callback){
                        filesToSend.push(file);
                        callback();
                    },function(filesToSend){
                        handleSuccess(res,files);
                    })
                }
            })

        });

    app.use('/apiGuidelines', router);
};