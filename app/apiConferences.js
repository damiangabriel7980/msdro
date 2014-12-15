/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');
var Events = require('./models/events');
var Conferences = require('./models/conferences');
var Talks = require('./models/talks');
var Speakers = require('./models/speakers');
var Rooms = require('./models/rooms');
var jwt = require('jsonwebtoken');

module.exports = function(app,email, router) {

    //access control allow origin *
    app.all("/apiConferences/*", function(req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Credentials", false);
        res.setHeader("Access-Control-Max-Age", '86400'); // 24 hours
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization");
        next();
    });

    router.route('/userProfile')
        .get(function (req, res) {
            var token = req.headers.authorization.split(' ').pop();
            res.json(jwt.decode(token));
        });

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
            Speakers.findById(req.params.id).populate('listTalks').exec(function (err, speaker) {
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
            Conferences.find().populate('listTalks').exec(function (err, conferences) {
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
    router.route('/conferences/:id')
        .get(function(req,res){
            Conferences.findById(req.params.id).populate('listTalks').exec(function (err, conference) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(conference);
                    return;
                }
            })
        });

    router.route('/events')
        .get(function(req,res){
            Events.find().populate('listconferences').exec(function (err, events) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(events);
                    return;
                }
            })
        });
    router.route('/events/:id')
        .get(function(req,res) {
            Events.findById(req.params.id).populate('listconferences').exec(function (err, event) {
                if (err) {
                    res.json(err);
                    return;
                }
                else {
                   res.json(event);
                    return;
                }

            })
        });
    router.route('/talks')
        .get(function(req,res){
            Talks.find().populate('listSpeakers listRooms').exec(function (err, talks) {
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
    router.route('/talks/:id')
        .get(function(req,res){
            Talks.findById(req.params.id).populate('listSpeakers listRooms').exec(function (err, talk) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(talk);
                    return;
                }


            })

        });
    router.route('/rooms')
        .get(function(req,res){
            Rooms.find().populate('id_talks').exec(function (err, rooms) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(rooms);
                    return;
                }


            })

        });
    router.route('/rooms/:id')
        .get(function(req,res){
            Rooms.findById(req.params.id).populate('id_talks').exec(function (err, room) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(room);
                    return;
                }


            })

        });
    app.use('/apiConferences', router);
};