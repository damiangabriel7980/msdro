var Courses = require('../../models/elearning/courses');
var Chapters = require('../../models/elearning/chapters');
var Subchapters = require('../../models/elearning/subchapters');
var Slides = require('../../models/elearning/slides');
var Questions = require('../../models/elearning/questions');
var Answers = require('../../models/elearning/answers');
var Users = require('../../models/user');

var Q = require('q');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');

var ElearningService = require('./elearning.service.js');

module.exports = function(env, logger, amazon, router){

	var handleSuccess = require('../../modules/responseHandler/success.js')(logger);
    var handleError = require('../../modules/responseHandler/error.js')(logger);
	var ContentVerifier = require('../../modules/contentVerifier');

	router.route('/admin/elearning/updateIndex')
	/**
	 * @apiName Update_Courses_Indexes
	 * @apiDescription Update courses indexes - use only one at a time of the parameters in the list below
	 * @apiGroup Elearning_API
	 * @api {put} /api/admin/elearning/updateIndex Update courses indexes
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {Array} courseMap An array of courses
	 * @apiParam {Array} chapterMap An array of chapters
	 * @apiParam {Array} subChaptersMap An array of sub-chapters
	 * @apiParam {Array} slidesMap An array of slides
	 * @apiParam {Array} questionsMap An array of questions
	 * @apiExample {curl} Example usage:
	 *     curl -i -x POST -d '{courseMap: [{id: '', order: ''}]}' http://localhost:8080/api/admin/elearning/updateIndex
	 * @apiSuccess {Object} response.success an empty object
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 * @apiUse BadRequest
	 * @apiErrorExample {json} Error-Response (4xx):
	 *     HTTP/1.1 4xx 4xx Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
			.put(function (req, res) {
				if(req.body.courseMap){
					var mapping = req.body.courseMap;
					async.each(mapping,function(item,callback){
						Courses.update({_id: item.id}, {$set:{order: item.order}}, function (err, wRes) {
							if (err) {
								callback(err);
							} else {
								callback();
							}
						});
					},function(err){
						if(err){
							handleError(res,err,409,5);
						}
						else
						{
							handleSuccess(res);
						}
					});
				}else if(req.body.chapterMap){
					var mapping = req.body.chapterMap;
					async.each(mapping,function(item,callback){
						Chapters.update({_id: item.id}, {$set:{order: item.order}}, function (err, wRes) {
							if (err) {
								callback(err);
							} else {
								callback();
							}
						});
					},function(err){
						if(err){
							handleError(res,err,409,5);
						}
						else
						{
							handleSuccess(res);
						}
					});
				} else if(req.body.subChaptersMap){
					var mapping = req.body.subChaptersMap;
					async.each(mapping,function(item,callback){
						Subchapters.update({_id: item.id}, {$set:{order: item.order}}, function (err, wRes) {
							if (err) {
								callback(err);
							} else {
								callback();
							}
						});
					},function(err){
						if(err){
							handleError(res,err,409,5);
						}
						else
						{
							handleSuccess(res);
						}
					});
				} else if(req.body.slidesMap){
					var mapping = req.body.slidesMap;
					async.each(mapping,function(item,callback){
						Slides.update({_id: item.id}, {$set:{order: item.order}}, function (err, wRes) {
							if (err) {
								callback(err);
							} else {
								callback();
							}
						});
					},function(err){
						if(err){
							handleError(res,err,409,5);
						}
						else
						{
							handleSuccess(res);
						}
					});
				} else if(req.body.questionsMap){
					var mapping = req.body.questionsMap;
					async.each(mapping,function(item,callback){
						Questions.update({_id: item.id}, {$set:{order: item.order}}, function (err, wRes) {
							if (err) {
								callback(err);
							} else {
								callback();
							}
						});
					},function(err){
						if(err){
							handleError(res,err,409,5);
						}
						else
						{
							handleSuccess(res);
						}
					});
				} else
					handleError(res, null, 400, 6);
			});

	router.route('/admin/elearning/courses')
	/**
	 * @apiName Get_Elearning_Courses
	 * @apiDescription Retrieve a list of elearning courses / a single course
	 * @apiGroup Elearning_API
	 * @api {get} /api/admin/elearning/courses Retrieve a list of elearning courses / a single course
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {String} [id] the id of a course
	 * @apiExample {curl} Example usage:
	 *     curl -i http://localhost:8080/api/admin/elearning/courses?id=wdnan828dnwdwoogr
	 * @apiSuccess {Object} response.success a single course / an array of courses
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
	 * @apiSuccessExample {json} Success-Response (with id):
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
	    .get(function (req, res) {
	        if(req.query.id){
	            Courses.findOne({_id: req.query.id}).populate('groupsID').exec(function (err, course) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, course);
	                }
	            });
	        }else{
	            Courses.find({$query:{}, $orderby: {order: 1}}).deepPopulate("listChapters.listSubchapters.listSlides").exec(function (err, courses) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, courses);
	                }
	            });
	        }
	    })
		/**
		 * @apiName Create_Elearning_Course
		 * @apiDescription Create an elearning course
		 * @apiGroup Elearning_API
		 * @api {post} /api/admin/elearning/courses Create an elearning course
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {Object} course a course object
		 * @apiExample {curl} Example usage:
		 *     curl -i -x POST -d '{course : {}}' http://localhost:8080/api/admin/elearning/courses
		 * @apiSuccess {Object} response.success the newly created course
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 *        success : {
     	 *
     	 *        },
     	 *        message : "A message"
     	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .post(function (req, res) {
	        if(!req.body.course){
	            handleError(res, null, 400, 6);
	        }else{
	            try{
	                var toAdd = new Courses(req.body.course);
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
			/**
			 * @apiName Update_Elearning_Course
			 * @apiDescription Update an elearning course
			 * @apiGroup Elearning_API
			 * @api {put} /api/admin/elearning/courses Update an elearning course
			 * @apiVersion 1.0.0
			 * @apiPermission devModeAdmin
			 * @apiParam {Object} course a course object
			 * @apiParam {String} imagePath the file path to the course image
			 * @apiParam {Object} status if we want to enable/disable a course (contains the property isEnabled which holds the new
			 * status of the course
			 * @apiExample {curl} Example usage:
			 *     curl -i -x PUT -d '{course : {}, imagePath: null, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/courses?id=dnwadnwan8284y854nfg
			 * @apiSuccess {Object} response.success an empty object / an object confirming if the course was updated
			 * @apiSuccess {String} response.message A message
			 * @apiSuccessExample {json} Success-Response:
			 *     HTTP/1.1 200 OK
			 *     {
     	 	 *        success : {
     	 	 *           updated: 1 //optional
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
			 * @apiUse ErrorOnServer
			 * @apiErrorExample {json} Error-Response (500):
			 *     HTTP/1.1 500 Server Error
			 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
			 */
			if(req.body.imagePath){
				var info = req.body.imagePath;
					Courses.update({_id: req.query.id}, {$set:{image_path: info}}, function (err, wRes) {
						if (err) {
							handleError(res,err,500);
						} else {
							handleSuccess(res, {updated: wRes}, 3);
						}
					});
			}else if(req.body.status){
				Courses.findOne({_id: req.query.id}).deepPopulate("listChapters.listSubchapters.listSlides").exec(function (err, course) {
					if(err){
						handleError(res, err);
					}else{
						async.each(course.listChapters,function(chapter,callback1){
							async.each(chapter.listSubchapters,function(subchapter,callback2){
								async.each(subchapter.listSlides,function(slide,callback3){
									Slides.update({_id: slide._id},{$set:{enabled: req.body.status.isEnabled}}).exec(function (err, wRes) {
										if(err){
											callback3(err);
										}else{
											callback3();
										}
									});
								},function(err){
									if(err){
										handleError(res,err);
									}
									else
									{
										Subchapters.update({_id: subchapter._id},{$set:{enabled: req.body.status.isEnabled}}).exec(function (err, wRes) {
											if(err){
												callback2(err);
											}else{
												callback2();
											}
										});
									}
								});
							},function(err){
								if(err){
									handleError(res,err);
								}
								else
								{
									Chapters.update({_id: chapter._id},{$set:{enabled: req.body.status.isEnabled}}).exec(function (err, wRes) {
										if(err){
											callback1(err);
										}else{
											callback1();
										}
									});
								}
							});
						},function(err){
							if(err){
								handleError(res,err);
							}
							else
							{
								Courses.update({_id: req.query.id}, {$set:{enabled: req.body.status.isEnabled}}, function (err, wRes) {
									if (err) {
										handleError(res,err,500);
									} else {
										handleSuccess(res, {updated: wRes}, 3);
									}
								});
							}
						});
					}
				});
			}
			else{
				var data = req.body.course;
				data.last_updated = new Date();
				Courses.update({_id:req.query.id},{$set:data}, function(err, course) {
					if (err){
						console.log(err);
						handleError(res,err,500);
					}else{
						handleSuccess(res, {}, 3);
					}
				});
			}
	    })
		/**
		 * @apiName Delete_Elearning_Course
		 * @apiDescription Delete an elearning course
		 * @apiGroup Elearning_API
		 * @api {delete} /api/admin/elearning/courses Delete an elearning course
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {String} id the id of the course
		 * @apiExample {curl} Example usage:
		 *     curl -i -x DELETE http://localhost:8080/api/admin/elearning/courses?id=dnwadnwan8284y854nfg
		 * @apiSuccess {Object} response.success an empty object
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .delete(function (req, res) {
	        var idToDelete = ObjectId(req.query.id);
	        if(idToDelete){
				//first we must delete the slides, then the subchapters, chapters and finally the course
				Courses.findOne({_id: idToDelete}).deepPopulate("listChapters.listSubchapters.listSlides.questions.answers").exec(function (err, course) {
					if(err){
						handleError(res, err);
					}else{
						async.each(course.listChapters,function(chapter,callback1){
							async.each(chapter.listSubchapters,function(subchapter,callback2){
								async.each(subchapter.listSlides,function(slide,callback3){
									async.each(slide.questions,function(question,callback4){
										Answers.remove({_id: {$in: question.answers}}).exec(function(err,resp){
											if(err){
												callback4(err);
											}else{
												callback4();
											}
										})
									},function(err){
										if(err){
											handleError(res,err);
										}
										else
										{
											Questions.remove({_id: {$in: slide.questions}}).exec(function(err,resp){
												if(err){
													callback3(err);
												}else{
													callback3();
												}
											})
										}
									});
								},function(err){
									if(err){
										handleError(res,err);
									}
									else
									{
										Slides.remove({_id: {$in: subchapter.listSlides}}).exec(function(err,resp){
											if(err){
												callback2(err);
											}else{
												callback2();
											}
										})
									}
								});
							},function(err){
								if(err){
									handleError(res,err);
								}
								else
								{
									Subchapters.remove({_id: {$in: chapter.listSubchapters}}).exec(function(err,resp){
										if(err){
											callback1(err);
										}else{
											callback1();
										}
									})
								}
							});
						},function(err){
							if(err){
								handleError(res,err);
							}
							else
							{
								Chapters.remove({_id: {$in: course.listChapters}}).exec(function(err,resp){
									if(err){
										handleError(res,err);
									}else{
										Courses.remove({_id: idToDelete}, function (err, wRes) {
										    if(err){
										        handleError(res, err);
										    }else if(wRes == 0){
										        handleError(res, null, 404, 51);
										    }else{
										        handleSuccess(res);
										    }
										});
									}
								})
							}
						});
					}
				});
	        }else{
	            handleError(res, null, 400, 6);
	        }
	    });

	router.route('/admin/elearning/chapters')
	/**
	 * @apiName Get_Elearning_Chapters
	 * @apiDescription Retrieve a list of elearning chapters / a single chapter
	 * @apiGroup Elearning_API
	 * @api {get} /api/admin/elearning/chapters Retrieve a list of elearning chapters / a single chapter
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {String} [id] the id of a chapter
	 * @apiExample {curl} Example usage:
	 *     curl -i   http://localhost:8080/api/admin/elearning/chapters?id=wdnan828dnwdwoogr
	 * @apiSuccess {Object} response.success a single chapter / an array of chapters
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
	 * @apiSuccessExample {json} Success-Response (with id):
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
	    .get(function (req, res) {
	        if(req.query.id){
	            Chapters.findOne({_id: req.query.id}).exec(function (err, chapter) {
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
		/**
		 * @apiName Create_Elearning_Chapter
		 * @apiDescription Create an elearning chapter
		 * @apiGroup Elearning_API
		 * @api {post} /api/admin/elearning/chapters Create an elearning chapter
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {Object} chapter a chapter object
		 * @apiParam {String} courseId id of course to associate to
		 * @apiExample {curl} Example usage:
		 *     curl -i -x POST   -d '{chapter : {}, courseId: ''}' http://localhost:8080/api/admin/elearning/chapters
		 * @apiSuccess {Object} response.success the newly created chapter
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 *        success : {
     	 *
     	 *        },
     	 *        message : "A message"
     	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .post(function (req, res) {
			if(!req.body.chapter){
				handleError(res, null, 400, 6);
			}else{
				try{
					var toAdd = new Chapters(req.body.chapter);
					toAdd.save(function (err, saved) {
						if(err){
							handleError(res, err);
						}else{
							Courses.update({_id: req.body.courseId}, {$addToSet: {listChapters: saved._id}}, function (err, wres) {
								if(err){
									handleError(res,err,500);
								}else{
									handleSuccess(res, saved);
								}
							});
						}
					});
				}catch(ex){
					handleError(res, ex);
				}
			}
	    })
		/**
		 * @apiName Update_Elearning_Chapter
		 * @apiDescription Update an elearning chapter
		 * @apiGroup Elearning_API
		 * @api {put} /api/admin/elearning/chapters Update an elearning chapter
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {Object} chapter a chapter object
		 * @apiParam {Object} status if we want to enable/disable a chapter (contains the property isEnabled which holds the new
		 * status of the chapter
		 * @apiExample {curl} Example usage:
		 *     curl -i -x PUT   -d '{chapter : {}, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/chapters?id=dnwadnwan8284y854nfg
		 * @apiSuccess {Object} response.success an empty object
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
		 */
	    .put(function (req, res) {
			if(req.body.status){
				Chapters.update({_id: req.query.id},{$set:{enabled: req.body.status.isEnabled}}).exec(function (err, wRes) {
					if(err){
						handleError(res,err,500);
					}else{
						handleSuccess(res);
					}
				});
			}
			else {
				var data = req.body.chapter;
				data.last_updated = new Date();
				Chapters.update({_id: req.query.id}, {$set: data}, function (err, course) {
					if (err) {
						handleError(res, err, 500);
					} else {
						handleSuccess(res, {}, 3);
					}
				});
			}
	    })
		/**
		 * @apiName Delete_Elearning_Chapter
		 * @apiDescription Delete an elearning chapter
		 * @apiGroup Elearning_API
		 * @api {delete} /api/admin/elearning/chapters Delete an elearning chapter
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {String} id the id of the chapter
		 * @apiExample {curl} Example usage:
		 *     curl -i -x DELETE   http://localhost:8080/api/admin/elearning/chapters?id=dnwadnwan8284y854nfg
		 * @apiSuccess {Object} response.success an empty object
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .delete(function (req, res) {
			var idToDelete = ObjectId(req.query.id);
			if(idToDelete){
				//first we must delete the slides, then the subchapters, chapters and finally the course
				Chapters.findOne({_id: idToDelete}).deepPopulate("listSubchapters.listSlides.questions.answers").exec(function (err, chapter) {
					if(err){
						handleError(res, err);
					}else{
						async.each(chapter.listSubchapters,function(subchapter,callback2){
								async.each(subchapter.listSlides,function(slide,callback3){
									async.each(slide.questions,function(question,callback4){
										Answers.remove({_id: {$in: question.answers}}).exec(function(err,resp){
											if(err){
												callback4(err);
											}else{
												callback4();
											}
										})
									},function(err){
										if(err){
											handleError(res,err);
										}
										else
										{
											Questions.remove({_id: {$in: slide.questions}}).exec(function(err,resp){
												if(err){
													callback3(err);
												}else{
													callback3();
												}
											})
										}
									});
								},function(err){
									if(err){
										handleError(res,err);
									}
									else
									{
										Slides.remove({_id: {$in: subchapter.listSlides}}).exec(function(err,resp){
											if(err){
												callback2(err);
											}else{
												callback2();
											}
										})
									}
								});
							},function(err){
								if(err){
									handleError(res,err);
								}
								else
								{
									Subchapters.remove({_id: {$in: chapter.listSubchapters}}).exec(function(err,resp){
										if(err){
											handleError(res,err);
										}else{
											Courses.update({}, {$pull: {listChapters: idToDelete}}, {multi: true}).exec(function (err, wres) {
												if(err){
													handleError(res, err);
												}else{
													Chapters.remove({_id: idToDelete}, function (err, wRes) {
														if(err){
															handleError(res, err);
														}else if(wRes == 0){
															handleError(res, null, 404, 51);
														}else{
															handleSuccess(res);
														}
													});
												}
											});
										}
									})

								}
							});
					}
				});
			}else{
				handleError(res, null, 400, 6);
			}
	    });


	router.route('/admin/elearning/subchapters')
	/**
	 * @apiName Get_Elearning_Subchapters
	 * @apiDescription Retrieve a list of elearning subchapters / a single subchapter
	 * @apiGroup Elearning_API
	 * @api {get} /api/admin/elearning/subchapters Retrieve a list of elearning subchapters / a single subchapter
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {String} [id] the id of a subchapter
	 * @apiExample {curl} Example usage:
	 *     curl -i   http://localhost:8080/api/admin/elearning/subchapters?id=wdnan828dnwdwoogr
	 * @apiSuccess {Object} response.success a single subchapter / an array of subchapters
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
	 * @apiSuccessExample {json} Success-Response (with id):
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
	    .get(function (req, res) {
	        if(req.query.id){
	            Subchapters.findOne({_id: req.query.id}).exec(function (err, course) {
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
		/**
		 * @apiName Create_Elearning_SubChapter
		 * @apiDescription Create an elearning subchapter
		 * @apiGroup Elearning_API
		 * @api {post} /api/admin/elearning/subchapters Create an elearning subchapter
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {Object} subchapter a subchapter object
		 * @apiParam {String} chapterId id of chapter to associate to
		 * @apiExample {curl} Example usage:
		 *     curl -i -x POST   -d '{subchapter : {}, chapterId: ''}' http://localhost:8080/api/admin/elearning/subchapters
		 * @apiSuccess {Object} response.success the newly created subchapter
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 *        success : {
     	 *
     	 *        },
     	 *        message : "A message"
     	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .post(function (req, res) {
			if(!req.body.subChapter){
				handleError(res, null, 400, 6);
			}else{
				try{
					var toAdd = new Subchapters(req.body.subChapter);
					toAdd.save(function (err, saved) {
						if(err){
							handleError(res, err);
						}else{
							Chapters.update({_id: req.body.chapterId}, {$addToSet: {listSubchapters: saved._id}}, function (err, wres) {
								if(err){
									handleError(res,err,500);
								}else{
									handleSuccess(res, saved);
								}
							});
						}
					});
				}catch(ex){
					handleError(res, ex);
				}
			}
	    })
		/**
		 * @apiName Update_Elearning_SubChapter
		 * @apiDescription Update an elearning subchapter
		 * @apiGroup Elearning_API
		 * @api {put} /api/admin/elearning/subchapters Update an elearning subchapter
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {Object} subchapter a subchapter object
		 * @apiParam {Object} status if we want to enable/disable a subchapter (contains the property isEnabled which holds the new
		 * status of the subchapter
		 * @apiExample {curl} Example usage:
		 *     curl -i -x PUT   -d '{subchapter : {}, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/subchapters?id=dnwadnwan8284y854nfg
		 * @apiSuccess {Object} response.success an empty object
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
		 */
	    .put(function (req, res) {
			if(req.body.status){
				Subchapters.update({_id: req.query.id},{$set:{enabled: req.body.status.isEnabled}}).exec(function (err, wRes) {
					if(err){
						handleError(res,err,500);
					}else{
						handleSuccess(res);
					}
				});
			}
			else {
				var data = req.body.subChapter;
				data.last_updated = new Date();
				Subchapters.update({_id: req.query.id}, {$set: data}, function (err, course) {
					if (err) {
						handleError(res, err, 500);
					} else {
						handleSuccess(res, {}, 3);
					}
				});
			}
	    })
		/**
		 * @apiName Delete_Elearning_SubChapter
		 * @apiDescription Delete an elearning subchapter
		 * @apiGroup Elearning_API
		 * @api {delete} /api/admin/elearning/subchapters Delete an elearning subchapter
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {String} id the id of the subchapter
		 * @apiExample {curl} Example usage:
		 *     curl -i -x DELETE   http://localhost:8080/api/admin/elearning/subchapters?id=dnwadnwan8284y854nfg
		 * @apiSuccess {Object} response.success an empty object
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .delete(function (req, res) {
			var idToDelete = ObjectId(req.query.id);
			if(idToDelete){
				//first we must delete the slides, then the subchapters, chapters and finally the course
				Subchapters.findOne({_id: idToDelete}).deepPopulate("listSlides.questions.answers").exec(function (err, subchapter) {
					if(err){
						handleError(res, err);
					}else{
							async.each(subchapter.listSlides,function(slide,callback3){
								async.each(slide.questions,function(question,callback4){
									Answers.remove({_id: {$in: question.answers}}).exec(function(err,resp){
										if(err){
											callback4(err);
										}else{
											callback4();
										}
									})
								},function(err){
									if(err){
										handleError(res,err);
									}
									else
									{
										Questions.remove({_id: {$in: slide.questions}}).exec(function(err,resp){
											if(err){
												callback3(err);
											}else{
												callback3();
											}
										})
									}
								});
							},function(err){
								if(err){
									handleError(res,err);
								}
								else
								{
									Slides.remove({_id: {$in: subchapter.listSlides}}).exec(function(err,resp){
										if(err){
											handleError(res,err);
										}else{
											Chapters.update({}, {$pull: {listSubchapters: idToDelete}}, {multi: true}).exec(function (err, wres) {
												if(err){
													handleError(res, err);
												}else{
													Subchapters.remove({_id: idToDelete}, function (err, wRes) {
														if(err){
															handleError(res, err);
														}else if(wRes == 0){
															handleError(res, null, 404, 51);
														}else{
															handleSuccess(res);
														}
													});
												}
											});
										}
									})
								}
							});
					}
				});
			}else{
				handleError(res, null, 400, 6);
			}
	    });

	router.route('/admin/elearning/slides')
	/**
	 * @apiName Get_Elearning_Slides
	 * @apiDescription Retrieve a list of elearning slides / a single slide
	 * @apiGroup Elearning_API
	 * @api {get} /api/admin/elearning/slides Retrieve a list of elearning slides / a single slide
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {String} [id] the id of a slide
	 * @apiExample {curl} Example usage:
	 *     curl -i   http://localhost:8080/api/admin/elearning/slides?id=wdnan828dnwdwoogr
	 * @apiSuccess {Object} response.success a single slide / an array of slides
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
	 * @apiSuccessExample {json} Success-Response (with id):
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
	    .get(function (req, res) {
	        if(req.query.id){
	            Slides.findOne({_id: req.query.id}).deepPopulate('questions.answers',{
					whitelist: ['questions.answers'],
					populate : {
						'questions.answers' : {
							options: {
								sort: {
									"order": 1
								},
								select: 'ratio text',
							}
						}
					}
				}).exec(function (err, course) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, course);
	                }
	            });
	        }else{
	            Slides.find({}, function (err, courses) {
	                if(err){
	                    handleError(res, err);
	                }else{
	                    handleSuccess(res, courses);
	                }
	            });
	        }
	    })
		/**
		 * @apiName Create_Elearning_Slide
		 * @apiDescription Create an elearning slide
		 * @apiGroup Elearning_API
		 * @api {post} /api/admin/elearning/slides Create an elearning slide
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {Object} subchapter a slide object
		 * @apiParam {String} id id of subchapter to associate to
		 * @apiExample {curl} Example usage:
		 *     curl -i -x POST   -d '{slide : {}, id: ''}' http://localhost:8080/api/admin/elearning/slides
		 * @apiSuccess {Object} response.success the newly created slide
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 *        success : {
     	 *
     	 *        },
     	 *        message : "A message"
     	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .post(function (req, res) {
			if(!req.body.slide){
				handleError(res, null, 400, 6);
			}else{
				try{
					var toAdd = new Slides(req.body.slide);
					toAdd.save(function (err, saved) {
						if(err){
							handleError(res, err);
						}else{
							Subchapters.update({_id: req.body.id}, {$addToSet: {listSlides: saved._id}}, function (err, wres) {
								if(err){
									handleError(res,err,500);
								}else{
									handleSuccess(res, saved);
								}
							});
						}
					});
				}catch(ex){
					handleError(res, ex);
				}
			}
	    })
		/**
		 * @apiName Update_Elearning_Slide
		 * @apiDescription Update an elearning slide
		 * @apiGroup Elearning_API
		 * @api {put} /api/admin/elearning/slides Update an elearning slide
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {Object} slide a slide object
		 * @apiParam {Boolean} isSlide if the slide is a presentation or a questionnaire
		 * @apiParam {Object} status if we want to enable/disable a slide (contains the property isEnabled which holds the new
		 * status of the slide
		 * @apiExample {curl} Example usage:
		 *     curl -i -x PUT   -d '{slide : {}, status: {isEnabled: false}}' http://localhost:8080/api/admin/elearning/slides?id=dnwadnwan8284y854nfg
		 * @apiSuccess {Object} response.success an empty object
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
		 */
	    .put(function (req, res) {
			var data = req.body.slide;
			if(req.body.status){
				Slides.update({_id: req.query.id},{$set:{enabled: req.body.status.isEnabled}}).exec(function (err, wRes) {
					if(err){
						handleError(res,err,500);
					}else{
						handleSuccess(res);
					}
				});
			}
			else if(req.body.isSlide){
				data.last_updated = new Date();
				Slides.update({_id:req.query.id},{$set:data}, function(err, course) {
					if (err){
						handleError(res,err,500);
					}else{
						handleSuccess(res, {}, 3);
					}
				});
			}else{
				var questionsIds = [];
				async.each(data.questions,function(question,callback3){
					var answerIds = [];
					async.each(question.answers,function(answer,callback4){
						Answers.update({_id: answer._id},{$set: answer}, function(err, ans) {
							if (err){
								callback4(err);
							}else{
								answerIds.push(answer._id);
								callback4();
							}
						});
					},function(err){
						if(err){
							handleError(res,err);
						}
						else
						{
							question.answers = answerIds;
							Questions.update({_id: question._id},{$set: question}, function(err, quest) {
								if (err){
									callback3(err);
								}else{
									questionsIds.push(question._id);
									callback3();
								}
							});
						}
					});
				},function(err){
					if(err){
						handleError(res,err);
					}
					else
					{
						data.questions = questionsIds;
						Slides.update({_id:data._id},{$set:data}, function(err, slide) {
							if (err){
								handleError(res,err,500);
							}else{
								handleSuccess(res, {}, 3);
							}
						});
					}
				});
			}

	    })
		/**
		 * @apiName Delete_Elearning_Slide
		 * @apiDescription Delete an elearning slide
		 * @apiGroup Elearning_API
		 * @api {delete} /api/admin/elearning/slides Delete an elearning slide
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {String} id the id of the slide
		 * @apiExample {curl} Example usage:
		 *     curl -i -x DELETE   http://localhost:8080/api/admin/elearning/slides?id=dnwadnwan8284y854nfg
		 * @apiSuccess {Object} response.success an empty object
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response:
		 *     HTTP/1.1 200 OK
		 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
		 * @apiUse BadRequest
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
		 */
	    .delete(function (req, res) {
	        var idToDelete = ObjectId(req.query.id);
	        if(idToDelete){
				Slides.findOne({_id: idToDelete}).deepPopulate("questions.answers").exec(function (err, slide) {
					if(err){
						handleError(res, err);
					}else{
						async.each(slide.questions,function(question,callback3){
							async.each(question.answers,function(answer,callback4){
								Answers.remove({_id: {$in: question.answers}}).exec(function(err,resp){
									if(err){
										callback4(err);
									}else{
										callback4();
									}
								})
							},function(err){
								if(err){
									handleError(res,err);
								}
								else
								{
									Questions.remove({_id: {$in: slide.questions}}).exec(function(err,resp){
										if(err){
											callback3(err);
										}else{
											callback3();
										}
									})
								}
							});
						},function(err){
							if(err){
								handleError(res,err);
							}
							else
							{
										Subchapters.update({}, {$pull: {listSlides: idToDelete}}, {multi: true}).exec(function (err, wres) {
											if(err){
												handleError(res, err);
											}else{
												Slides.remove({_id: idToDelete}, function (err, wRes) {
													if(err){
														handleError(res, err);
													}else if(wRes == 0){
														handleError(res, null, 404, 51);
													}else{
														handleSuccess(res);
													}
												});
											}
										});

							}
						});
					}
				});
	        }else{
	            handleError(res, null, 400, 6);
	        }
	    });


	router.route('/admin/elearning/questions')
	/**
	 * @apiName Create_Elearning_Question
	 * @apiDescription Create an elearning question
	 * @apiGroup Elearning_API
	 * @api {post} /api/admin/elearning/questions Create an elearning question
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {Object} question a question object
	 * @apiParam {String} id id of slide to associate to
	 * @apiExample {curl} Example usage:
	 *     curl -i -x POST   -d '{question : {}, id: ''}' http://localhost:8080/api/admin/elearning/questions
	 * @apiSuccess {Object} response.success a property containing the status of the update process
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     	 *        success : {
     	 *			1 // or 0 if not updated
     	 *        },
     	 *        message : "A message"
     	 *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
	 * @apiUse BadRequest
	 * @apiErrorExample {json} Error-Response (4xx):
	 *     HTTP/1.1 400 BadRequest Error
	 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
	 */
			.post(function (req, res) {
				if(!req.body.question){
					handleError(res, null, 400, 6);
				}else{
					try{
						var toAdd = req.body.question;
						var answersIds = [];
						async.each(toAdd.answers,function(answer,callback4){
							var answerToAdd = new Answers(answer);
							answerToAdd.save(function (err, saved) {
								if(err){
									callback4(err);
								}else{
									answersIds.push(saved._id);
									callback4();
								}
							});
						},function(err){
							if(err){
								handleError(res,err);
							}
							else
							{
								toAdd.answers = answersIds;
								toAdd = new Questions(toAdd);
								toAdd.save(function (err, saved2) {
									if(err){
										handleError(res, err);
									}else{
										Slides.update({_id: req.body.id}, {$addToSet: {questions: saved2._id}}, function (err, wres) {
											if(err){
												handleError(res,err,500);
											}else{
												Questions.findOne({_id: saved2._id}).deepPopulate('answers',{
													whitelist: ['answers'],
													populate : {
														'answers' : {
															options: {
																sort: {
																	"order": 1
																},
																select: 'ratio text',
															}
														}
													}
												}).exec(function(err, response){
													if(err){
														handleError(res,err);
													}
													else
														handleSuccess(res, response);
												})
											}
										});
									}
								});
							}
						});
					}catch(ex){
						handleError(res, ex);
					}
				}
			})
			/**
			 * @apiName Update_Elearning_Question
			 * @apiDescription Update an elearning question
			 * @apiGroup Elearning_API
			 * @api {put} /api/admin/elearning/questions Update an elearning question
			 * @apiVersion 1.0.0
			 * @apiPermission devModeAdmin
			 * @apiParam {Object} question a question object
			 * @apiExample {curl} Example usage:
			 *     curl -i -x PUT   -d '{question : {}}' http://localhost:8080/api/admin/elearning/questions?id=dnwadnwan8284y854nfg
			 * @apiSuccess {Object} response.success an empty object
			 * @apiSuccess {String} response.message A message
			 * @apiSuccessExample {json} Success-Response:
			 *     HTTP/1.1 200 OK
			 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
			 * @apiUse ErrorOnServer
			 * @apiErrorExample {json} Error-Response (500):
			 *     HTTP/1.1 500 Server Error
			 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
			 */
			.put(function (req, res) {
				var data = req.body.question;
				Questions.update({_id:req.query.id},{$set:data}, function(err, quest) {
					if (err){
						handleError(res,err,500);
					}else{
						handleSuccess(res, {}, 3);
					}
				});
			})
			/**
			 * @apiName Delete_Elearning_Question
			 * @apiDescription Delete an elearning question
			 * @apiGroup Elearning_API
			 * @api {delete} /api/admin/elearning/questions Delete an elearning question
			 * @apiVersion 1.0.0
			 * @apiPermission devModeAdmin
			 * @apiParam {String} id the id of the question
			 * @apiExample {curl} Example usage:
			 *     curl -i -x DELETE   http://localhost:8080/api/admin/elearning/questions?id=dnwadnwan8284y854nfg
			 * @apiSuccess {Object} response.success an empty object
			 * @apiSuccess {String} response.message A message
			 * @apiSuccessExample {json} Success-Response:
			 *     HTTP/1.1 200 OK
			 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
			 * @apiUse ErrorOnServer
			 * @apiErrorExample {json} Error-Response (500):
			 *     HTTP/1.1 500 Server Error
			 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
			 * @apiUse BadRequest
			 * @apiErrorExample {json} Error-Response (4xx):
			 *     HTTP/1.1 400 BadRequest Error
			 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
			 */
			.delete(function (req, res) {
				var idToDelete = ObjectId(req.query.id);
				if(idToDelete){
					Questions.findOne({_id: idToDelete}).exec(function (err, question) {
						if(err){
							handleError(res, err);
						}else{
							Answers.remove({_id: {$in: question.answers}}).exec(function(err,resp){
								if(err){
									handleError(res, err);
								}else{
									Slides.update({}, {$pull: {questions: idToDelete}}, {multi: true}).exec(function (err, wres) {
										if(err){
											handleError(res, err);
										}else{
											Questions.remove({_id: idToDelete}, function (err, wRes) {
												if(err){
													handleError(res, err);
												}else if(wRes == 0){
													handleError(res, null, 404, 51);
												}else{
													handleSuccess(res);
												}
											});
										}
									});
								}
							})
						}
					});

				}else{
					handleError(res, null, 400, 6);
				}
			});

	router.route('/admin/elearning/answers')
	/**
	 * @apiName Create_Elearning_Answer
	 * @apiDescription Create an elearning answer
	 * @apiGroup Elearning_API
	 * @api {post} /api/admin/elearning/answers Create an elearning answer
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {Object} answer a answer object
	 * @apiParam {String} id id of question to associate to
	 * @apiExample {curl} Example usage:
	 *     curl -i -x POST   -d '{answer : {}, id: ''}' http://localhost:8080/api/admin/elearning/answers
	 * @apiSuccess {Object} response.success the newly created answer
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     	 *        success : {
     	 *
     	 *        },
     	 *        message : "A message"
     	 *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
	 * @apiUse BadRequest
	 * @apiErrorExample {json} Error-Response (4xx):
	 *     HTTP/1.1 400 BadRequest Error
	 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
	 */
			.post(function (req, res) {
				if(!req.body.answer){
					handleError(res, null, 400, 6);
				}else{
					try{
						var toAdd = new Answers(req.body.answer);
						toAdd.save(function (err, saved) {
							if(err){
								handleError(res, err);
							}else{
								Questions.update({_id: req.body.id}, {$addToSet: {answers: saved._id}}, function (err, wres) {
									if(err){
										handleError(res,err,500);
									}else{
										handleSuccess(res, saved);
									}
								});
							}
						});
					}catch(ex){
						handleError(res, ex);
					}
				}
			})
			/**
			 * @apiName Update_Elearning_Answer
			 * @apiDescription Update an elearning answer
			 * @apiGroup Elearning_API
			 * @api {put} /api/admin/elearning/answers Update an elearning answer
			 * @apiVersion 1.0.0
			 * @apiPermission devModeAdmin
			 * @apiParam {Object} answer a answer object
			 * @apiExample {curl} Example usage:
			 *     curl -i -x PUT   -d '{answer : {}}' http://localhost:8080/api/admin/elearning/answers?id=dnwadnwan8284y854nfg
			 * @apiSuccess {Object} response.success an empty object
			 * @apiSuccess {String} response.message A message
			 * @apiSuccessExample {json} Success-Response:
			 *     HTTP/1.1 200 OK
			 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
			 * @apiUse ErrorOnServer
			 * @apiErrorExample {json} Error-Response (500):
			 *     HTTP/1.1 500 Server Error
			 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
			 */
			.put(function (req, res) {
				var data = req.body.answer;
				Answers.update({_id:req.query.id},{$set:data}, function(err, course) {
					if (err){
						handleError(res,err,500);
					}else{
						handleSuccess(res, {}, 3);
					}
				});
			})
			/**
			 * @apiName Delete_Elearning_Answer
			 * @apiDescription Delete an elearning answer
			 * @apiGroup Elearning_API
			 * @api {delete} /api/admin/elearning/answers Delete an elearning answer
			 * @apiVersion 1.0.0
			 * @apiPermission devModeAdmin
			 * @apiParam {String} id the id of the answer
			 * @apiExample {curl} Example usage:
			 *     curl -i -x DELETE   http://localhost:8080/api/admin/elearning/answers?id=dnwadnwan8284y854nfg
			 * @apiSuccess {Object} response.success an empty object
			 * @apiSuccess {String} response.message A message
			 * @apiSuccessExample {json} Success-Response:
			 *     HTTP/1.1 200 OK
			 *     {
     	 	 *        success : {
     	 	 *
     	 	 *        },
     	 	 *        message : "A message"
     	 	 *     }
			 * @apiUse ErrorOnServer
			 * @apiErrorExample {json} Error-Response (500):
			 *     HTTP/1.1 500 Server Error
			 *     {
     	 	 *          error: "",
     	 	 *          data: {}
     	 	 *     }
			 * @apiUse BadRequest
			 * @apiErrorExample {json} Error-Response (4xx):
			 *     HTTP/1.1 400 BadRequest Error
			 *     {
     	 *          error: "",
     	 *          data: {}
     	 *     }
			 */
			.delete(function (req, res) {
				var idToDelete = ObjectId(req.query.id);
				if(idToDelete){
					Questions.update({}, {$pull: {answers: idToDelete}}, {multi: true}).exec(function (err, wres) {
										if(err){
											handleError(res, err);
										}else{
											Answers.remove({_id: idToDelete}, function (err, wRes) {
												if(err){
													handleError(res, err);
												}else if(wRes == 0){
													handleError(res, null, 404, 51);
												}else{
													handleSuccess(res);
												}
											});
										}
									});
				}else{
					handleError(res, null, 400, 6);
				}
			});

	router.route('/elearning/courses')
	/**
	 * @apiName Get_Elearning_Courses_For_Medic
	 * @apiDescription Retrieve a list of elearning courses / a single course (for medic section)
	 * @apiGroup Elearning_API
	 * @api {get} /api/elearning/courses Retrieve a list of elearning courses / a single course (for medic section)
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {String} [id] the id of a course
	 * @apiExample {curl} Example usage:
	 *     curl -i   http://localhost:8080/api/elearning/courses?id=wdnan828dnwdwoogr
	 * @apiSuccess {Object} response.success a single course / an array of courses
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response:
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : [{
     *
     *        }],
     *        message : "A message"
     *     }
	 * @apiSuccessExample {json} Success-Response (with id):
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
	    .get(function (req, res) {
	    	if(req.query.id){
				ContentVerifier.getContentById(Courses,req.query.id,false,false,'enabled','','groupsID',true).then(
						function(success){
							var objectToSend = {};
							objectToSend.courseDetails = success;
							objectToSend.slideViews = req.user.elearning.slide;
							handleSuccess(res, objectToSend);
						},function(err){
							if (err.status == 404)
								var message = 45;
							else
								var message = 46;
							handleError(res,null,err.status, message);
						}
				);
	    	}else{
	    		Courses.find({enabled: true}).sort({"order": 1}).exec(function(err, courses){
	    			if(err){
	    				handleError(res, err);
	    			}else{
	    				handleSuccess(res, courses);
	    			}
	    		});
	    	}
	    });

	router.route('/elearning/subchapters')
	/**
	 * @apiName Get_Elearning_Subchapter_For_Medic
	 * @apiDescription Retrieve a single subchapter (for medic section)
	 * @apiGroup Elearning_API
	 * @api {get} /api/elearning/subchapters Retrieve a single subchapter (for medic section)
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {String} id the id of a subchapter
	 * @apiExample {curl} Example usage:
	 *     curl -i   http://localhost:8080/api/elearning/subchapters?id=wdnan828dnwdwoogr
	 * @apiSuccess {Object} response.success a single subchapter
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response :
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 * @apiErrorExample {json} Error-Response (4xx):
	 *     HTTP/1.1 400 BadRequest Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
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
	/**
	 * @apiName Get_Elearning_Slide_For_Medic
	 * @apiDescription Retrieve a single slide (for medic section)
	 * @apiGroup Elearning_API
	 * @api {get} /api/elearning/slides Retrieve a single slide (for medic section)
	 * @apiVersion 1.0.0
	 * @apiPermission devModeAdmin
	 * @apiParam {Array} id the id of a slide
	 * @apiExample {curl} Example usage:
	 *     curl -i   http://localhost:8080/api/elearning/slides?id=wdnan828dnwdwoogr
	 * @apiSuccess {Object} response.success a single slide
	 * @apiSuccess {String} response.message A message
	 * @apiSuccessExample {json} Success-Response :
	 *     HTTP/1.1 200 OK
	 *     {
     *        success : {
     *
     *        },
     *        message : "A message"
     *     }
	 * @apiUse ErrorOnServer
	 * @apiErrorExample {json} Error-Response (500):
	 *     HTTP/1.1 500 Server Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 * @apiErrorExample {json} Error-Response (4xx):
	 *     HTTP/1.1 400 BadRequest Error
	 *     {
     *          error: "",
     *          data: {}
     *     }
	 */
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
		/**
		 * @apiName Post_Elearning_TestSlide_Answers
		 * @apiDescription Post the answers of a test slide (for medic section)
		 * @apiGroup Elearning_API
		 * @api {post} /api/elearning/slides Post the answers of a test slide (for medic section)
		 * @apiVersion 1.0.0
		 * @apiPermission devModeAdmin
		 * @apiParam {String} id the id of a slide
		 * @apiParam {Object} qaMap an object mapping the question and the user's answer
		 * @apiExample {curl} Example usage:
		 *     curl -i -x POST   -d '{qid : aid}' http://localhost:8080/api/elearning/slides?id=wdnan828dnwdwoogr
		 * @apiSuccess {Object} response.success an object containing the score
		 * @apiSuccess {String} response.message A message
		 * @apiSuccessExample {json} Success-Response :
		 *     HTTP/1.1 200 OK
		 *     {
     *        success : {
     *			21
     *        },
     *        message : "A message"
     *     }
		 * @apiUse ErrorOnServer
		 * @apiErrorExample {json} Error-Response (500):
		 *     HTTP/1.1 500 Server Error
		 *     {
     *          error: "",
     *          data: {}
     *     }
		 * @apiErrorExample {json} Error-Response (4xx):
		 *     HTTP/1.1 400 BadRequest Error
		 *     {
     *          error: "",
     *          data: {}
     *     }
		 */
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
								var normalisedScore = Math.round(userScore*slide.maximum/totalScore);
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