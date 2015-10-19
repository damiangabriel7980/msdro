var Subchapters = require('../../models/elearning/subchapters');
var Slides = require('../../models/elearning/slides');
var Questions = require('../../models/elearning/questions');
var Answers = require('../../models/elearning/answers');
var Users = require('../../models/user');
var ContentVerifier = require('../../modules/contentVerifier');

var async = require('async');
var Q = require('q');

function getSlide(id, previous, next){
	// this handles the slide query
	// if previous or next is specified, the previous or next slide relative to the id will be retrieved
	// if the slide cannot not be found, the reject will be called with no params
	var deferred = Q.defer();
	ContentVerifier.getContentById(Slides,id,null,false,'enabled','').then(
			function(success){
				if(previous || next){
						Subchapters.findOne({listSlides: {$in: [id]}}, function(err, subchapter){
							if(err){
								deferred.reject(err);
							}else if(!subchapter){
								deferred.reject();
							}else{
								var cursor;
								if(next){
									cursor = Slides.find({_id: {$in: subchapter.listSlides}, order: {$gt: slide.order}}).sort({order: 1}).limit(1);
								}else{
									cursor = Slides.find({_id: {$in: subchapter.listSlides}, order: {$lt: slide.order}}).sort({order:-1}).limit(1);
								}
								cursor.exec(function(err, slides){
									if(err){
										deferred.reject(err);
									}else if(!slides[0]){
										deferred.reject();
									}else{
										deferred.resolve(slides[0]);
									}
								});
							}
						});
					}else{
						deferred.resolve(success);
					}
			},function(err){
				deferred.reject(err);
			}
	);
	return deferred.promise;
};

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

module.exports = {
	getSlide: getSlide,
	getUserPoints: getUserPoints,
	getQuestionsMaxPoints: getQuestionsMaxPoints,
	getSlideViews: getSlideViews,
	userViewedSlide: userViewedSlide
};