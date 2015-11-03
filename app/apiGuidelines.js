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
            if(req.query.lastModified){
            ModelInfos.getLastUpdate('guideline').then(function(resp){
                if(new Date(resp).getTime() > new Date(req.query.lastModified).getTime()){
                    guidelineCategory.find({'enabled':true},function(err,categories){
                        if(err){
                            handleError(res,err ,500);
                        }
                        else if (categories.length == 0){
                            handleSuccess(res,304,16);
                        }else{
                            res.send(categories);
                        }
                    });
                }else{
                    handleSuccess(res,304,16);
                }
            });
            }else{
                guidelineCategory.find({'enabled':true}).select('_id lastModified name creationDate imageUrl').exec(function(err,categories){
                    if(err){
                        handleError(res,err,500)
                    }else{
                        res.send(categories);
                    }
                })
            }
        });
    router.route('/category')
        .get(function(req,res){
            guidelineCategory.find({$and:[{'enabled':true},{'_id':req.query.id}]}).populate('guidelineFiles').exec(function(err,category){
                if(err){
                    handleError(res,err,500);
                }
                else if (category.length == 0){
                    handleSuccess(res,304,16);
                }
                else{
                    var filesToSend = [];
                    async.each(category[0].guidelineFiles,function(file,callback){
                        filesToSend.push(file);
                        callback(filesToSend);
                    },function(filesToSend){
                        handleSuccess(res,filesToSend);
                    })
                }
            })

        });

    app.use('/apiGuidelines', router);
};