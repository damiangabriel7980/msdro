/**
 * Created by andrei.mirica on 24/08/16.
 */
var Content     = require('./models/articles');
var Pathologies = require('./models/pathologies');
var specialProduct = require('./models/specialProduct');

module.exports = function(app, env, logger, sessionSecret, router) {
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

    router.route('/previewItem')
        .get(function (req, res) {
            var queryObject = {
                _id : req.query.id
            };
            if(req.query.articleType){
                queryObject.type = req.query.articleType;
                queryObject.enable = {$exists:true, $ne: false};
            } else {
                queryObject.enabled = {$exists:true, $ne: false};
            }
            var contentToQuery, fieldsToSelect, titleField;
            switch (req.query.type) {
                case ('resource') :
                    contentToQuery = Content;
                    fieldsToSelect = 'title short_description';
                    titleField = 'title';
                    break;
                case ('pathology') :
                    contentToQuery = Pathologies;
                    fieldsToSelect = 'display_name header_image short_description';
                    titleField = 'display_name';
                    break;
                case ('product') :
                    contentToQuery = specialProduct;
                    fieldsToSelect = 'header_image product_name short_description';
                    titleField = 'product_name';
                    break;
            }
            contentToQuery.findOne(queryObject).select(fieldsToSelect).exec(function (err, resp) {
                if(err){
                    handleError(res,err,500);
                }else{
                    if(resp){
                        var objectToSend = {
                            title : resp[titleField],
                            short_description: resp.short_description,
                            header_image : resp.header_image ? resp.header_image : null
                        };
                        handleSuccess(res,objectToSend);
                    } else {
                        handleError(res,err,404,1);
                    }
                }
            })
        });

    app.use('/apiPreview', router);
};