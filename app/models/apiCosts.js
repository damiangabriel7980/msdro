var CostsList = require('./models/costs/costs_model');
var ModelInfos = require('./modules/modelInfos');

module.exports = function(app, logger, router) {

	//=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

	app.all('/apiCosts', function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET");
		res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Last-Modified");
		next();
	});

	router.route('/users').get(function (req, res) {
		var last_modified_client = req.query.last_modified;
		ModelInfos.getLastUpdate("costs_model").then(
			function (last_update) {
				var last_modified_db = last_update.getTime().toString();
				res.setHeader("Last-Modified", last_modified_db);
				if(last_modified_db !== last_modified_client){
					CostsList.find({}).deepPopulate('city.county', {
						populate: {
							'city.county': {
								select: 'name'
							}
						}
					}).exec(function (err, users) {
						if(err){
							handleError(res, err);
						}else{
							handleSuccess(res, users);
						}
					});
				}else{
					handleSuccess(res, {}, 0, 304);
				}
			},
			function (err) {
				handleError(res, err);
			}
		);
	});

	app.use('/apiCosts', router);
};