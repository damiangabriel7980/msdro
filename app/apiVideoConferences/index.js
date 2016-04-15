var ConferenceService = require('./service.js');

var TokenModule = require('../modules/tokenAuth');

var User = require('../models/user');

module.exports = function(app, env, logger, router){

    // We are going to protect /apiVideoConferences routes with both JWT and passport
    app.use('/apiVideoConferences', function customAuthenticator(req, res, next){
    	// first we will check if the user is authenticated via password
    	// if not, we will check if the user is authenticated via token
    	if(req.isAuthenticated()){
    		next();
    	}else if(TokenModule.isAuthorized(req)){
    		//we need the full user info on the request
    		var user = TokenModule.getUserData(req);
    		if(!user){
    			return handleError(res, "Forbidden", 403);
    		}else{
    			User.findOne({_id: user.id}, function(err, user){
    				if(err || !user){
    					return handleError(res, "Forbidden", 403);
    				}else{
    					req.user = user;
    					next();
    				}
    			});
    		}
    	}else{
			return handleError(res, "Forbidden", 403);
		}
	});

	router.route('/')
		.get(function(req, res){
			ConferenceService.getAttendingConferences(req.user.username).then(
			  function(conferences) {
			    handleSucces(res, conferences);
			  },
			  function(err) {
			    handleError(res, err);
			  }
			);
		});

	router.route('/conferenceDetails')
		.get(function(req, res){
			if (req.query.id){
			  ConferenceService.getConference(req.query.id).then(
			    function(conferenceDetails){
			      handleSucces(res,conferenceDetails);
			    },
			    function(err){
			      handleError(res,err);
			    }
			  );
			} else {
			  handleError(res,"Missing query param: id (the id of the conference)", 400);
			}
		});

	router.route('/conferenceStatus')
		.get(function(req, res){
			if (req.query.id){
			  ConferenceService.getConferenceActiveStatus(req.query.id).then(
			    function(status){
			      handleSucces(res, {status: status});
			    },
			    function(err){
			      handleError(res, err);
			    }
			  );
			} else {
			  handleError(res,"Missing query param: id (the id of the conference)", 400);
			}
		});

	router.route('/role')
		.get(function(req, res){
			if (req.query.id){
				ConferenceService.getConferenceRole(req.user.username, req.query.id).then(
					function(role){
						handleSucces(res, {role: role});
					},
					function(err){
						handleError(res, err);
					}
				);
			} else {
				handleError(res, "Missing query param: id (the id of the conference)", 400);
			}
		});

	router.route('/credentials')
		.get(function(req, res){
			res.status(200).json({
			  uname: "asd",
			  upass: "dfg",
			  turnConfig: {
			    address: env.conference.turnConfig.address,
			    port: env.conference.turnConfig.port
			  }
			});
		});

	router.route('/user')
		.get(function(req, res){
			User.findOne({_id: req.user._id}).exec(function(err, user){
				if(err){
					handleError(res, err);
				}else if(!user){
					handleError(res);
				}else{
					handleSucces(res, user);
				}
			});
		});

	router.route('/chat/messages')
		.get(function(req, res){
			ConferenceService.getMessageHistory(req.user.username, req.user._id, req.query.id).then(
				function(history){
					handleSucces(res, history);
				},
				function(err){
					handleError(res, err);
				}
			);
		})
		.post(function(req, res){
			ConferenceService.pushChatMessage(req.body).then(
				function(message){
					handleSucces(res, message);
				},
				function(err){
					handleError(res, err);
				}
			);
		});

	router.route('/chat/kickUser')
		.post(function(req, res){
			ConferenceService.kickUser(req.user.username, req.body.userId, req.body.conferenceId)
				.then(function(){
					handleSucces(res);
				})
				.catch(function(err){
					handleError(res, err);
				});
		});

	app.use('/apiVideoConferences', router);
}

function handleError(res, err, status){
	if(err) console.log(err);
	return res.status(status || 500).end();
}

function handleSucces(res, data){
	return res.status(200).send(data);
}