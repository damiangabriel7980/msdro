/**
 * Created by andrei.mirica on 24/08/16.
 */
var Content     = require('./models/articles');
var Pathologies = require('./models/pathologies');
var specialProduct = require('./models/specialProduct');
var specialProductMenu = require('./models/specialProduct_Menu');

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
                            _id : resp._id,
                            title : resp[titleField],
                            short_description: resp.short_description,
                            header_image : resp.header_image ? resp.header_image : null
                        };
                        if(req.query.type === 'product'){
                            specialProductMenu.distinct("children_ids", function (err, children_ids) {
                                if(err){
                                    handleError(res,err,500);
                                }else{
                                    //next, get all menu items that are not children; populate their children_ids attribute
                                    specialProductMenu.find({product: queryObject._id, _id: {$nin: children_ids}}).sort({order_index: 1}).populate({path: 'children_ids', options: { sort: {order_index: 1}}}).exec(function (err, menuItems) {
                                        if(err){
                                            handleError(res,err,500);
                                        }else{
                                            //now you got the full menu nicely organised
                                            objectToSend.menuItems = menuItems;
                                            handleSuccess(res, objectToSend);
                                        }
                                    });
                                }
                            });
                        } else {
                            handleSuccess(res,objectToSend);
                        }
                    } else {
                        handleError(res,err,404,1);
                    }
                }
            })
        });

    app.use('/apiPreview', router);
};