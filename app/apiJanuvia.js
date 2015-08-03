var JanuviaUsers = require('./models/januvia/januvia_users');
var ModelInfos = require('./modules/modelInfos');

module.exports = function(app, logger, router) {

	//=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

	router.route('/users').get(function (req, res) {
		var last_modified_client = req.query.last_modified;
		ModelInfos.getLastUpdate("januvia_users").then(
			function (last_update) {
				var last_modified_db = last_update.getTime().toString();
				res.setHeader("last_modified", last_modified_db);
				if(last_modified_db !== last_modified_client){
					JanuviaUsers.find({}, function (err, users) {
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

	app.use('/apiJanuvia', router);
};