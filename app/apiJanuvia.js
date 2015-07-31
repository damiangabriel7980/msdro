var JanuviaUsers = require('./models/januvia/januvia_users');

module.exports = function(app, logger, router) {

	//=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

	router.route('/users').get(function (req, res) {
		JanuviaUsers.find({}, function (err, users) {
			if(err){
				handleError(res, err);
			}else{
				handleSuccess(res, users);
			}
		});
	})

	router.route('/last_modified').get(function (req, res) {
		JanuviaUsers.find({}, {last_modified: 1}).sort({last_modified: -1}).limit(1).exec(function (err, users) {
			if(err){
				handleError(res, err);
			}else if(users.length === 0){
				handleError(res, false, 404, 1);
			}else{
				handleSuccess(res, users[0].last_modified);
			}
		});
	});


	app.use('/apiJanuvia', router);
}