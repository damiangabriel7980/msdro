var JanuviaUsers = require('./models/januvia/januvia_users');
var ModelInfos = require('./modules/modelInfos');

module.exports = function(app, logger, router) {

	//=============================================Define variables
    var handleSuccess = require('./modules/responseHandler/success.js')(logger);
    var handleError = require('./modules/responseHandler/error.js')(logger);

	app.all('/apiJanuvia', function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET");
		res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Last-Modified");
		next();
	});

	/**
	 * @apiName Get_Januvia_Users
	 * @apiDescription Retrieve a list of Januvia Application users
	 * @apiGroup Januvia_Application
	 * @api {get} /apiJanuvia/users Retrieve a list of Januvia Application users
	 * @apiVersion 1.0.0
	 * @apiPermission none
	 * @apiParam {Date} last_modified a date to compare with the last updated date of the Januvia users database
	 * @apiExample {curl} Example usage:
	 *     curl -i http://localhost:8080/apiJanuvia/users?last_modified=23/06/2016
	 * @apiSuccess {Array} response.success         an array containing a list of Januvia Application users
	 * @apiSuccess {String}   response.message       A success message.
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     *       "success":[
     *       {
     *
     *       }],
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
	router.route('/users').get(function (req, res) {
		var last_modified_client = req.query.last_modified;
		ModelInfos.getLastUpdate("januvia_users").then(
			function (last_update) {
				var last_modified_db = last_update.getTime().toString();
				res.setHeader("Last-Modified", last_modified_db);
				if(last_modified_db !== last_modified_client){
					JanuviaUsers.find({}).deepPopulate('city.county', {
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

	app.use('/apiJanuvia', router);
};