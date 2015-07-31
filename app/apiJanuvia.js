var JanuviaUsers = require('./models/januvia/januvia_users');

module.exports = function(app, logger, router) {

	//=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

	router.route('/users').get(function (req, res) {
		var last_modified_client = req.query.last_modified;
		JanuviaUsers.find({}, {last_modified: 1}).sort({last_modified: -1}).limit(1).exec(function (err, users) {
			if(err){
				handleError(res, err);
			}else if(users.length === 0){
				handleError(res, false, 404, 1);
			}else{
				var last_modified_db = users[0].last_modified.getTime().toString();
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
			}
		});
		
	})

	app.use('/apiJanuvia', router);
}