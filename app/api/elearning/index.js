var Courses = require('../../models/elearning/courses');
var Chapters = require('../../models/elearning/chapters');
var Subchapters = require('../../models/elearning/subchapters');
var Slides = require('../../models/elearning/slides');
var Questions = require('../../models/elearning/questions');
var Answers = require('../../models/elearning/answers');
var Users = require('../../models/user');

var Q = require('q');

var ElearningService = require('./elearning.service.js');

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

	router.route('/elearning/subchapters')
		.get(function(req, res){
			if(!req.query.id){
				return handleError(res, false, 400, 6);
			}else{
				Subchapters.findOne({_id: req.query.id}).populate({path: 'listSlides', options: { sort: {order: 1}}}).exec(function(err, subchapter){
					if(err){
						return handleError(res, err);
					}else if(!subchapter){
						return handleError(res, err);
					}else{
						return handleSuccess(res, subchapter);
					}
				});
			}
		});

	router.route('/elearning/slides')
		.get(function(req, res){
			if(!req.query.id){
				handleError(res, false, 400, 6);
			}else{
				ElearningService.getSlide(req.query.id, req.query.previous, req.query.next).then(
					function(slide){
						var slideViews = ElearningService.getSlideViews(req.user, slide._id);
						if(slide.type === "test"){
							if(typeof slide.retake === "number" && slideViews >= slide.retake){
								return handleError(res, false, 403, 42);
							}else{
								Slides.deepPopulate(slide, "questions.answers", function(err, slide){
									if(err){
										handleError(res, err);
									}else{
										handleSuccess(res, slide);
									}
								});
							}
						}else{
							handleSuccess(res, slide);
							ElearningService.userViewedSlide(slide._id, req.user);
						}
					},
					function(err){
						if(err){
							handleError(res, err);
						}else{
							handleError(res, false, 404, 1);
						}
					}
				);
			}
		})
		.post(function(req, res){
			//this route is for validating a user's test
			if(!req.query.id){
				return handleError(res, false, 400, 6);
			}else{
				var slideViews = ElearningService.getSlideViews(req.user, req.query.id);
				Slides.findOne({_id: req.query.id, type: "test"}, function(err, slide){
					if(err){
						return handleError(res, err);
					}else if(!slide){
						return handleError(res, false, 404, 1);
					}else if(typeof slide.retake === "number" && slideViews >= slide.retake){
						return handleError(res, false, 403, 42);
					}else{
						//first we need to get a total of the answered questions and a total of all questions in parallel
						//the request body will look like:
						//{
						//	id_question1: [id_anwers],
						//	id_question2: [id_anwers]
						//}
						Q.all([
							ElearningService.getQuestionsMaxPoints(slide.questions),
							ElearningService.getUserPoints(req.body)
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
								//console.log(updateQuery);
								Users.update({_id: req.user._id}, updateQuery, function(err){
									if(err){
										handleError(res, err);
									}else{
										handleSuccess(res, normalisedScore);
										ElearningService.userViewedSlide(slide._id, req.user);
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

		
}