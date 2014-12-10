/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var Events = require('./models/events');
var Conferences = require('./models/conferences');
var Talks = require('./models/talks');
var Speakers = require('./models/speakers');


module.exports = function(app, router) {

    router.route('/speakers')
        .get(function(req,res){
            Speakers.find().populate('listTalks').exec(function (err, speakers) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(speakers);
                    return;
                }
        })
        });
    router.route('/speakers/:id')
        .get(function(req,res){
            Speakers.find({_id:req.params.id}).populate('listTalks').exec(function (err, speaker) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(speaker);
                    return;
                }
            })
        });
    router.route('/conferences')
        .get(function(req,res){
            Conferences.find().populate('listTalks').exec(function (err, talks) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(talks);
                    return;
                }
            })
        });

    router.route('/events')
        .get(function(req,res){
            Events.find().populate('listconferences').exec(function (err, conferences) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(conferences);
                    return;
                }
            })
        });
    router.route('/talks')
        .get(function(req,res){
            Talks.find().populate('listSpeakers').exec(function (err, conferences) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(conferences);
                    return;
                }


            })

        });
    app.use('/apiConferences', router);
};