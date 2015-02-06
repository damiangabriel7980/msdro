var Content     = require('./models/articles');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var Events = require('./models/events');
var Counties = require('./models/counties');
var Cities = require('./models/cities');
var Multimedia = require('./models/multimedia');
var User = require('./models/user');
var Job = require('./models/jobs');
var Quizes=require('./models/quizes');
var Questions=require('./models/questions');
var Answers = require('./models/answers');
var Slides = require('./models/slides');
var Roles=require('./models/roles');
var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');
var Carousel=require('./models/carousel_Medic');
var Conferences = require('./models/conferences');
var Talks = require('./models/talks');
var Speakers = require('./models/speakers');
var Rooms = require('./models/rooms');
var Topics = require('./models/qa_topics');
var AnswerGivers = require('./models/qa_answerGivers');
var Threads = require('./models/qa_threads');
var qaMessages = require('./models/qa_messages');
var Professions = require('./models/professions');

var XRegExp  = require('xregexp').XRegExp;
var SHA256   = require('crypto-js/sha256');
var ObjectId = require('mongoose').Types.ObjectId;
var mongoose = require('mongoose');
var async = require('async');
var request = require('request');
var AWS = require('aws-sdk');
var fs = require('fs');

//form sts object from environment variables. Used for retrieving temporary credentials to front end
var sts = new AWS.STS();
//configure credentials for use on server only; assign credentials based on role (never use master credentials)
AWS.config.credentials = new AWS.EnvironmentCredentials('AWS');
AWS.config.credentials = new AWS.TemporaryCredentials({
    RoleArn: 'arn:aws:iam::578381890239:role/msdAdmin'
});
//s3 object for use on server
var s3 = new AWS.S3();
//bucket retrieved from environment variables
var amazonBucket = process.env.amazonBucket;

//used to sign cookies based on session secret
var cookieSig = require('express-session/node_modules/cookie-signature');

//================================================================================================= amazon s3 functions
// Used for retrieving temporary credentials to front end
var getS3Credentials = function(RoleSessionName, callback){
    sts.assumeRole({
        RoleArn: 'arn:aws:iam::578381890239:role/msdAdmin',
        RoleSessionName: RoleSessionName,
        DurationSeconds: 900
    }, function (err, data) {
        if(err){
            callback(err, null);
        }else{
            callback(null, data);
        }
    });
};

//function for deleting object from amazon
var deleteObjectS3 = function (key, callback) {
    s3.deleteObject({Bucket: amazonBucket, Key: key}, function (err, data) {
        callback(err, data);
    });
};

var addObjectS3 = function(key,body,callback){
    var bodyNew = new Buffer(body,'base64');
    s3.upload({Bucket: amazonBucket,Key: key, Body:bodyNew, ACL:'public-read'}, function (err, data2) {
        callback(err, data2);
    });

};

//================================================================================== useful db administration functions

//returns ONLY id's of entities connected to specified document in array
var findConnectedEntitiesIds = function(connected_to_entity, connection_name, connected_to_id, callback){
    var qry = {};
    qry[connection_name] = {$in: [connected_to_id]};
    connected_to_entity.find(qry, function (err, documents) {
        if(err){
            callback("Error finding connecting entities", null);
        }else{
            var ret = [];
            for(var i=0; i<documents.length; i++){
                ret.push(documents[i]._id);
            }
            callback(false, ret);
        }
    });
};

//returns entities connected to specified document
var findConnectedEntities = function(connected_to_entity, connection_name, connected_to_id, callback){
    var qry = {};
    qry[connection_name] = {$in: [connected_to_id]};
    connected_to_entity.find(qry, function (err, documents) {
        if(err){
            callback("Error finding connecting entities", null);
        }else{
            callback(false, documents);
        }
    });
};

//returns entities connected to specified document,
//but only returns the attributes specified in projection
var findConnectedEntitiesWithProjection = function(connected_to_entity, connection_name, connected_to_id, projection, callback){
    var qry = {};
    qry[connection_name] = {$in: [connected_to_id]};
    connected_to_entity.find(qry, projection, function (err, documents) {
        if(err){
            callback("Error finding connecting entities", null);
        }else{
            callback(false, documents);
        }
    });
};

var connectEntitiesToEntity = function (connecting_array_of_ids, connectedEntity, connection_name, id_document_to_connect_to, callback) {
    //convert string id's to ObjectId's
    var format_connecting_array = [];
    for(var i=0; i<connecting_array_of_ids.length; i++){
        if(typeof connecting_array_of_ids[i] === "string"){
            format_connecting_array.push(mongoose.Types.ObjectId(connecting_array_of_ids[i]));
        }else{
            format_connecting_array.push(connecting_array_of_ids[i]);
        }
    }
    //insert only strings in connections array
    if(typeof id_document_to_connect_to !== "string") id_document_to_connect_to = id_document_to_connect_to.toString();
    //use $addToSet to avoid inserting duplicates
    var upd = {};
    upd[connection_name] = id_document_to_connect_to;
    connectedEntity.update({_id:{$in: format_connecting_array}}, {$addToSet: upd}, {multi: true}, function (err, res) {
        callback(err, res);
    });
};

var disconnectEntitiesFromEntity = function (array_of_ids_to_disconnect, connectedEntity, connection_name, id_document_to_disconnect_from, callback) {
    //convert string id's to ObjectId's
    var format_connecting_array = [];
    for(var i=0; i<array_of_ids_to_disconnect.length; i++){
        if(typeof array_of_ids_to_disconnect[i] === "string"){
            format_connecting_array.push(mongoose.Types.ObjectId(array_of_ids_to_disconnect[i]));
        }else{
            format_connecting_array.push(array_of_ids_to_disconnect[i]);
        }
    }
    //insert only strings in connections array
    if(typeof id_document_to_disconnect_from !== "string") id_document_to_disconnect_from = id_document_to_disconnect_from.toString();
    //use $addToSet to avoid inserting duplicates
    var upd = {};
    upd[connection_name] = id_document_to_disconnect_from;
    connectedEntity.update({_id:{$in: format_connecting_array}}, {$pull: upd}, {multi: true}, function (err, res) {
        callback(err, res);
    });
};

var disconnectAllEntitiesFromEntity = function (connectedEntity, connection_name, id_document_to_disconnect_from, callback) {
    findConnectedEntitiesIds(connectedEntity, connection_name, id_document_to_disconnect_from, function (err, array_of_ids) {
        if(err){
            callback("Error finding connected entities", null);
        }else{
            disconnectEntitiesFromEntity(array_of_ids, connectedEntity, connection_name, id_document_to_disconnect_from, function (err, success) {
                if(err){
                    callback("Error at disconnecting entities", null);
                }else{
                    callback(null, "Entities disconnected: "+success);
                }
            });
        }
    });
};

//=========================================================================================== functions for user groups

var getNonSpecificUserGroupsIds = function(user, callback){
    //find all group ids with non-specific content for user
    UserGroup.find({_id: {$in: user.groupsID}, content_specific: {$ne: true}}, {_id:1}, function (err, groups) {
        if(err){
            callback(err, null);
        }else{
            //now make an array of those id's
            var arr = [];
            for(var i=0; i<groups.length; i++){
                arr.push(groups[i]._id.toString());
            }
            callback(null, arr);
        }
    });
};

//get content for all non content_specific groups plus one content_specific group
//if specific content group is null, get non specific content only
//tip: content_type can be injected; ex: {$in: [1,3]}
var getUserContent = function (user, content_type, specific_content_group_id, limit, sortDescendingByAttribute, callback) {
    //first get non specific content groups only
    getNonSpecificUserGroupsIds(user, function(err, arrayOfGroupsIds){
        if(err){
            callback(err, null);
        }else{
            //if we have specific content group id, add it to our array
            if(specific_content_group_id) arrayOfGroupsIds.push(specific_content_group_id.toString());
            //now get user content for our array of groups
            var myCursor = Content.find({groupsID: {$in: arrayOfGroupsIds}, enable: {$ne: false}, type: content_type});
            if(sortDescendingByAttribute){
                var attr = {};
                attr[sortDescendingByAttribute] = -1;
                myCursor = myCursor.sort(attr);
            }
            if(limit) myCursor=myCursor.limit(limit);
            myCursor.exec(function (err, content) {
                if(err){
                    callback(err, null);
                }else{
                    //console.log(arrayOfGroupsIds);
                    callback(null, content);
                }
            });
        }
    });
};

//================================================================================ find id's of users associated to conferences, rooms, talks

//receives an array of documents and returns an array with only the id's of those documents
var getIds = function (arr, cb) {
    var ret = [];
    async.each(arr, function (item, callback) {
        if(item._id) ret.push(item._id);
        callback();
    }, function (err) {
        cb(ret);
    });
};
var getStringIds = function (arr, cb) {
    var ret = [];
    async.each(arr, function (item, callback) {
        if(item._id) ret.push(item._id.toString());
        callback();
    }, function (err) {
        cb(ret);
    });
};

// get user ids
// return array like ["MSD"+idAsString]
var encodeNotificationsIds = function (ids, cb) {
    var ret = [];
    async.each(ids, function (id, callback) {
        ret.push("MSD"+id.toString());
        callback();
    }, function (err) {
        cb(ret);
    });
};

//this can be used for rooms as well, since every room has an id_conference
var getUsersForConference = function (id_conference, callback) {
    User.find({conferencesID: {$in: [id_conference]}}, function (err, users) {
        if(err){
            callback(err, null);
        }else{
            getIds(users, function (ids) {
                callback(null, ids);
            });
        }
    });
};

var getUsersForRoom = function (id_room, callback) {
    //find conference for room
    Talks.findOne({room: id_room}, function (err, talk) {
        if(err){
            callback(err, null);
        }else{
            if(talk){
                getUsersForConference(talk.conference, function (err, ids) {
                    if(err){
                        callback(err, null);
                    }else{
                        callback(null, ids);
                    }
                });
            }else{
                callback({hasError: true, message: "No connecting room"});
            }
        }
    });
};

var getUsersForTalk = function (id_talk, callback) {
    //find talk
    Talks.findOne({_id: id_talk}, function (err, talk) {
        if(err){
            callback(err, null);
        }else{
            if(talk){
                getUsersForConference(talk.conference, function (err, ids) {
                    if(err){
                        callback(err, null);
                    }else{
                        callback(null, ids);
                    }
                });
            }else{
                callback({hasError: true, message: "No talk found"});
            }
        }
    });
};

var getUsersForConferences = function (conferences_ids, callback) {
    User.find({conferencesID: {$in: conferences_ids}}, function (err, users) {
        if(err){
            callback(err, null);
        }else{
            getIds(users, function (ids) {
                callback(null, ids);
            });
        }
    });
};

//======================================================================================================================================= routes for admin

module.exports = function(app, sessionSecret, email, logger, pushServerAddr, router) {

//======================================================================================================= secure routes

// middleware to ensure user is logged in
    function isLoggedIn(req, res, next) {
        console.log("check login");
        if (req.isAuthenticated()){
            return next();
        }else{
            res.status(403).end();
        }
    }

//middleware to ensure a user has admin rights
    function hasAdminRights(req, res, next) {
        console.log("check admin");
        try{
            //get encripted session id from cookie
            var esidc = req.cookies['connect.sid'];
            //get node session id from request
            var sid = req.sessionID;
            //encrypt sid using session secret
            var esid = "s:"+cookieSig.sign(sid, sessionSecret);
            //if esid matches esidc then user is authentic
            if(esid === esidc){
                //get session store info for this session
                var ssi = req.sessionStore.sessions[req.sessionID];
                ssi = JSON.parse(ssi);
                //now get user id
                var userID = ssi['passport']['user'];
                //now get user's roles
                User.find({_id: userID}, {rolesID :1}, function (err, data) {
                    if(err){
                        logger.error(err);
                        res.status(403).end();
                    }else{
                        var roles = data[0].rolesID;
                        //now get roles
                        Roles.find({_id: {$in: roles}}, function (err, data) {
                            if(err){
                                logger.error(err);
                                res.status(403).end();
                            }else{
                                var admin = false;
                                for(var i=0; i<data.length; i++){
                                    if(data[i].authority === "ROLE_ADMIN") admin=true;
                                }
                                if(admin === true){
                                    next();
                                }else{
                                    res.status(403).end();
                                }
                            }
                        });
                    }
                });
            }else{
                res.status(403).end();
            }
        }catch(e){
            logger.error(e);
            res.status(403).end();
        }

    }

//only logged in users can access a route
    app.all("/api/*", isLoggedIn, function(req, res, next) {
        next(); // if the middleware allowed us to get here,
        // just move on to the next route handler
    });

//only admin can access "/admin" routes
    app.all("/api/admin/*", hasAdminRights, function(req, res, next) {
        next(); // if the middleware allowed us to get here,
        // just move on to the next route handler
    });

//========================================== get temporary credentials for S3
    router.route('/admin/s3tc')

        .get(function (req, res) {
            getS3Credentials(req.user.username, function(err, data){
                if(err){
                    logger.error(err);
                    res.status(404).end();
                }else{
                    res.json(data);
                }
            });
        });
    router.route('/admin/indexContent')
        .get(function(req,res) {
            Products.search({
                query_string: {
                    query: "comerciala"
                }
            },{hydrate:true}, function(err, results) {
                if(err)
                    res.json(err);
                else
                    res.json(results);
            });
        });
    router.route('/user/addPhoto')
        .post(function(req,res){
            var data = req.body.data;
            var key = "user/"+req.user._id+"/img"+req.user._id+"."+data.extension;
            console.log(req.user.image_path);
            if(req.user.image_path.length!=0) {
                deleteObjectS3(req.user.image_path, function (err, resp1) {
                    if (err) {
                        console.log(err);
                        res.json({"type":"danger","message":"Fotografia nu a fost stearsa!"});

                    }
                    else {

                        User.findOne({_id: req.user._id}).exec(function (err, response) {
                            if (err) {
                                console.log(err);
                                res.json({"type":"danger","message":"Nu a fost gasit utilizatorul!"});
                            }
                            else {
                                console.log(req.user._id);
                              User.update({_id:req.user._id},{image_path: key },function (err, info) {
                                    if (err)
                                        res.json({"type":"danger","message":"Fotografia nu a fost salvata in baza de date!"});
                                    else {
                                        addObjectS3(key, data.Body, function (err, resp2) {
                                            if (err)
                                            {
                                                console.log(err);
                                                res.json({"type":"danger","message":"Fotografia nu a fost adaugata pe server!"});

                                            }
                                            else
                                                res.json({"type":"success","message": "Fotografia a fost actualizata cu succes!"})
                                        });
                                    }
                                })
                            }
                        })
                    }
                });
            }
            else
            {
                User.findOne({_id: req.user._id}).exec(function (err, response) {
                    if (err) {
                        console.log(err);
                        res.json({"type":"danger","message":"Nu a fost gasit utilizatorul!"});
                    }
                    else {
                        console.log(req.user._id);
                        User.update({_id:req.user._id},{ image_path: key },function (err, data2) {
                            console.log(data2);
                            console.log(err);
                            if (err)
                                res.json({"type":"danger","message":"Fotografia nu a fost salvata in baza de date!"});
                            else {
                                addObjectS3(key, data.Body, function (err, resp2) {
                                    if (err)
                                    {
                                        console.log(err);
                                        res.json({"type":"danger","message":"Fotografia nu a fost adaugata pe server!"});                                    }
                                    else
                                        res.json({"type":"success","message":"Fotografia a fost actualizata cu succes!"});
                                });
                            }
                        })
                    }
                });
            }
        });

//================================================================================================= send push notifications

    var sendPushNotification = function (message, arrayUsersIds, callback) {
        encodeNotificationsIds(arrayUsersIds, function (usersToSendTo) {
            var data = {
                "users": usersToSendTo,
                "android": {
                    "collapseKey": "optional",
                    "data": {
                        "message": message
                    }
                },
                "ios": {
                    "badge": 0,
                    "alert": message,
                    "sound": "soundName"
                }
            };

            request({
                url: pushServerAddr+"/send",
                method: 'POST',
                json: true,
                body: data,
                strictSSL: false
            }, function (error, message, response) {
                callback(error, response);
            });
        });
    };

    router.route('/admin/users/groups')

        .get(function(req, res) {
            UserGroup.find({}, {display_name: 1, description: 1, profession: 1}).populate('profession').exec(function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/professions')

        .get(function(req, res) {
            Professions.find({}, function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/groupDetails/:id')

        .get(function(req, res) {
            UserGroup.find({_id: req.params.id}).populate('profession').exec(function(err, cont) {
                if(err) {
                    res.send(err);
                }else{
                    if(cont[0]){
                        res.json(cont[0]);
                    }else{
                        res.json({error: true, message:"Nu s-a gasit grupul"});
                    }
                }
            });
        });

    router.route('/admin/users/users')

        .get(function(req, res) {
            User.find({}, {username: 1}).limit(0).exec(function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/usersFromGroup/:id')

        .get(function(req, res) {
            var id = req.params.id;
            User.find({groupsID: {$in:[id]}}, {username: 1}).limit(0).exec(function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/addGroup')
        //used for both creating new groups and editing existing ones

        .post(function (req, res) {
            var ans = {};
            var data = req.body.data;
            var namePatt = new XRegExp('^[a-zA-ZĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\s]{3,100}$');
            //check if name exists
            if(!data.group.display_name){
                ans.error = true;
                ans.message = "Numele este obligatoriu";
                res.json(ans);
            }else{
                //validate name
                if(!namePatt.test(data.group.display_name.toString())){
                    ans.error = true;
                    ans.message = "Numele trebuie sa aiba doar caractere, minim 3";
                    res.json(ans);
                }else{
                    //validate profession
                    var profession = (data.group.profession||"").toString();
                    if(profession.length == 24){
                        data.group.profession = mongoose.Types.ObjectId(profession);
                        //add group
                        new UserGroup(data.group).save(function (err, inserted) {
                            if(err){
                                logger.error(err);
                                ans.error = true;
                                ans.message = "Eroare la salvarea grupului. Va rugam verificati campurile";
                                res.json(ans);
                            }else{
                                var idGroupInserted = inserted._id.toString();
                                //update users to point to this group
                                //extract id's from users
                                var ids = [];
                                for(var i=0; i<data.users.length; i++){
                                    ids.push(data.users[i]._id);
                                }
                                connectEntitiesToEntity(ids, User, "groupsID", idGroupInserted, function (err, result) {
                                    if(err){
                                        logger.error(err);
                                        ans.error = true;
                                        ans.message = "Eroare la adaugarea userslor noi in grup.";
                                        res.json(ans);
                                    }else{
                                        ans.error = false;
                                        ans.message = "S-a salvat grupul. S-au adaugat "+result+" utlizatori";
                                        res.json(ans);
                                    }
                                })
                            }
                        });
                    }else{
                        ans.error = true;
                        ans.message = "Selectati o profesie";
                        res.json(ans);
                    }
                }
            }
        }

    );

    router.route('/admin/users/changeGroupLogo')
        .post(function (req,res) {
            var data = req.body.data;
            UserGroup.update({_id:data.id}, {image_path: data.path}, function (err, wRes) {
                if(err){
                    logger.error("Error at usergroup change logo. Group id = "+data.id+"; Key = "+data.path);
                    res.json({error:true});
                }else{
                    res.json({error:false, updated:wRes});
                }
            });
        });

    router.route('/admin/users/editGroup')
        //used for both creating new groups and editing existing ones

        .post(function (req, res) {
            var ans = {};
            var data = req.body.data;
            var namePatt = new XRegExp('^[a-zA-ZĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\s]{3,100}$');
            //check if name exists
            if(!data.group.display_name){
                ans.error = true;
                ans.message = "Numele este obligatoriu";
                res.json(ans);
            }else{
                //validate name
                if(!namePatt.test(data.group.display_name.toString())){
                    ans.error = true;
                    ans.message = "Numele trebuie sa aiba doar caractere, minim 3";
                    res.json(ans);
                }else{
                    //update group
                    UserGroup.update({_id: data.id}, data.group, function (err, Wres) {
                        if(err){
                            logger.error(err);
                            ans.error = true;
                            ans.message = "Eroare la salvarea grupului. Va rugam verificati campurile";
                            res.json(ans);
                        }else{
                            //now we need to add some users
                            //first disconnect preexisting users from group, just in case this is an editGroup operation
                            disconnectAllEntitiesFromEntity(User, "groupsID", data.id, function (err, result) {
                                if(err){
                                    logger.error(err);
                                    ans.error = true;
                                    ans.message = "Eroare la stergerea userslor vechi din grup.";
                                }else{
                                    //update users to point to this group
                                    //extract id's from users
                                    var ids = [];
                                    for(var i=0; i<data.users.length; i++){
                                        ids.push(data.users[i]._id);
                                    }
                                    connectEntitiesToEntity(ids, User, "groupsID", data.id, function (err, result) {
                                        if(err){
                                            logger.error(err);
                                            ans.error = true;
                                            ans.message = "Eroare la adaugarea userslor noi in grup.";
                                            res.json(ans);
                                        }else{
                                            ans.error = false;
                                            ans.message = "S-a salvat grupul. S-au adaugat "+result+" utlizatori";
                                            res.json(ans);
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            }
        });

    router.route('/admin/users/deleteGroup')

        .post(function (req, res) {
            var group_id = req.body.id;
            var logo;
            //find group logo to remove it from amazon
            UserGroup.find({_id: req.body.id}, {image_path: 1}, function (err, group) {
                if(err){
                    res.json({error: true, message: err});
                }else{
                    if(group[0]){
                        logo = group[0].image_path;
                        //disconnect users from group first
                        disconnectAllEntitiesFromEntity(User, "groupsID", group_id, function (err, resp1) {
                            if(err){
                                res.json({error: true, message: err});
                            }else{
                                //now remove the group itself
                                UserGroup.remove({_id: group_id}, function (err, resp2) {
                                    if(err){
                                        res.json({error: true, message: "Eroare la stergerea grupului"});
                                    }else{
                                        //remove image from amazon
                                        if(logo){
                                            s3.deleteObject({Bucket: amazonBucket, Key: logo}, function (err, data) {
                                                if(err){
                                                    logger.error(err);
                                                    res.json({error: false, message: "Grupul a fost sters. "+resp1+". Imaginea nu s-a putut sterge"});
                                                }else{
                                                    res.json({error: false, message: "Grupul a fost sters. "+resp1+". Imaginea asociata grupului a fost stearsa"});
                                                }
                                            });
                                        }else{
                                            res.json({error: false, message: "Grupul a fost sters. "+resp1});
                                        }
                                    }
                                });
                            }
                        })
                    }else{
                        res.json({error: true, message: "Nu s-a gasit grupul"});
                    }
                }
            });
        });

    router.route('/admin/users/test')

        .post(function (req, res) {
            res.status(200).end();
        });

    router.route('/admin/users/publicContent/getAllContent')

        .get(function(req, res) {
            PublicContent.find({}, {title: 1, author: 1, text:1, type:1, 'therapeutic-areasID':1, enable:1} ,function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/publicContent/getById/:id')

        .get(function(req, res) {
            PublicContent.find({_id: req.params.id}, function (err, cont) {
                if(err){
                    res.send(err);
                }else{
                    if(cont[0]){
                        res.send(cont[0]);
                    }else{
                        res.send({message: "No content found"});
                    }
                }
            })
        });

    router.route('/admin/users/publicContent/toggleContent')

        .post(function(req, res) {
            PublicContent.update({_id: req.body.data.id}, {enable: !req.body.data.isEnabled}, function (err, wRes) {
                if(err){
                    res.send({error: true});
                }else{
                    res.send({error: false});
                }
            });
        });

    router.route('/admin/users/publicContent/addContent')

        .post(function(req, res) {
            var data = req.body.data;
            var ans = {};
            //validate author and title
            var patt = new XRegExp('^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\s]{3,100}$');
            if(!patt.test(data.title.toString()) || !patt.test(data.author.toString())){
                ans.error = true;
                ans.message = "Autorul si titlul sunt obligatorii (minim 3 caractere)";
                res.json(ans);
            }else{
                //validate type
                if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                    ans.error = true;
                    ans.message = "Verificati tipul";
                    res.json(ans);
                }else{
                    //form object to persist
                    data.enable = false;
                    data.last_updated = new Date();
                    //persist object
                    var content = new PublicContent(data);
                    content.save(function (err, inserted) {
                        if(err){
                            ans.error = true;
                            ans.message = "Eroare la salvare. Verificati campurile";
                            res.json(ans);
                        }else{
                            ans.error = false;
                            ans.message = "Continutul a fost salvat cu succes!";
                            res.json(ans);
                        }
                    });
                }
            }
        });

    router.route('/admin/users/publicContent/editContent')

        .post(function(req, res) {
            var data = req.body.data.toUpdate;
            var id = req.body.data.id;
            var ans = {};
            //validate author and title
            var patt = new XRegExp('^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\s]{3,100}$');
            if(!patt.test(data.title.toString()) || !patt.test(data.author.toString())){
                ans.error = true;
                ans.message = "Autorul si titlul sunt obligatorii (minim 3 caractere)";
                res.json(ans);
            }else{
                //validate type
                if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                    ans.error = true;
                    ans.message = "Verificati tipul";
                    res.json(ans);
                }else{
                    //refresh last_updated field
                    data.last_updated = new Date();
                    PublicContent.update({_id: id}, data, function (err, wRes) {
                        if(err){
                            ans.error = true;
                            ans.message = "Eroare la actualizare. Verificati campurile";
                            res.json(ans);
                        }else{
                            ans.error = false;
                            ans.message = "Continutul a fost modificat cu succes!";
                            res.json(ans);
                        }
                    });
                }
            }
        });

    router.route('/admin/users/publicContent/deleteContent')

        .post(function (req, res) {
            var content_id = req.body.id;
            //find files to remove from amazon
            PublicContent.find({_id: content_id}, {image_path: 1, file_path: 1}, function (err, content) {
                if(err){
                    res.json({error: true, message: err});
                }else{
                    if(content[0]){
                        var image = content[0].image_path;
                        var file = content[0].file_path;
                        //remove content
                        PublicContent.remove({_id: content_id}, function (err, success) {
                            if(err){
                                res.json({error: true, message: "Eroare la stergerea continutului"});
                            }else{
                                //remove image and file from amazon
                                if(image){
                                    deleteObjectS3(image, function (err, data) {
                                        if(err){
                                            res.json({error: true, message: "Continutul a fost sters. Eroare la stergerea fisierelor asociate"});
                                        }else{
                                            if(file){
                                                deleteObjectS3(file, function (err, data) {
                                                    if(err){
                                                        res.json({error: true, message: "Continutul a fost sters. Eroare la stergerea fisierelor asociate"});
                                                    }else{
                                                        res.json({error: false, message: "Continutul a fost sters. Fisierele asociate au fost sterse"});
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }else{
                                    if(file){
                                        deleteObjectS3(file, function (err, data) {
                                            if(err){
                                                res.json({error: true, message: "Continutul a fost sters. Eroare la stergerea fisierelor asociate"});
                                            }else{
                                                res.json({error: false, message: "Continutul a fost sters. Fisierele asociate au fost sterse"});
                                            }
                                        });
                                    }else{
                                        res.json({error: false, message: "Continutul a fost sters. Nu s-au gasit fisiere asociate"});
                                    }
                                }
                            }
                        });
                    }else{
                        res.json({error: true, message: "Nu s-a gasit continutul"});
                    }
                }
            });
        });

    router.route('/admin/users/publicContent/changeImageOrFile')
        .post(function (req,res) {
            var data = req.body.data;
            var qry = {};
            var ok = true;
            if(data.type === "image"){
                qry['image_path'] = data.path;
            }else{
                if(data.type === "file"){
                    qry['file_path'] = data.path;
                }else{
                    ok = false;
                    res.json({error:true});
                }
            }
            if(ok){
                PublicContent.update({_id:data.id}, qry, function (err, wRes) {
                    if(err){
                        logger.error("Error at content "+data.type+"_path; id = "+data.id+"; Key = "+data.path);
                        res.json({error:true});
                    }else{
                        res.json({error:false, updated:wRes});
                    }
                });
            }
        });

    router.route('/admin/users/carouselPublic/getAllImages')

        .get(function(req, res) {
            PublicCarousel.find({}, function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/carouselPublic/contentByType/:type')

        .get(function(req, res) {
            PublicContent.find({type: req.params.type}, {title: 1, type:1}).sort({title: 1}).exec(function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/carouselPublic/addImage')

        .post(function(req, res) {
            var data = req.body.data.toAdd;
            var ext = req.body.data.extension;
            var ans = {};
            //validate title and description
                //validate type
                if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                    ans.error = true;
                    ans.message = "Verificati tipul";
                    res.json(ans);
                }else{
                    //check if content_id exists
                    if(typeof data.content_id === "string" && data.content_id.length === 24){
                        //form object to persist
                        data.enable = false;
                        data.last_updated = new Date();
                        //persist object
                        var img = new PublicCarousel(data);
                        img.save(function (err, inserted) {
                            if(err){
                                ans.error = true;
                                ans.message = "Eroare la salvare. Verificati campurile";
                                res.json(ans);
                            }else{
                                //update image_path
                                var imagePath = "generalCarousel/image_"+inserted._id+"."+ext;
                                PublicCarousel.update({_id: inserted._id}, {image_path: imagePath}, function (err, wRes) {
                                    if(err){
                                        ans.error = true;
                                        ans.message = "Eroare la salvare. Verificati campurile";
                                        res.json(ans);
                                    }else{
                                        ans.error = false;
                                        ans.message = "Se incarca imaginea...";
                                        ans.key = imagePath;
                                        res.json(ans);
                                    }
                                });
                            }
                        });
                    }else{
                        ans.error = true;
                        ans.message = "Selectati un continut";
                        res.json(ans);
                    }
                }

        });

    router.route('/admin/users/carouselPublic/toggleImage')

        .post(function(req, res) {
            PublicCarousel.update({_id: req.body.data.id}, {enable: !req.body.data.isEnabled}, function (err, wRes) {
                if(err){
                    res.send({error: true});
                }else{
                    res.send({error: false});
                }
            });
        });

    router.route('/admin/users/carouselPublic/deleteImage')

        .post(function (req, res) {
            var image_id = req.body.id;
            //find image to remove from amazon
            PublicCarousel.find({_id: image_id}, {image_path: 1}, function (err, image) {
                if(err){
                    res.json({error: true, message: err});
                }else{
                    if(image[0]){
                        var imageS3 = image[0].image_path;
                        //remove from database
                        PublicCarousel.remove({_id: image_id}, function (err, success) {
                            if(err){
                                res.json({error: true, message: "Eroare la stergerea imaginii"});
                            }else{
                                //remove image from amazon
                                if(imageS3){
                                    deleteObjectS3(imageS3, function (err, data) {
                                        if(err){
                                            res.json({error: true, message: "Imaginea a fost stearsa din baza de date. Nu s-a putut sterge de pe Amazon"});
                                        }else{
                                            res.json({error: false, message: "Imaginea a fost stearsa din baza de date si de pe Amazon."});
                                        }
                                    });
                                }else{
                                    res.json({error: false, message: "Imaginea a fost stearsa din baza de date."});
                                }
                            }
                        });
                    }else{
                        res.json({error: true, message: "Nu s-a gasit imaginea"});
                    }
                }
            });
        });

    router.route('/admin/users/carouselPublic/editImage')

        .post(function(req, res) {

            var data = req.body.data.toUpdate;
            var id = req.body.data.id;
            var ans = {};
            //validate title and description
                //validate type
                if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                    ans.error = true;
                    ans.message = "Verificati tipul";
                    res.json(ans);
                }else{
                    //check if content_id exists
                    if(typeof data.content_id === "string" && data.content_id.length === 24){
                        //refresh last_updated field
                        data.last_updated = new Date();
                        PublicCarousel.update({_id: id}, data, function (err, wRes) {
                            if(err){
                                ans.error = true;
                                ans.message = "Eroare la actualizare. Verificati campurile";
                                res.json(ans);
                            }else{
                                ans.error = false;
                                ans.message = "Datele au fost modificate cu succes!";
                                res.json(ans);
                            }
                        });
                    }else{
                        ans.error = true;
                        ans.message = "Selectati un continut";
                        res.json(ans);
                    }
                }

        });
    router.route('/admin/users/carouselPublic/editImagePath')
        .post(function(req,res){
            var ans={};
            var data = req.body.data;
            PublicCarousel.update({_id: data.id}, {image_path: data.imagePath}, function (err, wRes) {
                if(err){
                    ans.error = true;
                    ans.message = "Eroare la actualizare. Verificati API-ul";
                    res.json(ans);
                }else{
                    ans.error = false;
                    ans.message = "Datele au fost modificate cu succes!";
                    res.json(ans);
                }
            });
        });
    router.route('/admin/users/carouselPublic/getById/:id')

        .get(function(req, res) {
            PublicCarousel.find({_id: req.params.id}, function (err, cont) {
                if(err){
                    res.send(err);
                }else{
                    if(cont[0]){
                        res.send(cont[0]);
                    }else{
                        res.send({message: "No image found"});
                    }
                }
            })
        });


    //Carousel Medic
    //===============================================================================================

    router.route('/admin/users/carouselMedic/getAllImages')

        .get(function(req, res) {
            Carousel.find({}, function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/carouselMedic/contentByType/:type')

        .get(function(req, res) {
            Content.find({type: req.params.type}, {title: 1, type:1}).sort({title: 1}).exec(function(err, cont) {
                if(err) {
                    logger.error(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/users/carouselMedic/addImage')

        .post(function(req, res) {
            var data = req.body.data.toAdd;
            var ext = req.body.data.extension;
            var ans = {};
                //validate type
                if(!(typeof data.type === "number" && data.type>0 && data.type<4)){
                    ans.error = true;
                    ans.message = "Verificati tipul!";
                    res.json(ans);
                }else{
                    //check if content_id exists
                    if(typeof data.article_id === "string" && data.article_id.length === 24){
                        //form object to persist
                        data.enable = false;
                        data.last_updated = new Date();
                        //persist object
                        var img = new Carousel(data);
                        img.save(function (err, inserted) {
                            if(err){
                                ans.error = true;
                                ans.message = "Eroare la salvare. Verificati campurile";
                                res.json(ans);
                            }else{
                                //update image_path
                                var imagePath = "carousel/medic/image_"+inserted._id+"."+ext;
                                Carousel.update({_id: inserted._id}, {image_path: imagePath}, function (err, wRes) {
                                    if(err){
                                        ans.error = true;
                                        ans.message = "Eroare la salvare. Verificati campurile";
                                        res.json(ans);
                                    }else{
                                        ans.error = false;
                                        ans.message = "Se incarca imaginea...";
                                        ans.key = imagePath;
                                        res.json(ans);
                                    }
                                });
                            }
                        });
                    }else{
                        ans.error = true;
                        ans.message = "Selectati un continut";
                        res.json(ans);
                    }
                }

        });

    router.route('/admin/users/carouselMedic/toggleImage')

        .post(function(req, res) {
            Carousel.update({_id: req.body.data.id}, {enable: !req.body.data.isEnabled}, function (err, wRes) {
                if(err){
                    res.send({error: true});
                }else{
                    res.send({error: false});
                }
            });
        });

    router.route('/admin/users/carouselMedic/deleteImage')

        .post(function (req, res) {
            var image_id = req.body.id;
            //find image to remove from amazon
            Carousel.find({_id: image_id}, {image_path: 1}, function (err, image) {
                if(err){
                    res.json({error: true, message: err});
                }else{
                    if(image[0]){
                        var imageS3 = image[0].image_path;
                        //remove from database
                        Carousel.remove({_id: image_id}, function (err, success) {
                            if(err){
                                res.json({error: true, message: "Eroare la stergerea imaginii"});
                            }else{
                                //remove image from amazon
                                if(imageS3){
                                    deleteObjectS3(imageS3, function (err, data) {
                                        if(err){
                                            res.json({error: true, message: "Imaginea a fost stearsa din baza de date. Nu s-a putut sterge de pe Amazon"});
                                        }else{
                                            res.json({error: false, message: "Imaginea a fost stearsa din baza de date si de pe Amazon."});
                                        }
                                    });
                                }else{
                                    res.json({error: false, message: "Imaginea a fost stearsa din baza de date."});
                                }
                            }
                        });
                    }else{
                        res.json({error: true, message: "Nu s-a gasit imaginea!"});
                    }
                }
            });
        });

    router.route('/admin/users/carouselMedic/editImage')

        .post(function(req, res) {
            var data = req.body.data.toUpdate;
            console.log(data);
            var id = req.body.data.id;
            var ans = {};
                //validate type
                if(!(typeof data.type === "number" && data.type>0 && data.type<5)){
                    ans.error = true;
                    ans.message = "Verificati tipul";
                    res.json(ans);
                }else{
                    //check if content_id exists
                    if(typeof data.article_id === "string" && data.article_id.length === 24){
                        //refresh last_updated field
                        data.last_updated = new Date();
                        Carousel.update({_id: id}, data, function (err, wRes) {
                            if(err){
                                ans.error = true;
                                ans.message = "Eroare la actualizare. Verificati campurile";
                                res.json(ans);
                            }else{
                                ans.error = false;
                                ans.message = "Datele au fost modificate cu succes!";
                                res.json(ans);
                            }
                        });
                    }else{
                        ans.error = true;
                        ans.message = "Selectati un continut";
                        res.json(ans);
                    }
                }

        });
    router.route('/admin/users/carouselMedic/editImagePath')
        .post(function(req,res){
            var ans = {};
            var data = req.body.data;
            Carousel.update({_id: data.id}, {image_path: data.imagePath}, function (err, wRes) {
                if(err){
                    ans.error = true;
                    ans.message = "Eroare la actualizare. Verificati API-ul";
                    res.json(ans);
                }else{
                    ans.error = false;
                    ans.message = "Datele au fost modificate cu succes!";
                    res.json(ans);
                }
            });
        });
    router.route('/admin/users/carouselMedic/getById/:id')

        .get(function(req, res) {
            Carousel.find({_id: req.params.id}, function (err, cont) {
                if(err){
                    res.send(err);
                }else{
                    if(cont[0]){
                        res.send(cont[0]);
                    }else{
                        res.send({message: "No image found"});
                    }
                }
            })
        });

    router.route('/admin/products')
        .get(function(req, res) {
            Products.find({}).populate("therapeutic-areasID").populate('groupsID').exec(function(err, cont) {
                if(err) {
                    res.send(err);
                }
                else{
                    var products={};
                    products['productList']=cont;
                    UserGroup.find({}, {display_name: 1, profession:1}).populate('profession').exec(function(err, cont2) {
                        if(err) {
                            logger.error(err);
                            res.send(err);
                        }else{
                            products['groups']=cont2;
                            res.json(products);
                        }
                    });
                }

            });
        })
        .post(function(req, res) {

            var product = new Products();

            if(req.body.name) product.name = req.body.name;
            if(req.body.description) product.description=req.body.description;
            if(req.body.enable) product.enable= req.body.enable;
            if(req.body.file_path) product.file_path= req.body.file_path;
            if(req.body.image_path) product.image_path= req.body.image_path;
            if(req.body['therapeutic-areasID']) product['therapeutic-areasID']= req.body['therapeutic-areasID'];
            if(req.body.groupsID) product.groupsID= req.body.groupsID;

            product.last_updated=Date.now();

            product.save(function(err, saved) {
                if (err)
                    res.send(err);
                else
                    res.json({ message: 'Product created!' , saved: saved});
            });

        });

    router.route('/admin/products/:id')
        .get(function(req, res) {
            console.log("asasa");
            Products.findOne({_id: req.params.id}).populate("therapeutic-areasID").populate('groupsID').exec(function(err, product) {
                if (err){
                    res.send(err);
                }else{
                    res.json(product);
                }
            });
        })
        .put(function(req, res) {

            Products.findById(req.params.id, function(err, product) {
                if (err){
                    res.send(err);
                }else{
                    if(req.body.name) product.name = req.body.name;
                    if(req.body.description) product.description = req.body.description;
                    if(typeof req.body.enable === "boolean") product.enable = req.body.enable;
                    if(req.body.file_path) product.file_path = req.body.file_path;
                    if(req.body.image_path) product.image_path = req.body.image_path;
                    if(req.body['therapeutic-areasID']) product['therapeutic-areasID'] = req.body['therapeutic-areasID'];
                    if(req.body.groupsID) product.groupsID = req.body.groupsID;

                    product.last_updated = Date.now();

                    product.save(function(err, saved) {
                        if (err){
                            res.send(err);
                        }else{
                            res.json({ message: 'Product updated!' , saved: saved});
                        }
                    });
                }
            });
        })
        .delete(function(req, res) {
            Products.remove({
                _id: req.params.id
            }, function(err,prod) {
                if (err){
                    res.send(err);
                }else{
                    res.json({ message: 'Successfully deleted' });
                }
            });
        });

    router.route('/admin/content')

        .get(function(req, res) {
            Content.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }
                else {
                    var contents={};
                    contents['content']=cont;
                    UserGroup.find({}, {display_name: 1, profession: 1}).populate('profession').exec(function(err, cont2) {
                        if(err) {
                            logger.error(err);
                            res.send(err);
                        }
                        contents['groups']=cont2;
                        res.json(contents);
                    });
                }
            });
        })
        .post(function(req, res) {
            var content = new Content(req.body);
            content.enable = false;
            content.last_updated = Date.now();
            content.save(function(err,saved) {
                if (err){
                    logger.error(err);
                    res.send(err);
                }else{
                    res.json({ message: 'Content created!' , saved: saved});
                }
            });
        });

    router.route('/admin/content/groupsByIds')
        .post(function (req, res) {
            var ids = req.body.ids || [];
            UserGroup.find({_id: {$in: ids}}).populate('profession').exec(function (err, groups) {
                if(err){
                    res.statusCode = 400;
                    res.end();
                }else{
                    console.log(groups);
                    res.send(groups);
                }
            });
        });

    router.route('/admin/content/:id')

        .get(function(req, res) {
            Content.find({_id:req.params.id}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                if(cont.length == 1){
                    res.json(cont[0]);
                }else{
                    findConnectedEntitiesWithProjection();
                    res.json(null);
                }
            })
        })
        .put(function(req, res) {
            Content.findById(req.params.id, function(err, content) {

                if (err) {
                    res.send(err);
                }else{
                    if(req.body.title) content.title = req.body.title;
                    if(req.body.author) content.author = req.body.author;
                    if(req.body.description) content.description = req.body.description;
                    if(req.body.text) content.text = req.body.text;
                    if(req.body.type) content.type = req.body.type;
                    if(req.body.groupsID) content.groupsID = req.body.groupsID;
                    if(typeof req.body.enable === "boolean") content.enable = req.body.enable;

                    content.last_updated = Date.now();

                    content.save(function(err, saved) {
                        if (err){
                            res.send(err);
                        }else{
                            res.json({ message: 'Content updated!' , newContent: saved});
                        }
                    });
                }
            });
        })
        .delete(function(req, res) {
            Content.remove({
                _id: req.params.id
            }, function(err,cont) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted!' });
            });
        });
    router.route('/admin/content/editImage')
        .post(function(req,res){
            console.log(req.body.data);
            var data = req.body.data;
            Content.update({_id:data.id}, {image_path: data.path}, function (err, wRes) {
                if(err){
                    logger.error("Error at article change logo. Article id = "+data.id+"; Key = "+data.path);
                    res.json({error:true});
                }else{
                    res.json({error:false, updated:wRes});
                }
            });
        });
    router.route('/admin/events')

        .get(function(req, res) {
            Events.find().populate('listconferences').exec(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        })
        .post(function(req, res) {

            var event = new Events();

            if(req.body.description) event.description = req.body.description;
            if(typeof req.body.enable === "boolean"){
                event.enable = req.body.enable;
            }else{
                event.enable = false;
            }
            if(req.body.end) event.end= req.body.end;
            if(req.body.name) event.name=req.body.name;
            if(req.body.place) event.place= req.body.place;
            if(req.body.start) event.start=req.body.start;
            if(req.body.type) event.type=req.body.type;

            if(req.body.listconferences) event.listconferences = req.body.listconferences;
            if(req.body.groupsID) event.groupsID= req.body.groupsID;

            event.last_updated = Date.now();

            event.save(function(err, saved) {
                if (err){
                    res.send(err);
                }else{
                    res.json({ message: 'Event created!' , saved: saved});
                }
            });

        });
    router.route('/admin/events/toggleEvent')
        .post(function(req, res) {
        Events.update({_id: req.body.data.id}, {enable: !req.body.data.isEnabled}, function (err, wRes) {
            if(err){
                res.send({error: true});
            }else{
                res.send({error: false});
            }
        });
    });
    router.route('/admin/events/:id')

        .get(function(req, res) {
            Events.findOne({_id:req.params.id}).populate('listconferences').populate('groupsID').exec(function(err, cont) {
                if(err) {
                    res.send(err);
                }else{
                    res.json(cont);
                }
            })
        })
        .put(function(req, res) {

            Events.findById(req.params.id, function(err, event) {

                if (err){
                    res.send(err);
                }else{
                    if(req.body.description) event.description = req.body.description;
                    if(typeof req.body.enable === "boolean"){
                        event.enable = req.body.enable;
                    }else{
                        event.enable = false;
                    }
                    if(req.body.end) event.end= req.body.end;
                    if(req.body.name) event.name=req.body.name;
                    if(req.body.place) event.place= req.body.place;
                    if(req.body.start) event.start=req.body.start;
                    if(req.body.type) event.type=req.body.type;

                    if(req.body.listconferences) event.listconferences = req.body.listconferences;
                    if(req.body.groupsID) event.groupsID= req.body.groupsID;

                    event.last_updated= Date.now();

                    event.save(function(err, eventSaved) {
                        if (err){
                            res.send(err);
                        }else{
                            //send notification
                            if(req.body.notificationText){
                                getUsersForConferences(eventSaved.listconferences, function (err, id_users) {
                                    if(err){
                                        res.json({ message: 'Event updated! Error sending notification' });
                                    }else{
                                        if(id_users.length != 0){
                                            sendPushNotification(req.body.notificationText, id_users, function (err, success) {
                                                if(err){
                                                    console.log(err);
                                                    logger.error(err);
                                                    res.json({ message: 'Event updated! Error notifying users' });
                                                }else{
                                                    res.json({ message: 'Event updated! Notification was sent' });
                                                }
                                            });
                                        }else{
                                            res.json({ message: 'Event updated! No users found to notify' });
                                        }
                                    }
                                });
                            }else{
                                res.json({ message: 'Event updated! No notification sent' });
                            }
                        }
                    });
                }
            });
        })
        .delete(function(req, res) {
            Events.findOne({_id:req.params.id},function(err,resp){
                resp.remove(function(err,cont) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Successfully deleted!' });
                });
            })

        });

    router.route('/admin/speakers')
        .get(function(req,res){
            Speakers.find().sort({first_name: 1}).exec(function (err, speakers) {
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
        })
    .post(function(req, res) {

        var speaker = new Speakers(); 		// create a new instance of the Bear model
            speaker.first_name = req.body.first_name;  // set the bears name (comes from the request)
            speaker.last_name=req.body.last_name ;
            speaker.profession= req.body.profession     ;
            speaker.last_updated= req.body.last_updated ;
            speaker.workplace=req.body.workplace;
            speaker.short_description= req.body.short_description ;
            speaker.image_path=req.body.image_path;
            speaker.save(function(err) {
            if (err)
                res.send(err);
            else
                res.json({ message: 'Speaker created!' });
        });

    });
    router.route('/admin/speakers/changeSpeakerLogo')
        .post(function(req,res){
            var data = req.body.data;
            Speakers.update({_id:data.id}, {image_path: data.path}, function (err, wRes) {
                if(err){
                    logger.error("Error at speaker change logo. Speaker id = "+data.id+"; Key = "+data.path);
                    res.json({error:true});
                }else{
                    res.json({error:false, updated:wRes});
                }
            });
        });
    router.route('/admin/speakers/:id')
        .get(function(req,res){
            Speakers.findById(req.params.id).exec(function (err, speaker) {
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
        })
    .put(function(req, res) {

        Speakers.findById(req.params.id, function(err, speaker) {

            if (err)
                res.send(err);

            speaker.first_name = req.body.first_name;  // set the bears name (comes from the request)
            speaker.last_name=req.body.last_name ;
            speaker.profession= req.body.profession     ;
            speaker.last_updated= req.body.last_updated ;
            speaker.workplace=req.body.workplace;
            speaker.short_description= req.body.short_description ;
            speaker.save(function(err) {
                if (err) {
                    logger.error(err);
                    res.send(err);
                    return;
                }
                res.json({ message: 'Speaker updated!' });
            });

        });
    })
        .delete(function(req, res) {
            var id= req.params.id;
            disconnectAllEntitiesFromEntity(Talks, "speakers", id, function (err, result){
                if(err){
                    res.send(err);
                }else{
                    //get speaker to find out image path
                    Speakers.findOne({_id: id}, function (err, speaker) {
                        if(speaker){
                            var s3Key = speaker.image_path;
                            //delete speaker
                            Speakers.remove({_id:id},function(err,cont) {
                                if (err){
                                    res.json({message:'Could not delete speaker!'});
                                }
                                else{
                                    //speaker was deleted. Now delete image if there is one
                                    if(s3Key){
                                        s3.deleteObject({Bucket: amazonBucket, Key: s3Key}, function (err, data) {
                                            if(err){
                                                logger.error(err);
                                                res.json({message: "Speaker was deleted. Image could not be deleted"});
                                            }else{
                                                res.json({message: "Speaker was deleted. Image was deleted"});
                                            }
                                        });
                                    }else{
                                        res.json({message:'Speaker was deleted!'});
                                    }
                                }
                            });
                        }else{
                            res.json({message:'Speaker not found!'});
                        }
                    });
                }
            });



        });
    router.route('/admin/conferences')
        .get(function(req,res){
            Conferences.find().exec(function (err, conf) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(conf);
                    return;
                }
            })
        })
    .post(function(req, res) {

        var conferences = new Conferences(); 		// create a new instance of the Bear model
            conferences.title = req.body.title;  // set the bears name (comes from the request)
            conferences.enable=req.body.enable ;
            conferences.begin_date= req.body.begin_date     ;
            conferences.end_date= req.body.end_date     ;
            conferences.last_updated= req.body.last_updated ;
            conferences.description=req.body.description;
            conferences.qr_code=req.body.qr_code;
            conferences.topicsID=req.body.topicsID;
            conferences.image_path=req.body.image_path;
            conferences.save(function(err,saved) {
            if (err)
                res.send(err);
            else
            {
                var conf = new Conferences();
                conf = saved;
                var newQR = new Object();
                newQR.type = 2;
                newQR.message = saved.qr_code.message;
                newQR.conference_id = saved._id;
                conf.qr_code=newQR;
                conf.save(function(err){
                    if(err)
                        res.send(err);
                    else
                        res.json({ message: 'Conference created!' });
                })

            }

        });

    });
    router.route('/admin/conferences/:id')
        .get(function(req,res){
            Conferences.findById(req.params.id).exec(function (err, conf) {
                if (err)
                {
                    res.json(err);
                    return;
                }
                else
                {

                    res.json(conf);
                    return;
                }
            })
        })
        .put(function(req, res) {

            Conferences.findById(req.params.id, function(err, conferences) {

                if (err){
                    res.send(err);
                }else{
                    conferences.title = req.body.title;  // set the bears name (comes from the request)
                    conferences.enable=req.body.enable;
                    conferences.begin_date= req.body.begin_date;
                    conferences.end_date= req.body.end_date;
                    conferences.last_updated= req.body.last_updated;
                    conferences.description=req.body.description;
                    conferences.topicsID=req.body.topicsID;
                    conferences.qr_code=req.body.qr_code;
                    conferences.save(function(err, conferenceSaved) {
                        if (err){
                            res.send(err);
                        }else{
                            //send notification
                            if(req.body.notificationText){
                                getUsersForConference(conferenceSaved._id, function (err, users) {
                                    if(err){
                                        res.json({ message: 'Conference updated! Error at sending notification' });
                                    }else{
                                        if(users.length != 0){
                                            sendPushNotification(req.body.notificationText, users, function (err, success) {
                                                if(err){
                                                    res.json({ message: 'Conference updated! Error notifying users' });
                                                }else{
                                                    res.json({ message: 'Conference updated! Notification was sent' });
                                                }
                                            });
                                        }else{
                                            res.json({ message: 'Conference updated! No users found to notify' });
                                        }
                                    }
                                });
                            }else{
                                res.json({ message: 'Conference updated! No notification sent' });
                            }
                        }
                    });
                }
            });
        })
        .delete(function(req, res) {
            var id = req.params.id;
            disconnectAllEntitiesFromEntity(Events, "listconferences", id, function (err, result){
                if(err)
                    res.send(err);
                else
                {

                    disconnectAllEntitiesFromEntity(User, "conferencesID", id, function (err, result) {
                        if (err)
                            res.send(err);
                        else
                        {
                            Conferences.findOne({_id: id}, function (err, resp) {
                                if (resp) {
                                    resp.remove(function (err, cont) {
                                        if (err)
                                            res.send(err);
                                        else
                                            res.json({message: 'Successfully deleted!'});
                                    });
                                }
                                else
                                    res.send(err);
                            });
                        }


                    })

                }
            });


        });
    router.route('/admin/conferences/changeConferenceLogo')
        .post(function(req,res){
            var data = req.body.data;
            Conferences.update({_id:data.id}, {image_path: data.path}, function (err, wRes) {
                if(err){
                    logger.error("Error at conference change logo. Conference id = "+data.id+"; Key = "+data.path);
                    res.json({error:true});
                }else{
                    res.json({error:false, updated:wRes});
                }
            });
        });
     router.route('/admin/talks')
        .get(function(req,res){
            Talks.find().populate('conference room speakers').exec(function (err, talks) {
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

        })
         .post(function(req, res) {
             var talk = new Talks(req.body.data);
             talk.enable = true;
             talk.last_updated = Date.now();
             talk.save(function (err, savedTalk) {
                 if(err){
                     res.send(err);
                 }else{
                     res.json({ message: 'Talk created!' });
                 }
             });
         });
    router.route('/admin/talks/:id')
        .get(function(req,res){
            Talks.findById(req.params.id).populate('speakers room conference').exec(function (err, talk) {
                if (err)
                {
                    logger.error(err);
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(talk);
                    return;
                }
            })
        })
        .put(function(req, res) {

            var toUpdate = req.body.talk;
            delete toUpdate._id;

            Talks.update({_id: req.params.id}, toUpdate, function (err, wRes) {
                if(err){
                    res.send(err);
                }else{
                    //send notification
                    if(req.body.notification){
                        getUsersForTalk(req.params.id, function (err, id_users) {
                            if(err){
                                res.json({ message: 'Talk updated! Error sending notification' });
                            }else{
                                if(id_users.length != 0){
                                    sendPushNotification(req.body.notification, id_users, function (err, success) {
                                        if(err){
                                            res.json({ message: 'Talk updated! Error notifying users' });
                                        }else{
                                            res.json({ message: 'Talk updated! Notification was sent' });
                                        }
                                    });
                                }else{
                                    res.json({ message: 'Talk updated! No users found to notify' });
                                }
                            }
                        });
                    }else{
                        res.json({ message: 'Talk updated! No notification sent' });
                    }
                }
            });
        })
        .delete(function(req, res) {
            var id = req.params.id;
            Talks.remove({_id: id}, function(err,cont) {
                if (err)
                    res.send(err);
                else
                    res.json({ message: 'Successfully deleted!' });
            });

        });
    router.route('/admin/rooms')
        .get(function(req,res){
            Rooms.find().exec(function (err, rooms) {
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

        })
        .post(function(req, res) {
            var data = req.body.data;

            var rooms = new Rooms();
            rooms.room_name = data.room_name;
            rooms.qr_code = {
                message: data.qrMessage,
                room_id: "",
                type: 1
            };
            rooms.save(function (err, roomSaved) {
                if (err)
                    res.send(err);
                else {
                    var newQR = new Object();
                    newQR.type = roomSaved.qr_code.type;
                    newQR.message = roomSaved.qr_code.message;
                    newQR.room_id = mongoose.Types.ObjectId(roomSaved._id.toString());
                    roomSaved.qr_code = newQR;
                    roomSaved.save(function (err) {
                        if (err)
                            res.send(err);
                        else
                            res.json({message: 'Room created!'});
                    });
                }
            });
        });
    router.route('/admin/rooms/:id')
        .get(function(req,res){
            Rooms.findById(req.params.id).exec(function (err, room) {
                if (err)
                {
                    logger.error(err);
                    res.json(err);
                    return;
                }
                else
                {
                    res.json(room);
                    return;
                }
            })
        })
        .put(function(req, res) {

            var room = req.body.room;
            Rooms.update({_id: room._id}, room,  function (err, writeConcern) {
                if(err){
                    console.log(err);
                    res.send(err);
                }else{
                    //send notification
                        if(req.body.notification){
                            getUsersForRoom(room._id, function (err, id_users) {
                                if(err){
                                    res.json({ message: 'Room updated! Error sending notification' });
                                }else{
                                    if(id_users.length != 0){
                                        sendPushNotification(req.body.notification, id_users, function (err, success) {
                                            if(err){
                                                res.json({ message: 'Room updated! Error notifying users' });
                                            }else{
                                                res.json({ message: 'Room updated! Notification was sent' });
                                            }
                                        });
                                    }else{
                                        res.json({ message: 'Room updated! No users found to notify' });
                                    }
                                }
                            });
                        }else{
                            res.json({ message: 'Room updated! No notification sent' });
                        }
                }
            });
        })
        .delete(function(req, res) {
            var id = req.params.id;
            disconnectAllEntitiesFromEntity(Talks, "room", id, function (err, result){
                if(err)
                    res.send(err);
                else {
                    Rooms.remove({_id: req.params.id}, function (err, cont) {
                        if (err)
                            res.send(err);
                        else
                            res.json({message: 'Successfully deleted!'});
                    });
                }});

        });
    router.route('/admin/multimedia')

        .get(function(req, res) {
            Multimedia.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        })
        .post(function(req, res) {

            var multimedia = new Multimedia(); 		// create a new instance of the Bear model
            multimedia.author = req.body.author;  // set the bears name (comes from the request)
            multimedia.description=req.body.description ;
            multimedia.enable= req.body.enable    ;
            multimedia.file_path= req.body.file_path  ;
            multimedia.groupsID= req.body.groupsID ;
            multimedia.last_updated=req.body.last_updated;
            multimedia.points= req.body.points ;
            multimedia.quizesID=req.body.quizesID;
            multimedia['therapeutic-areasID']=req.body['therapeutic-areasID'];
            multimedia.thumbnail_path=req.body.thumbnail_path;
            multimedia.title=req.body.title;
            multimedia.type=req.body.type;

            multimedia.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Multimedia created!' });
            });

        });
    router.route('/admin/multimedia/:id')

        .get(function(req, res) {
            Multimedia.find({_id:req.params.id}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                if(cont.length == 1){
                    res.json(cont[0]);
                }else{
                    res.json(null);
                }
            })
        })
        .put(function(req, res) {

            Multimedia.findById(req.params.id, function(err, multimedia) {

                if (err)
                    res.send(err);

                multimedia.author = req.body.author;  // set the bears name (comes from the request)
                multimedia.description=req.body.description ;
                multimedia.enable= req.body.enable    ;
                multimedia.file_path= req.body.file_path  ;
                multimedia.groupsID= req.body.groupsID ;
                multimedia.last_updated=req.body.last_updated;
                multimedia.points= req.body.points ;
                multimedia.quizesID=req.body.quizesID;
                multimedia['therapeutic-areasID']=req.body['therapeutic-areasID'];
                multimedia.thumbnail_path=req.body.thumbnail_path;
                multimedia.title=req.body.title;
                multimedia.type=req.body.type;
                multimedia.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Multimedia updated!' });
                });

            });
        })
        .delete(function(req, res) {
            Multimedia.remove({
                _id: req.params.id
            }, function(err,cont) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted!' });
            });
        });


    router.route('/admin/quizes')

        .get(function(req, res) {
            Quizes.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        })
        .post(function(req, res) {

            var test = new Quizes(); 		// create a new instance of the Bear model
            test.description = req.body.description;  // set the bears name (comes from the request)
            test.enabled=req.body.enabled ;
            test.entity= req.body.entity   ;
            test.expired= req.body.expired  ;
            test.expiry_date= req.body.expiry_date ;
            test.last_updated=req.body.last_updated;
            test.no_of_exam_questions= req.body.no_of_exam_questions ;
            test.points=req.body.points;
            test.questionsID=req.body.questionsID;
            test.time=req.body.time;
            test.times=req.body.times;
            test.title=req.body.title;
            test.treshhold=req.body.treshhold;

            test.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Test created!' });
            });

        });
    router.route('/admin/quizes/:id')

        .get(function(req, res) {
            Quizes.find({_id:req.params.id}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                if(cont.length == 1){
                    res.json(cont[0]);
                }else{
                    res.json(null);
                }
            })
        })
        .put(function(req, res) {

            Quizes.findById(req.params.id, function(err, test) {

                if (err)
                    res.send(err);

                test.description = req.body.description;  // set the bears name (comes from the request)
                test.enabled=req.body.enabled ;
                test.entity= req.body.entity   ;
                test.expired= req.body.expired  ;
                test.expiry_date= req.body.expiry_date ;
                test.last_updated=req.body.last_updated;
                test.no_of_exam_questions= req.body.no_of_exam_questions ;
                test.points=req.body.points;
                test.questionsID=req.body.questionsID;
                test.time=req.body.time;
                test.times=req.body.times;
                test.title=req.body.title;
                test.treshhold=req.body.treshhold;
                test.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Test updated!' });
                });

            });
        })
        .delete(function(req, res) {
            Quizes.remove({
                _id: req.params.id
            }, function(err,cont) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted!' });
            });
        });


    router.route('/admin/areas')

        .get(function(req, res) {
            Therapeutic_Area.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }
                else
                    res.json(cont);
            });
        })
        .post(function(req, res) {

            var therapeutic = new Therapeutic_Area(); 		// create a new instance of the Bear model
            therapeutic.has_children = req.body.has_children;  // set the bears name (comes from the request)
            therapeutic.last_updated=req.body.last_updated ;
            therapeutic.name= req.body.name   ;
            therapeutic.enabled= req.body.enabled  ;
            therapeutic['therapeutic-areasID']= req.body['therapeutic-areasID'];
            therapeutic.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Area created!' });
            });

        });
    router.route('/admin/areas/:id')

        .get(function(req, res) {
            Therapeutic_Area.find({_id:req.params.id}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                if(cont.length == 1){
                    res.json(cont[0]);
                }else{
                    res.json(null);
                }
            })
        })
        .put(function(req, res) {

            Therapeutic_Area.findById(req.params.id, function(err, therapeutic) {

                if (err)
                    res.send(err);

                therapeutic.has_children = req.body.has_children;  // set the bears name (comes from the request)
                therapeutic.last_updated=req.body.last_updated ;
                therapeutic.name= req.body.name   ;
                therapeutic.enabled= req.body.enabled  ;
                therapeutic['therapeutic-areasID']= req.body['therapeutic-areasID'];
                therapeutic.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Area updated!' });
                });

            });
        })
        .delete(function(req, res) {
            Therapeutic_Area.remove({
                _id: req.params.id
            }, function(err,cont) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted!' });
            });
        });

    router.route('/admin/applications/qa/topics')
        .get(function (req, res) {
            Topics.find({}, function (err, topics) {
                if(err){
                    res.send(err);
                }else{
                    res.json(topics);
                }
            });
        })
        .post(function (req, res) {
            var name = req.body.name;
            //validate name
            var namePatt = new XRegExp('^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>]{1}[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\-_]{1,50}$','i');
            if(!namePatt.test(name)){
                res.send({message: {type: 'danger', text: 'Numele este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
            }else{
                //check if topic already exists
                Topics.findOne({name: name}, function (err, topic) {
                    if(err){
                        res.send({message: {type: 'danger', text: 'Eroare la adaugarea topicului. Verificati numele'}});
                    }else{
                        if(topic){
                            res.send({message: {type: 'danger', text: 'Topicul exista deja'}});
                        }else{
                            //add topic
                            var toAdd = new Topics({name: name});
                            toAdd.save(function (err, saved) {
                                if(err){
                                    res.send({message: {type: 'danger', text: 'Eroare la salvare'}});
                                }else{
                                    res.send({message: {type: 'success', text: 'Topicul a fost salvat'}});
                                }
                            });
                        }
                    }
                });
            }
        })
        .put(function (req, res) {
            var id = req.body.id;
            var name = req.body.name;
            //validate name
            var namePatt = new XRegExp('^[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>]{1}[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\-_]{1,50}$','i');
            if(!namePatt.test(name)){
                res.send({message: {type: 'danger', text: 'Numele este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
            }else{
                //check if topic already exists
                Topics.findOne({name: name}, function (err, topic) {
                    if(err){
                        res.send({message: {type: 'danger', text: 'Eroare la modificarea topicului. Verificati numele'}});
                    }else{
                        if(topic){
                            res.send({message: {type: 'danger', text: 'Un topic cu acest nume exista deja'}});
                        }else{
                            //update topic
                            Topics.update({_id: id}, {$set: {name: name}}, function (err, wRes) {
                                if(err || wRes == 0){
                                    res.send({message: {type: 'danger', text: 'Eroare la actualizare. Verificati numele'}});
                                }else{
                                    res.send({message: {type: 'success', text: 'Topicul a fost modificat'}});
                                }
                            });
                        }
                    }
                });
            }
        });

    router.route('/admin/applications/qa/topicById/:id')
        .get(function (req, res) {
            Topics.findOne({_id: req.params.id}, function (err, topic) {
                if(err){
                    res.send(err);
                }else{
                    res.send(topic);
                }
            });
        })
        .delete(function (req, res) {
            var id_topic = req.params.id;
            id_topic = mongoose.Types.ObjectId(id_topic.toString());

            //check if topic is used in threads
            Threads.find({topics: {$in: [id_topic]}}, function (err, threads) {
                if(err){
                    res.send({message: {type: 'danger', text: 'Eroare la stergere'}});
                }else{
                    if(threads.length != 0){
                        res.send({message: {type: 'danger', text: 'Topicul nu poate fi sters, deoarece este folosit in thread-uri'}});
                    }else{
                        //delete topic
                        Topics.remove({_id: id_topic}, function (err, wRes) {
                            if(err || wRes == 0){
                                res.send({message: {type: 'danger', text: 'Nu s-a putut sterge'}});
                            }else{
                                res.send({message: {type: 'success', text: 'Topicul a fost sters'}});
                            }
                        });
                    }
                }
            });
        });

    router.route('/admin/applications/qa/answerGivers')
        .get(function (req, res) {
            AnswerGivers.find({}).populate('id_user').exec(function (err, ag) {
                if(err){
                    res.send(err);
                }else{
                    res.json(ag);
                }
            });
        })
        .post(function (req, res) {
            if(!req.body.nickname || !req.body.id_user){
                res.send({message: {type: 'danger', text:'Toate campurile sunt obligatorii'}});
            }else{
                //check if id points to an actual user
                User.findOne({_id: req.body.id_user}, function (err, user) {
                    if(err || !user){
                        res.send({message: {type: 'danger', text:'Utilizator invalid'}});
                    }else{
                        //check if medic was already registered as answer giver
                        AnswerGivers.findOne({id_user: mongoose.Types.ObjectId(req.body.id_user.toString())}, function (err, found) {
                            if(err || found){
                                res.send({message: {type: 'danger', text:'Eroare la validare. Verificati daca medicul este deja adaugat'}});
                            }else{
                                //check nickname format
                                var nickPatt = new XRegExp('^[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>]{1}[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\-_]{1,50}$','i');
                                if(!nickPatt.test(req.body.nickname.toString())){
                                    res.send({message: {type: 'danger', text: 'Nickname-ul este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
                                }else{
                                    //check if nickname already exists
                                    AnswerGivers.findOne({nickname: req.body.nickname}, function (err, found) {
                                        if(err || found){
                                            res.send({message: {type: 'danger', text:'Nickname-ul exista deja'}});
                                        }else{
                                            //add answer giver
                                            var toAdd = new AnswerGivers({
                                                id_user: mongoose.Types.ObjectId(req.body.id_user.toString()),
                                                nickname: req.body.nickname.toString()
                                            });
                                            toAdd.save(function (err, saved) {
                                                if(err){
                                                    res.send({message: {type: 'danger', text:'Eroare la salvare'}});
                                                }else{
                                                    res.send({message: {type: 'success', text:'Raspunzatorul a fost adaugat'}});
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        })
        .put(function (req, res) {
            var nickname = req.body.nickname?req.body.nickname.toString():"";
            //validate nickname format
            var nickPatt = new XRegExp('^[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>]{1}[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\-_]{1,50}$','i');
            if(!nickPatt.test(nickname)){
                res.send({message: {type: 'danger', text: 'Nickname-ul este obligatoriu (minim 2 caractere) si trebuie sa contina doar litere, cifre si caracterele "-", "_", insa poate incepe doar cu o litera sau cifra'}});
            }else{
                //check if nickname already exists
                AnswerGivers.findOne({nickname: nickname}, function (err, ag) {
                    if(err){
                        res.send({message: {type: 'danger', text: 'Eroare la modificarea nickname-ului'}});
                    }else if(ag){
                        res.send({message: {type: 'danger', text: 'Nickname-ul exista deja'}});
                    }else{
                        //get the answer giver we have to update; we will need it's id_user later
                        AnswerGivers.findOne({_id: req.body.id}, function (err, agToUpdate) {
                            if(err || !agToUpdate){
                                res.send({message: {type: 'danger', text: 'Eroare la modificarea nickname-ului'}});
                            }else{
                                //change nickname; change in posted messages as well
                                AnswerGivers.update({_id: req.body.id}, {$set: {nickname: nickname}}, function (err, wRes) {
                                    if(err){
                                        res.send({message: {type: 'danger', text: 'Eroare la modificarea nickname-ului'}});
                                    }else{
                                        //change in messages
                                        qaMessages.update({owner: agToUpdate.id_user}, {$set: {ownerDisplay: nickname}}, {multi: true}, function (err, wRes) {
                                            if(err){
                                                logger.warn("Modify nickname "+nickname+" for user "+agToUpdate.id_user+" in published messages:");
                                                logger.error(err);
                                                res.send({message: {type: 'danger', text: 'Nickname modificat. Eroare la modificarea nickname-ului in mesajele publicate'}});
                                            }else{
                                                res.send({message: {type: 'success', text: 'Nickname modificat. S-a actualizat in '+wRes+' mesaje publicate.'}});
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });

    router.route('/admin/applications/qa/answerGiverById/:id')
        .get(function (req, res) {
            AnswerGivers.findOne({_id: req.params.id}, function (err, ag) {
                if(err){
                    res.send(err);
                }else{
                    res.send(ag);
                }
            });
        })
        .delete(function (req, res) {
            var id_ag = req.params.id;
            id_ag = mongoose.Types.ObjectId(id_ag.toString());

            AnswerGivers.remove({_id: id_ag}, function (err, wRes) {
                if(err || wRes == 0){
                    res.send({message: {type: 'danger', text: 'Nu s-a putut sterge'}});
                }else{
                    res.send({message: {type: 'success', text: 'Raspunzatorul a fost sters'}});
                }
            });
        });

    router.route('/admin/applications/qa/medics')
        .get(function (req, res) {
            //find medics already defined as answer givers
            AnswerGivers.find(function (err, ag) {
                if(err){
                    res.send({message: {type: 'danger', text: 'Error finding medics'}});
                }else{
                    //get user ids of answer givers
                    var medicsIds = [];
                    async.each(ag, function (item, callback) {
                        medicsIds.push(item.id_user);
                        callback();
                    }, function (err) {
                        if(err){
                            res.send({message: {type: 'danger', text: 'Error finding medics'}});
                        }else{
                            //get all medics that are not already registered as answer givers
                            User.find({_id: {$nin: medicsIds}}, {username: 1}).exec(function (err, medics) {
                                if(err){
                                    res.send({message: {type: 'danger', text: 'Error finding medics'}});
                                }else{
                                    res.json(medics);
                                }
                            });
                        }
                    });
                }
            });
        });

    //==================================================================================================================================== routes for user

    router.route('/groups/specialGroups')

        .get(function(req, res) {
            UserGroup.find({_id: {$in: req.user.groupsID}, content_specific: {$exists:true, $ne: false}}, function(err, groups) {
                if(err) {
                    res.send(err);
                }
                else
                    res.json(groups);
            });
        });

    router.route('/content')

        .get(function(req, res) {
            Content.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        });

    router.route('/content/:content_id')

        .get(function(req, res) {
            var userGr = req.user.groupsID;
            Content.find({_id:req.params.content_id, groupsID: { $in: userGr}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                if(cont[0]){
                    res.json(cont[0]);
                }else{
                    res.json(null);
                }
            })
        });

    router.route('/content/type')

        .post(function(req, res) {
            var cType = req.body.content_type;
            var specialGroupSelected = req.body.specialGroupSelected;
            getUserContent(req.user, cType, specialGroupSelected, null, 'last_updated', function (err, content) {
                if(err){
                    res.send(err);
                }else{
                    res.json(content);
                }
            });
        });

    router.route('/userdata')

        .get(function(req, res) {
            User.findOne({_id: req.user._id}).select("+phone +points +citiesID +jobsID").exec(function (err, user) {
                if(err){
                    res.send(err);
                }else{
                    console.log(user);
                    var userCopy = {};
                    userCopy['id']=user._id;
                    userCopy['name'] = user.name;
                    userCopy['image_path'] = user.image_path;
                    userCopy['phone'] = user.phone;
                    userCopy['points'] = user.points;
                    userCopy['subscription'] = user.subscription;
                    userCopy['username'] = user.username;
                    userCopy['therapeutic-areasID'] = user['therapeutic-areasID'];
                    userCopy['citiesID'] = user.citiesID;
                    async.parallel([
                        function (callback) {
                            if(user['jobsID']){
                                if(user['jobsID'][0]){
                                    var jobId = user.jobsID[0];
                                    Job.find({_id:jobId}, function (err, job) {
                                        if(err){
                                            callback(err, null);
                                        }else{
                                            userCopy.job = job;
                                        }
                                    });
                                }
                            }
                            callback(null, null);
                        },
                        function (callback) {
                            Cities.find({_id:user.citiesID[0]}, function (err, city) {
                                if (err) {
                                    callback(err, null);
                                }
                                if (city[0]) {
                                    Counties.find({citiesID: {$in: [city[0]._id.toString()]}}, function (err, county) {
                                        if(err){
                                            callback(err, null);
                                        }
                                        if(county[0]){
                                            userCopy['city_id'] = city[0]._id;
                                            userCopy['city_name'] = city[0].name;
                                            userCopy['county_id'] = county[0]._id;
                                            userCopy['county_name'] = county[0].name;
                                        }
                                        callback(null, null);
                                    });
                                }else{
                                    callback(null, null);
                                }
                            });
                        }
                    ], function (err, results) {
                        if(err){
                            console.log(err);
                            res.send(err);
                        }else{
                            console.log(userCopy);
                            res.json(userCopy);
                        }
                    });
                }
            });
        });

    router.route('/counties')

        .get(function(req, res) {
            Counties.find({$query:{}, $orderby: {name: 1}}, {name: 1}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/cities/:county_name')

        .get(function(req, res) {
            Counties.find({name: req.params.county_name}, function (err, counties) {
                if(err) {
                    res.send(err);
                }
                Cities.find({_id: {$in: counties[0].citiesID}}, function (err, cities) {
                    if(err) {
                        res.send(err);
                    }
                    res.json(cities);
                });
            });
        });

    router.route('/userProfile')

        .post(function (req, res) {
            var ans = {};
            var newData = req.body.newData;
            var namePatt = new XRegExp('^[a-zA-ZĂăÂâÎîȘșŞşȚțŢţ\\s]{3,100}$');
            var phonePatt = new XRegExp('^[0-9]{10,20}$');
            //check name
            if((!namePatt.test(newData.firstName.toString())) || (!namePatt.test(newData.lastName.toString()))){
                ans.error = true;
                ans.message = "Numele si prenumele trebuie sa contina doar caractere, minim 3";
                res.json(ans);
            }else{
                //check phone number
                if(!phonePatt.test(newData.phone.toString())){
                    ans.error = true;
                    ans.message = "Numarul de telefon trebuie sa contina doar cifre, minim 10";
                    res.json(ans);
                }else{
                    var serializedAreas = [];
                    for(var i=0; i<newData.therapeuticAreas.length; i++){
                        serializedAreas.push(newData.therapeuticAreas[i].id.toString());
                    }
                    var upd = User.update({_id:req.user._id}, {
                        name: newData.firstName+" "+newData.lastName,
                        phone: newData.phone,
                        subscription: newData.newsletter?1:0,
                        "therapeutic-areasID": serializedAreas,
                        citiesID: [newData.city]
                    }, function () {
                        if(!upd._castError){
                            ans.error = false;
                            ans.message = "Datele au fost modificate";
                        }else{
                            ans.error = true;
                            ans.message = "Eroare la actualizare. Verificati datele";
                        }
                        res.json(ans);
                    });
                }
            }
        });

    router.route('/userJob')

        .post(function (req, res) {
            var ans = {error:false};
            var job = req.body.job;
            var namePatt = new XRegExp('^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\s]{3,30}$');
            var numberPatt = new XRegExp('^[a-zA-Z0-9\\s]{1,5}$');
            if(!numberPatt.test(job.street_number.toString())) {
                ans.error = true;
                ans.message = "Numarul strazii trebuie sa contina intre 1 si 5 cifre";
            }
            if(!namePatt.test(job.street_name.toString())) {
                ans.error = true;
                ans.message = "Numele strazii trebuie sa contina doar litere, minim 3";
            }
            if(!namePatt.test(job.job_name.toString())) {
                ans.error = true;
                ans.message = "Locul de munca trebuie sa contina doar litere, minim 3";
            }
            if(!isNaN(parseInt(job.job_type))){
                if(parseInt(job.job_type)<1 || parseInt(job.job_type>4)){
                    ans.error = true;
                    ans.message = "Selectati un tip de loc de munca";
                }
            }else{
                ans.error = true;
                ans.message = "Selectati un tip de loc de munca";
            }
            if(ans.error){
                res.json(ans);
            }else{
                if(job._id==0){
                    //create new
                    var newJob = new Job({
                        job_type: job.job_type,
                        job_name: job.job_name,
                        street_name: job.street_name,
                        street_number: job.street_number,
                        postal_code: job.postal_code,
                        job_address: job.job_address
                    });
                    newJob.save(function (err, inserted) {
                        if(err){
                            ans.error = true;
                            ans.message = "Eroare la crearea locului de munca. Va rugam verificati campurile";
                            res.json(ans);
                        }else{
                            //update user to point to new job
                            var idInserted = inserted._id.toString();
                            var upd = User.update({_id:req.user._id}, {jobsID: [idInserted]}, function () {
                                if(!upd._castError){
                                    ans.error = false;
                                    ans.message = "Locul de munca a fost salvat";
                                }else{
                                    ans.error = true;
                                    ans.message = "Eroare la adaugarea locului de munca. Va rugam sa verificati datele";
                                }
                                res.json(ans);
                            });
                        }
                    });
                }else{
                    //update existing
                    var upd = Job.update({_id:job._id}, {
                        job_type: job.job_type,
                        job_name: job.job_name,
                        street_name: job.street_name,
                        street_number: job.street_number,
                        postal_code: job.postal_code,
                        job_address: job.job_address
                    }, function () {
                        if(!upd._castError){
                            ans.error = false;
                            ans.message = "Locul de munca a fost adaugat";
                        }else{
                            ans.error = true;
                            ans.message = "Eroare la adaugarea locului de munca. Va rugam sa verificati datele";
                        }
                        res.json(ans);
                    });
                }
            }
        });

//    router.route('/changeEmail')
//        .post(function (req, res) {
//            var ans = {error: true, message:"Server error"};
//            var userData = req.body.userData;
//            //check if mail is valid
//            var mailPatt = new XRegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$', 'i');
//            if(!mailPatt.test(userData.mail.toString())){
//                ans.error = true;
//                ans.message = "E-mail invalid";
//                res.json(ans);
//            }else{
//                //check if mail already exists
//                User.find({username: userData.mail}, function(err, result){
//                    if(err){
//                        ans.error = true;
//                        ans.message = "Eroare la schimbarea adresei de e-mail";
//                        res.json(ans);
//                    }else{
//                        if(result.length == 0){
//                            //check password
//                            if(SHA256(userData.pass).toString() === req.user.password){
//                                var upd = User.update({_id:req.user._id}, {username: userData.mail}, function () {
//                                    if(!upd._castError){
//                                        ans.error = false;
//                                        ans.message = "Adresa de e-mail a fost modificata";
//                                        res.json(ans);
//                                    }else{
//                                        ans.error = true;
//                                        ans.message = "Eroare la schimbarea adresei de e-mail";
//                                        res.json(ans);
//                                    }
//                                });
//                            }else{
//                                ans.error = true;
//                                ans.message = "Parola incorecta";
//                                res.json(ans);
//                            }
//                        }else{
//                            ans.error = true;
//                            ans.message = "Acest e-mail este deja folosit";
//                            res.json(ans);
//                        }
//                    }
//                });
//            }
//        });

    router.route('/changePassword')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            User.findOne({_id: req.user._id}).select("+password").exec(function (err, user) {
                if(err || !user){
                    ans.error = true;
                    ans.message = "Utilizatorul nu a fost gasit!";
                    res.json(ans);
                }else{
                    //check if password is correct
                    if(SHA256(userData.oldPass).toString() !== user.password){
                        ans.error = true;
                        ans.message = "Parola nu este corecta!";
                        res.json(ans);
                    }else{
                        if(SHA256(userData.newPass).toString() === user.password)
                        {
                            ans.error = true;
                            ans.message = "Introduceti o parola diferita fata de cea veche!";
                            res.json(ans);
                        }
                        else
                        {
                            if(userData.newPass.toString().length < 6 || userData.newPass.toString.length > 32){
                                ans.error = true;
                                ans.message = "Parola noua trebuie sa contina intre 6 si 32 de caractere";
                                res.json(ans);
                            }else{
                                //check if passwords match
                                if(userData.newPass !== userData.confirmPass){
                                    ans.error = true;
                                    ans.message = "Parolele nu corespund";
                                    res.json(ans);
                                }else{
                                    //change password
                                    var upd = User.update({_id: user._id}, {password: SHA256(userData.newPass).toString()}, function (err, wres) {
                                        if(!err){
                                            ans.error = false;
                                            ans.message = "Parola a fost schimbata";
                                            res.json(ans);
                                        }else{
                                            ans.error = true;
                                            ans.message = "Eroare la schimbarea parolei";
                                            res.json(ans);
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            });
        });

    router.route('/userHomeCarousel/')
        .post(function (req,res) {
            getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                if(err){
                    res.send(err);
                }else{
                    var forGroups = nonSpecificGroupsIds;
                    if(req.body.specialGroupSelected){
                        forGroups.push(req.body.specialGroupSelected.toString());
                    }
                    console.log(forGroups);
                    //get allowed articles for user
                    Content.find({groupsID: {$in: forGroups},enable:true}, {_id: 1}, function (err, content) {
                        if(err){
                            res.send(err);
                        }else{
                            //get ids of allowed articles
                            getIds(content, function (ids) {
                                //get carousel content within allowed articles
                                Carousel.find({enable:true, article_id: {$in: ids}}).populate('article_id').exec(function (err, images) {
                                    if(err){
                                        res.send(err);
                                    }else{
                                        res.send(images);
                                    }
                                })
                            });
                        }
                    });
                }
            });
        });
    router.route('/userImage')
        .get(function(req,res) {
            User.findOne({username: {$regex: new RegExp("^" + req.user.username, "i")}},'image_path name', function (err, usr) {
                if (err) {
                    logger.error(err);
                    res.send(err)
                }
                else {
                    res.json(usr);
                }
            })
        });
    router.route('/userHomeSearch/')
        .post(function(req,res){
            var data=req.body.data;
            var arr_of_items=[Products,Multimedia,Quizes,Content,Events];
            var ObjectOfResults={};
            var checker=0;
            getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                if(err){
                    res.send(err);
                }else {
                    var forGroups = nonSpecificGroupsIds;
                    if (req.body.specialGroupSelected) {
                        forGroups.push(req.body.specialGroupSelected);
                    }
                    console.log(forGroups);
                    async.each(arr_of_items, function (item, callback) {
                        item.search({

                            query_string: {
                                query: data + '~5',
                                default_operator: 'AND',
                                boost: '1.2',
                                analyze_wildcard: true

                            }

                        },{hydrate: true,hydrateOptions:{find: {groupsID:{$in:forGroups},enable:true}}}, function(err, results) {
                            if(err)
                            {
                                res.json(err);
                                return;
                            }
                            else
                            {
                                if(results.hits.hits.length===0)
                                    checker+=1;
                                else
                                {
                                    //var myResults=[];
                                    //for(var i=0;i<results.hits.hits.length;i++)
                                    //{
                                    //    if(results.hits.hits[i].groupsID.indexOf(req.user.groupsID)>-1)
                                    //        myResults.push(results.hits.hits[i]);
                                    //}
                                    ObjectOfResults[item.modelName]=results.hits.hits;
                                }

                            }


                            callback();
                        });
                    }, function (err) {
                        if(err)
                            res.json(err);
                        else
                        {
                            if(checker===5)
                                res.json({answer:"Cautarea nu a returnat nici un rezultat!"});
                            else{
                                res.json(ObjectOfResults);
                            }

                        }

                    })
                }
            });
        });
    router.route('/userHomeEvents')
        .post(function (req,res) {
            getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                if(err){
                    res.send(err);
                }else {
                    var forGroups = nonSpecificGroupsIds;
                    if (req.body.specialGroupSelected) {
                        forGroups.push(req.body.specialGroupSelected);
                    }
                    Events.find({groupsID: {$in: forGroups}, start: {$gte: new Date()}, enable: {$ne: false}}).sort({start: 1}).exec(function (err, events) {
                        if(err){
                            res.send(err);
                        }else{
                            res.json(events);
                        }
                    });
                }
            });

        });

    router.route('/userHomeMultimedia')
        .post(function (req,res) {
            getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                if(err){
                    res.send(err);
                }else {
                    var forGroups = nonSpecificGroupsIds;
                    if (req.body.specialGroupSelected) {
                        forGroups.push(req.body.specialGroupSelected);
                    }
                    Multimedia.find({groupsID: {$in: forGroups}, enable: {$ne: false}}, function (err, multimedia) {
                        if(err){
                            res.send(err);
                        }else{
                            res.json(multimedia);
                        }
                    });
                }
            });

        });

    router.route('/userHomeNews')

        .post(function(req, res) {
            var specialGroupSelected = req.body.specialGroupSelected;
            getUserContent(req.user, {$in: [1,2]}, specialGroupSelected, 4, "last_updated", function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/userHomeScientific')

        .post(function(req, res) {
            var specialGroupSelected = req.body.specialGroupSelected;
            getUserContent(req.user, 3, specialGroupSelected, 4, "last_updated", function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/products')

    .get(function(req, res) {
        Products.find(function(err, cont) {
            if(err) {
                res.send(err);
            }

            res.json(cont);
        });
    });

    router.route('/products/:id')

        .get(function(req, res) {
            Products.findById(req.params.id, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                else
                    res.json(cont);
            })
        });

    router.route('/products/productsByArea')

        .post(function(req, res) {

            var test = req.body.id.toString();
            if(test!=0)
            {
                getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                    if(err){
                        res.send(err);
                    }else {
                        var forGroups = nonSpecificGroupsIds;
                        if (req.body.specialGroup) {
                            forGroups.push(req.body.specialGroup);
                        }
                        Therapeutic_Area.find({_id:test}).exec(function(err,response){
                            var TArea= response[0];
                            if(TArea.has_children==true)
                            {
                                Therapeutic_Area.find({$or: [{_id:req.body.id},{"therapeutic-areasID": {$in :[test]}}]}).exec(function(err,response){
                                    getStringIds(response, function(ids){
                                    Products.find({"therapeutic-areasID": {$in :ids},groupsID: {$in: forGroups}}, function(err, cont) {
                                        if(err) {
                                            res.send(err);
                                        }
                                        else
                                        {
                                            res.json(cont);
                                        }
                                    })
                                })
                                });

                            }
                            else
                            {
                                Products.find({"therapeutic-areasID": {$in :[test]},groupsID: {$in: forGroups}}, function(err, cont) {
                                    if(err) {
                                        res.send(err);
                                    }
                                    else
                                    {
                                        res.json(cont);
                                    }
                                })
                            }
                        });
                        //get allowed articles for user

                    }});
            }
            else
            {
                getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                    if(err){
                        res.send(err);
                    }else {
                        var forGroups = nonSpecificGroupsIds;
                        if (req.body.specialGroup) {
                            forGroups.push(req.body.specialGroup);
                        }
                        //get allowed articles for user
                        Products.find({groupsID: {$in: forGroups}}, function(err, cont) {
                            if(err) {
                                res.send(err);
                            }
                            else
                            {
                                res.json(cont);
                            }
                        })
                    }});
            }
        });

    router.route('/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });
    router.route('/admin/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });
    router.route('/calendar/getEvents/')
        .post(function(req,res) {
            getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                if(err){
                    res.send(err);
                }else{
                    var forGroups = nonSpecificGroupsIds;
                    if(req.body.specialGroup){
                        forGroups.push(req.body.specialGroup);
                    }
                    //get allowed articles for user
                    if(forGroups.length==1)
                    {
                        Events.find({groupsID: {$in: forGroups},groupsID:{$size: 1},enable: true}).sort({start : 1}).limit(50).exec(function (err, cont) {
                            if (err) {
                                res.send(err);
                            }
                            else
                                res.json(cont);
                        })
                    }
                    else
                    {
                        Events.find({groupsID: {$in: forGroups},enable: true}).sort({start : 1}).limit(50).exec(function (err, cont) {
                            if (err) {
                                res.send(err);
                            }
                            else
                                res.json(cont);
                        })
                    }

                }
            })
        });
    router.route('/calendar/:id')
        .get(function(req,res){
            Events.findById(req.params.id,function(err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });

        });
    router.route('/multimedia2/:idd')
        .get(function(req,res){
            Multimedia.findById(req.params.idd,function(err, cont) {
                if(err) {
                    res.json(err);
                }
                else
                res.json(cont);
            });

        });
    router.route('/multimedia')
        .get(function(req,res) {
            Multimedia.find({groupsID: {$in: req.user.groupsID}}).exec(function (err, responses) {
                if (responses.length == 0)
                    res.send([{"message": "Nu ai acces la materiale!"}]);
                else {
                    res.json(responses);

                }
            })
        });
    router.route('/multimedia/multimediaByArea')
        .post(function(req,res){
            console.log(req.body);
        var findObj={};
            if(req.body.id!=0)
                findObj['therapeutic-areasID'] = {$in: [req.body.id]};
            //find all by area

            if(req.user.groupsID.length==0)
            {
                res.json([{"message":"Pentru a putea vedea materialele va rugam frumos sa va accesati profilul si sa adaugati o poza cu dovada ca sunteti medic!"}])
            }
            else {
                getNonSpecificUserGroupsIds(req.user, function (err, nonSpecificGroupsIds) {
                    if(err){
                        res.send(err);
                    }else {
                        var forGroups = nonSpecificGroupsIds;
                        if (req.body.specialGroupSelected) {
                            forGroups.push(req.body.specialGroupSelected);
                        }
                        findObj['groupsID']={$in:forGroups};
                        console.log(findObj);
                        if(req.body.id==0)
                        {
                            Multimedia.find(findObj, function (err, multimedia) {
                                if (err) {
                                    console.log(err);
                                    res.json(err);
                                } else {
                                    console.log(multimedia);
                                    if (multimedia.length == 0) {
                                        res.json([{"message": "Nu exista materiale multimedia disponibile pentru grupul dumneavoastra!"}])
                                    }
                                    else
                                        res.json(multimedia);
                                }
                            });
                        }
                        else
                        {
                            Therapeutic_Area.find({_id:req.body.id}).exec(function(err,response){
                                var TArea=response[0];
                                if(TArea.has_children==true)
                                {
                                    Therapeutic_Area.find({"therapeutic-areasID": {$in :[req.body.id]}}).exec(function(err,response){
                                        var children=response;
                                        getStringIds(children, function(ids){
                                            console.log(ids);
                                            console.log(forGroups);
                                            findObj['therapeutic-areasID'] = {$in: ids};
                                            Multimedia.find(findObj, function (err, multimedia) {
                                                if (err) {
                                                    console.log(err);
                                                    res.json(err);
                                                } else {
                                                    console.log(multimedia);
                                                    if (multimedia.length == 0) {
                                                        res.json([{"message": "Nu exista materiale multimedia disponibile pentru grupul dumneavoastra!"}])
                                                    }
                                                    else
                                                        res.json(multimedia);
                                                }
                                            });
                                        })
                                    });

                                }
                                else
                                {
                                    Multimedia.find(findObj, function (err, multimedia) {
                                        if (err) {
                                            console.log(err);
                                            res.json(err);
                                        } else {
                                            console.log(multimedia);
                                            if (multimedia.length == 0) {
                                                res.json([{"message": "Nu exista materiale multimedia disponibile pentru grupul dumneavoastra!"}])
                                            }
                                            else
                                                res.json(multimedia);
                                        }
                                    });
                                }
                            });
                        }

                        //get allowed articles for user


                    }})

            }
        });

    router.route('/slidesByMultimediaId/:multimedia_id')
        .get(function(req,res){
            Multimedia.find({_id: req.params.multimedia_id, groupsID: {$in: req.user.groupsID}, enable: {$ne: false}}, function (err, multimedia) {
                if(err){
                    res.send(err);
                }else{
                    if(multimedia[0]){
                        Slides.find({_id: {$in: multimedia[0]._doc.slidesID}}).sort({no_of_order: 1}).exec(function (err, slides) {
                            if(err){
                                res.send(err);
                            }else{
                                res.json(slides);
                            }
                        });
                    }else{
                        res.send(err);
                    }

            }

        })});
    var getQuizesIds = function (arr, cb) {
        var ret = [];
        async.each(arr, function (item, callback) {
            if(item.quizesID[0])
                ret.push(item.quizesID[0]);
            callback();
        }, function (err) {
            cb(ret);
        });
    };

   router.route('/quizes')

        .get(function(req,res){
            var resp = [];
            Multimedia.find({groupsID: {$in: req.user.groupsID}}).exec(function(err,responses){
                if(responses.length==0)
                    res.json([{"message":"Pentru a putea vedea materialele va rugam frumos sa va accesati profilul si sa adaugati o poza cu dovada ca sunteti medic!"}]);
                else {
                    getQuizesIds(responses,function(arrayIdQuizes){
                        Quizes.find({_id:{$in:arrayIdQuizes}}, function (err, quizes) {
                            if(err){
                                res.send(err);
                            }else{
                                res.send(quizes);
                            }
                        });
                    });
                }
            });
        });
    router.route('/quizes/:id/questions/:idd')
        .get(function(req,res) {
            Quizes.find({_id: req.params.id}, function (err, testR) {
                //console.log(req.params.id);
                if (err) {
                    logger.error(err);
                    res.send(err);
                    return;
                }
                else {
                    var qa = {};
                    qa["test"] = testR;
                    Questions.find({_id: req.params.idd}, function (err2, cont) {
                        if (err) {
                            logger.error(err);
                            res.send(err);
                            return;
                        }
                        else {
                            qa["questions"] = cont;
                            Answers.find({_id: {$in:qa["questions"][0].answersID}},function(err,cont2) {
                                if(err)
                                {
                                    res.send(err);
                                    return;
                                }
                                else {
                                    qa["answers"] = cont2;
                                    res.send(qa);
                                }
                            });
                        }
                    })
                }
            })
        });
    router.route('/quizes/:id')
        .get(function(req,res) {
            Quizes.find({_id: req.params.id}, function (err, testR) {
                //console.log(req.params.id);
                if (err) {
                    logger.error(err);
                    res.send(err);
                    return;
                }
                else
                    res.json(testR[0]);
            })
        });
    router.route('/multimediaBefore/:id')
        .get(function(req,res){
            var id=[];
            id.push(req.params.id);
            Multimedia.find({quizesID: {$in:id}},function(err, cont) {
                if(err) {
                    console.log(err);
                    res.json(err);
                }
                else
                {
                    res.json(cont[0]);
                }

            });

        });
    router.route('/user')
        .get(function(req,res){
            User.find(function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    //console.log(result);
                    res.json(result);
                }
            });
        })

        .put(function(req, res) {
        //console.log(req.user.username);
        User.findOne({ username :  { $regex: new RegExp("^" + req.user.username, "i") }},function(err,usr){
            if(err) {
                logger.error(err);
                res.send(err)
            }
            else {
                //console.log(req.body.score_obtained);
                usr.points += req.body.score;
                req.user.points=usr.points;
                usr.save(function(err){
                    if(err)
                        res.send(err);
                })
            }
        }) ;
    });
    router.route('admin/user')
        .get(function(req,res){
            User.find(function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    //console.log(result);
                    res.json(result);
                }
            });
        })
        .post(function(req,res){
            var newuser = new User(); 		// create a new instance of the Bear model
            therapeutic.has_children = req.body.has_children;  // set the bears name (comes from the request)
            therapeutic.last_updated=req.body.last_updated ;
            therapeutic.name= req.body.name   ;
            therapeutic.enabled= req.body.enabled  ;
            therapeutic['therapeutic-areasID']= req.body['therapeutic-areasID'];
            therapeutic.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Area created!' });
            });
    });
    router.route('admin/user/:id')
        .get(function(req,res){
            User.findById(req.params.id,function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    //console.log(result);
                    res.json(result);
                }
            });
        });

    app.use('/api', router);
};
