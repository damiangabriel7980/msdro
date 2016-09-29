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

    /**
     * @apiName Get_GuideLines_By_Date
     * @apiDescription Retrieve a set of guidelines categories by last updated date
     * @apiGroup Guidelines
     * @api {get} /apiGuidelines/last_updated Retrieve a set of guidelines categories by last updated date
     * @apiVersion 1.0.0
     * @apiPermission none
     * @apiParam {Date} lastModified A date for filtering the guidelines categories
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiGuidelines/last_updated?lastModified=08/22/2016
     * @apiSuccess {Array} response.success         an array containing a list of guidelines categories (or an empty object if no categories were found)
     * @apiSuccess {String}   response.message       A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success":
     *       {
     *
     *       },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiSuccessExample {json} Success-Response (304):
     *     HTTP/1.1 304 Not Modified
     *     {
     *       "success":
     *       {
     *
     *       },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Query Error",
     *       "data" : {}
     *     }
     */
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

    /**
     * @apiName Get_GuideLines_Category_Files
     * @apiDescription Retrieve a set of guidelines categories files
     * @apiGroup Guidelines
     * @api {get} /apiGuidelines/category Retrieve a set of guidelines categories files
     * @apiVersion 1.0.0
     * @apiPermission none
     * @apiParam {String} id The id of the guidelines category
     * @apiExample {curl} Example usage:
     *     curl -i http://localhost:8080/apiGuidelines/category?id=2rf1ffsq2dwdawd
     * @apiSuccess {Array} response.success         an array containing a list of files from a guidelines category (or an empty object if the category wasn't found)
     * @apiSuccess {String}   response.message       A success message.
     * @apiSuccessExample {json} Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success":
     *       {
     *
     *       },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiSuccessExample {json} Success-Response (304):
     *     HTTP/1.1 304 Not Modified
     *     {
     *       "success":
     *       {
     *
     *       },
     *       "message": "Cererea a fost procesata cu succes"
     *     }
     * @apiUse ErrorOnServer
     * @apiErrorExample {json} Error-Response (500):
     *     HTTP/1.1 500 Server Error
     *     {
     *       "error": "Query Error",
     *       "data" : {}
     *     }
     */
    router.route('/category')
        .get(function(req,res){
            guidelineCategory.find({$and:[{'enabled':true},{'_id':req.query.id}]}).populate('guidelineFiles',null,{enabled:true}).exec(function(err,category){
                if(err){
                    handleError(res,err,500);
                }
                else if (category.length == 0){
                    handleSuccess(res,304,16);
                }
                else{
                    res.status(200).send(category[0].guidelineFiles);

                }
            })

        });

    app.use('/apiGuidelines', router);
};