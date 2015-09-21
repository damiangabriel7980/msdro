var Courses = require('../../models/elearning/courses');
var Chapters = require('../../models/elearning/chapters');
var Subchapters = require('../../models/elearning/subchapters');
var Slides = require('../../models/elearning/slides');
var Questions = require('../../models/elearning/questions');
var Answers = require('../../models/elearning/answers');
var Users = require('../../models/user');

var async = require('async');
var Q = require('q');

module.exports = function(env, logger, amazon, router){

	var handleSuccess = require('../../modules/responseHandler/success.js')(logger);
    var handleError = require('../../modules/responseHandler/error.js')(logger);

	router.route('/admin/elearning/courses')
	    .get(function (req, res) {
	        if(req.query.id){
	            Courses.findOne({_id: req.query.id}, function (err, course) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, course);
	                }
	            });
	        }else{
	            Courses.find({$query:{}, $orderby: {orderNumber: 1}}).deepPopulate('listChapters listChapters.listSubChapters listChapters.listSubChapters.listSlides').exec(function (err, courses) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, courses);
	                }
	            });
	        }
	    })
	    .post(function (req, res) {
	        var name = req.body.name;
	        var content = req.body.content;
	        if(!name || !content){
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                content = JSON.parse(content);
	                var toAdd = new courses({
	                    name: name,
	                    content: content,
	                    last_updated: Date.now()
	                });
	                toAdd.save(function (err, saved) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        handleSuccess(res, saved);
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .put(function (req, res) {
	        var id = req.query.id;
	        var data = req.body;
	        if(!id || !data.content) {
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                data.content = JSON.parse(data.content);
	                data.last_updated = Date.now();
	                courses.update({_id: req.query.id}, {$set: data}, function (err, wres) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        courses.findOne({_id: req.query.id}, function (err, course) {
	                            if(err){
	                                handleError(res, err);
	                            }else{
	                                handleSuccess(res, course);
	                            }
	                        });
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .delete(function (req, res) {
	        var idToDelete = ObjectId(req.query.id);
	        if(idToDelete){
	            courses.remove({_id: idToDelete}, function (err, wRes) {
	                if(err){
	                    handleError(res, err);
	                }else if(wRes == 0){
	                    handleError(res, null, 404, 51);
	                }else{
	                    handleSuccess(res);
	                }
	            });
	        }else{
	            handleError(res, null, 400, 6);
	        }
	    });

	router.route('/admin/elearning/chapters')
	    .get(function (req, res) {
	        if(req.query.id){
	            Chapters.findOne({_id: req.query.id}, function (err, chapter) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, chapter);
	                }
	            });
	        }else{
	            Chapters.find({}, function (err, chapters) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, chapters);
	                }
	            });
	        }
	    })
	    .post(function (req, res) {
	        var name = req.body.name;
	        var content = req.body.content;
	        if(!name || !content){
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                content = JSON.parse(content);
	                var toAdd = new courses({
	                    name: name,
	                    content: content,
	                    last_updated: Date.now()
	                });
	                toAdd.save(function (err, saved) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        handleSuccess(res, saved);
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .put(function (req, res) {
	        var id = req.query.id;
	        var data = req.body;
	        if(!id || !data.content) {
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                data.content = JSON.parse(data.content);
	                data.last_updated = Date.now();
	                courses.update({_id: req.query.id}, {$set: data}, function (err, wres) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        courses.findOne({_id: req.query.id}, function (err, course) {
	                            if(err){
	                                handleError(res, err);
	                            }else{
	                                handleSuccess(res, course);
	                            }
	                        });
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .delete(function (req, res) {
	        var idToDelete = ObjectId(req.query.id);
	        if(idToDelete){
	            courses.remove({_id: idToDelete}, function (err, wRes) {
	                if(err){
	                    handleError(res, err);
	                }else if(wRes == 0){
	                    handleError(res, null, 404, 51);
	                }else{
	                    handleSuccess(res);
	                }
	            });
	        }else{
	            handleError(res, null, 400, 6);
	        }
	    });


	router.route('/admin/elearning/subchapters')
	    .get(function (req, res) {
	        if(req.query.id){
	            Subchapters.findOne({_id: req.query.id}, function (err, course) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, course);
	                }
	            });
	        }else{
	            Subchapters.find({}, function (err, courses) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, courses);
	                }
	            });
	        }
	    })
	    .post(function (req, res) {
	        var name = req.body.name;
	        var content = req.body.content;
	        if(!name || !content){
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                content = JSON.parse(content);
	                var toAdd = new courses({
	                    name: name,
	                    content: content,
	                    last_updated: Date.now()
	                });
	                toAdd.save(function (err, saved) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        handleSuccess(res, saved);
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .put(function (req, res) {
	        var id = req.query.id;
	        var data = req.body;
	        if(!id || !data.content) {
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                data.content = JSON.parse(data.content);
	                data.last_updated = Date.now();
	                courses.update({_id: req.query.id}, {$set: data}, function (err, wres) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        courses.findOne({_id: req.query.id}, function (err, course) {
	                            if(err){
	                                handleError(res, err);
	                            }else{
	                                handleSuccess(res, course);
	                            }
	                        });
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .delete(function (req, res) {
	        var idToDelete = ObjectId(req.query.id);
	        if(idToDelete){
	            courses.remove({_id: idToDelete}, function (err, wRes) {
	                if(err){
	                    handleError(res, err);
	                }else if(wRes == 0){
	                    handleError(res, null, 404, 51);
	                }else{
	                    handleSuccess(res);
	                }
	            });
	        }else{
	            handleError(res, null, 400, 6);
	        }
	    });

	router.route('/admin/elearning/slides')
	    .get(function (req, res) {
	        if(req.query.id){
	            Courses.findOne({_id: req.query.id}, function (err, course) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, course);
	                }
	            });
	        }else{
	            Courses.find({}, function (err, courses) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, courses);
	                }
	            });
	        }
	    })
	    .post(function (req, res) {
	        var name = req.body.name;
	        var content = req.body.content;
	        if(!name || !content){
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                content = JSON.parse(content);
	                var toAdd = new courses({
	                    name: name,
	                    content: content,
	                    last_updated: Date.now()
	                });
	                toAdd.save(function (err, saved) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        handleSuccess(res, saved);
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .put(function (req, res) {
	        var id = req.query.id;
	        var data = req.body;
	        if(!id || !data.content) {
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                data.content = JSON.parse(data.content);
	                data.last_updated = Date.now();
	                courses.update({_id: req.query.id}, {$set: data}, function (err, wres) {
	                    if(err){
	                        handleError(res, err);
	                    }else{
	                        courses.findOne({_id: req.query.id}, function (err, course) {
	                            if(err){
	                                handleError(res, err);
	                            }else{
	                                handleSuccess(res, course);
	                            }
	                        });
	                    }
	                });
	            }catch(ex){
	                handleError(res, ex);
	            }
	        }
	    })
	    .delete(function (req, res) {
	        var idToDelete = ObjectId(req.query.id);
	        if(idToDelete){
	            courses.remove({_id: idToDelete}, function (err, wRes) {
	                if(err){
	                    handleError(res, err);
	                }else if(wRes == 0){
	                    handleError(res, null, 404, 51);
	                }else{
	                    handleSuccess(res);
	                }
	            });
	        }else{
	            handleError(res, null, 400, 6);
	        }
	    });

	router.route('/elearning/courses')
	    .get(function (req, res) {
	    	if(req.query.id){
	    		Courses.findOne({_id: req.query.id}).deepPopulate("listChapters.listSubchapters.listSlides").exec(function (err, course) {
	    		    if(err){
	    		        handleError(res, err);
	    		    }else if(!course){
	    		    	handleError(res, false, 404, 1);
	    		    }else{
						var objectToSend = {};
						objectToSend.courseDetails = course;
						objectToSend.slideViews = req.user.elearning.slide;
						handleSuccess(res, objectToSend);
	    		    }
	    		});
	    	}else{
	    		Courses.find({groupsID: {$in: req.user.groupsID}}).sort({"order": 1}).exec(function(err, courses){
	    			if(err){
	    				handleError(res, err);
	    			}else{
	    				handleSuccess(res, courses);
	    			}
	    		});
	    	}
	    });

	router.route('/elearning/slides')
		.get(function(req, res){
			if(!req.query.id){
				handleError(res, false, 400, 6);
			}else{
				var slideViews = getSlideViews(req.user, req.query.id);
				Slides.findOne({_id: req.query.id}).exec(function(err, slide){
					if(err){
						handleError(res, err);
					}else if(!slide){
						handleError(res, false, 404, 1);
					}else if(slide.type === "test"){
						if(typeof slide.retake === "number" && slideViews >= slide.retake){
							return handleError(res, false, 403, 42);
						}else{
							Slides.deepPopulate(slide, "questions.answers", function(err, slide){
								if(err){
									handleError(res, err);
								}else{
									handleSuccess(res, slide);
									userViewedSlide(slide._id, req.user);
								}
							});
						}
					}else{
						handleSuccess(res, slide);
						userViewedSlide(slide._id, req.user);
					}
				});
			}
		})
		.post(function(req, res){
			//this route is for validating a user's test
			if(!req.query.id){
				return handleError(res, false, 400, 6);
			}else{
				var slideViews = getSlideViews(req.user, req.query.id);
				Slides.findOne({_id: req.query.id, type: "test"}, function(err, slide){
					if(err){
						return handleError(res, err);
					}else if(!slide){
						return handleError(res, false, 404, 1);
					}else if(typeof slide.retake === 0 && slideViews > slide.retake){
						return handleError(res, false, 403, 42);
					}else{
						//first we need to get a total of the answered questions and a total of all questions in parallel
						//the request body will look like:
						//{
						//	id_question1: [id_anwers],
						//	id_question2: [id_anwers]
						//}
						Q.all([
							getQuestionsMaxPoints(slide.questions),
							getUserPoints(req.body)
						]).then(
							function(results){
								var totalScore = results[0];
								var userScore = results[1];
								var normalisedScore = Math.round(userScore*env.elearning.maxScore/totalScore);
								// console.log(totalScore);
								// console.log(userScore);
								// console.log(normalisedScore);
								// 
								// finally, record score on user
								var updateQuery = {$set: {}};
								var upd = "elearning.slide."+slide._id+".score";
								updateQuery.$set[upd] = normalisedScore;
								console.log(updateQuery);
								Users.update({_id: req.user._id}, updateQuery, function(err){
									if(err){
										handleError(res, err);
									}else{
										handleSuccess(res, normalisedScore);
									}
								})
							},
							function(err){
								handleError(res, err);
							}
						);
					}
				});
			}
		});

		function getUserPoints(qaMap){
			var deferred = Q.defer();
			var userPoints = 0;
			//the qaMap will look like:
			//{
			//	id_question1: [id_anwers],
			//	id_question2: [id_anwers]
			//}
			//the async will iterate through each question and calculate the score
			async.forEachOf(qaMap,
				function calculateQuestionScore(answersIds, questionId, callback){
					Questions.findOne({_id: questionId}).exec(function(err, question){
						if(err){
							callback(err);
						}else if(!question){
							callback();
						}else{
							//find all the answers for the current question that are also
							//marked by the user
							Answers.find({$and: [{_id: {$in: question.answers}}, {_id: {$in: answersIds}}]}).select("+ratio").exec(function(err, answers){
								if(err){
									callback(err);
								}else{
									var score = 0;
									//calculate the score by adding the ratios
									for(var i=0; i<answers.length; i++){
										if(typeof  answers[i].ratio === "number") {score += answers[i].ratio;}
									}
									if(score > 0) userPoints += score;
									callback();
								}
							});
						}
					});
				},
				function doneCalculatingScore(err){
					if(err){
						deferred.reject(err);
					}else{
						//calculate total score
						deferred.resolve(userPoints);
					}
			});
			return deferred.promise;
		};

		function getQuestionsMaxPoints(questionsIds){
			var deferred = Q.defer();
			getAnswersIds(questionsIds).then(
				function(answersIds){
					Answers.aggregate([
					    {$match: {_id: {$in: answersIds}, ratio: {$gt: 0}}},
					    {$group: {_id: null, sum: {$sum: "$ratio"}}}
					], function(err, result){
						if(err){
							deferred.reject(err);
						}else if(!result[0]){
							deferred.reject("No result");
						}else{
							deferred.resolve(result[0].sum);
						}
					});
				},
				function(err){
					deferred.reject(err);
				}
			);
			return deferred.promise;
		}

		function getAnswersIds(questionsIds){
			var deferred = Q.defer();
			Questions.distinct("answers", {_id: {$in: questionsIds}}, function(err, answers){
				if(err){
					deferred.reject(err);
				}else{
					deferred.resolve(answers);
				}
			});
			return deferred.promise;
		}

		function getSlideViews(user, slide_id){
			try{
				return user.elearning.slide[slide_id].views;
			}catch(ex){
				//this probably happens when trying to acccess a property of undefined
				//so we can assume that the user hasn't viewed the slide yet
				return 0;
			}
		}

		function userViewedSlide(slide_id, user){
			if(slide_id && user){
				slide_id = slide_id.toString();
				Users.findOne({_id: user._id}, function(err, user){
					if(!err && user){
						markSlideViewed(slide_id, user);
					}
				});
			}
		};

		function markSlideViewed(slide_id, user){
			var updateQuery = {$inc: {}};
			var upd = "elearning.slide."+slide_id+".views";
			updateQuery.$inc[upd] = 1;
			//console.log(updateQuery);
			Users.findAndModify({_id: user._id}, {}, updateQuery, {upsert: false}, function(err, user){
				if(err) console.log(err);
			});
		}
}