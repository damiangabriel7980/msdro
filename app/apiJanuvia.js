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


	app.use('/apiJanuvia', router);
}