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

	app.use('/apiCosts', router);
};