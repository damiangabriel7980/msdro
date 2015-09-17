var Courses = require('../../models/elearning/courses');
var Chapters = require('../../models/elearning/chapters');
var Subchapters = require('../../models/elearning/subchapters');
var Slides = require('../../models/elearning/slides');
var Questions = require('../../models/elearning/questions');
var Answers = require('../../models/elearning/answers');

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

	router.route('/elearning/slides')
		.get(function(req, res){
			if(!req.query.id){
				handleError(res, false, 400, 6);
			}else{
				Slides.findOne({_id: req.query.id}).exec(function(err, slide){
					if(err){
						handleError(res, err);
					}else if(!slide){
						handleError(res, false, 404, 1);
					}else if(slide.type === "test"){
							Slides.deepPopulate(slide, "questions.answers", function(err, slide){
								if(err){
									handleError(res, err);
								}else{
									handleSuccess(res, slide);
								}
							});
					}else{
						handleSuccess(res, slide);
					}
				});
			}
		});
}