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
var Teste=require('./models/quizes');
var Questions=require('./models/questions');
var Answers = require('./models/answers');
var Slides = require('./models/slides');
var Roles=require('./models/roles');
var PublicContent = require('./models/publicContent');
var PublicCarousel = require('./models/publicCarousel');

var XRegExp  = require('xregexp').XRegExp;

var SHA256   = require('crypto-js/sha256');

var mongoose = require('mongoose');

var AWS = require('aws-sdk');
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
                    console.log(arrayOfGroupsIds);
                    callback(null, content);
                }
            });
        }
    });
};

//======================================================================================================================================= routes for admin

module.exports = function(app, sessionSecret, router) {

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
                        console.log(err);
                        res.status(403).end();
                    }else{
                        var roles = data[0].rolesID;
                        //now get roles
                        Roles.find({_id: {$in: roles}}, function (err, data) {
                            if(err){
                                console.log(err);
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
            console.log(e);
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
                    console.log(err);
                    res.status(404).end();
                }else{
                    res.json(data);
                }
            });
        });

    router.route('/admin/utilizatori/grupuri')

        .get(function(req, res) {
            UserGroup.find({}, {display_name: 1, description: 1} ,function(err, cont) {
                if(err) {
                    console.log(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/utilizatori/groupDetails/:id')

        .get(function(req, res) {
            UserGroup.find({_id: req.params.id}, function(err, cont) {
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

    router.route('/admin/utilizatori/utilizatori')

        .get(function(req, res) {
            User.find({}, {username: 1}).limit(0).exec(function(err, cont) {
                if(err) {
                    console.log(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/utilizatori/utilizatoriDinGrup/:id')

        .get(function(req, res) {
            var id = req.params.id;
            User.find({groupsID: {$in:[id]}}, {username: 1}).limit(0).exec(function(err, cont) {
                if(err) {
                    console.log(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/utilizatori/addGroup')
        //used for both creating new groups and editing existing ones

        .post(function (req, res) {
            var ans = {};
            var data = req.body.data;
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
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
                    //add group
                    new UserGroup(data.group).save(function (err, inserted) {
                        if(err){
                            console.log(err);
                            ans.error = true;
                            ans.message = "Eroare la salvarea grupului. Va rugam verificati campurile";
                            res.json(ans);
                        }else{
                            console.log(inserted);
                            var idGroupInserted = inserted._id.toString();
                            //update users to point to this group
                            //extract id's from users
                            var ids = [];
                            for(var i=0; i<data.users.length; i++){
                                ids.push(data.users[i]._id);
                            }
                            console.log(ids);
                            connectEntitiesToEntity(ids, User, "groupsID", idGroupInserted, function (err, result) {
                                if(err){
                                    console.log(err);
                                    ans.error = true;
                                    ans.message = "Eroare la adaugarea utilizatorilor noi in grup.";
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
            }
        });

    router.route('/admin/utilizatori/changeGroupLogo')
        .post(function (req,res) {
            var data = req.body.data;
            UserGroup.update({_id:data.id}, {image_path: data.path}, function (err, wRes) {
                if(err){
                    console.log("Error at usergroup change logo. Group id = "+data.id+"; Key = "+data.path);
                    res.json({error:true});
                }else{
                    res.json({error:false, updated:wRes});
                }
            });
        });

    router.route('/admin/utilizatori/editGroup')
        //used for both creating new groups and editing existing ones

        .post(function (req, res) {
            var ans = {};
            var data = req.body.data;
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
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
                            console.log(err);
                            ans.error = true;
                            ans.message = "Eroare la salvarea grupului. Va rugam verificati campurile";
                            res.json(ans);
                        }else{
                            console.log(Wres);
                            //now we need to add some users
                            //first disconnect preexisting users from group, just in case this is an editGroup operation
                            disconnectAllEntitiesFromEntity(User, "groupsID", data.id, function (err, result) {
                                if(err){
                                    console.log(err);
                                    ans.error = true;
                                    ans.message = "Eroare la stergerea utilizatorilor vechi din grup.";
                                }else{
                                    //update users to point to this group
                                    //extract id's from users
                                    var ids = [];
                                    for(var i=0; i<data.users.length; i++){
                                        ids.push(data.users[i]._id);
                                    }
                                    console.log(ids);
                                    connectEntitiesToEntity(ids, User, "groupsID", data.id, function (err, result) {
                                        if(err){
                                            console.log(err);
                                            ans.error = true;
                                            ans.message = "Eroare la adaugarea utilizatorilor noi in grup.";
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

    router.route('/admin/utilizatori/deleteGroup')

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
                                                    console.log(err);
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

    router.route('/admin/utilizatori/test')

        .post(function (req, res) {
            res.status(200).end();
        });

    router.route('/admin/utilizatori/continutPublic/getAllContent')

        .get(function(req, res) {
            PublicContent.find({}, {title: 1, author: 1, text:1, type:1, 'therapeutic-areasID':1, enable:1} ,function(err, cont) {
                if(err) {
                    console.log(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/utilizatori/continutPublic/getById/:id')

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

    router.route('/admin/utilizatori/continutPublic/toggleContent')

        .post(function(req, res) {
            PublicContent.update({_id: req.body.data.id}, {enable: !req.body.data.isEnabled}, function (err, wRes) {
                if(err){
                    res.send({error: true});
                }else{
                    res.send({error: false});
                }
            });
        });

    router.route('/admin/utilizatori/continutPublic/addContent')

        .post(function(req, res) {
            var data = req.body.data;
            var ans = {};
            //validate author and title
            var patt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
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

    router.route('/admin/utilizatori/continutPublic/editContent')

        .post(function(req, res) {
            var data = req.body.data.toUpdate;
            var id = req.body.data.id;
            var ans = {};
            //validate author and title
            var patt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
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

    router.route('/admin/utilizatori/continutPublic/deleteContent')

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
                        console.log(image);
                        console.log(file);
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

    router.route('/admin/utilizatori/continutPublic/changeImageOrFile')
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
                        console.log("Error at content "+data.type+"_path; id = "+data.id+"; Key = "+data.path);
                        res.json({error:true});
                    }else{
                        res.json({error:false, updated:wRes});
                    }
                });
            }
        });

    router.route('/admin/utilizatori/carouselPublic/getAllImages')

        .get(function(req, res) {
            PublicCarousel.find({}, function(err, cont) {
                if(err) {
                    console.log(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/utilizatori/carouselPublic/contentByType/:type')

        .get(function(req, res) {
            PublicContent.find({type: req.params.type}, {title: 1, type:1}).sort({title: 1}).exec(function(err, cont) {
                if(err) {
                    console.log(err);
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/admin/utilizatori/carouselPublic/addImage')

        .post(function(req, res) {
            var data = req.body.data.toAdd;
            var ext = req.body.data.extension;
            var ans = {};
            //validate title and description
            var patt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
            if(!patt.test(data.title.toString()) || !patt.test(data.description.toString())){
                ans.error = true;
                ans.message = "Titlul si descrierea sunt obligatorii (minim 3 caractere)";
                res.json(ans);
            }else{
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
            }
        });

    router.route('/admin/utilizatori/carouselPublic/toggleImage')

        .post(function(req, res) {
            PublicCarousel.update({_id: req.body.data.id}, {enable: !req.body.data.isEnabled}, function (err, wRes) {
                if(err){
                    res.send({error: true});
                }else{
                    res.send({error: false});
                }
            });
        });

    router.route('/admin/utilizatori/carouselPublic/deleteImage')

        .post(function (req, res) {
            var image_id = req.body.id;
            //find image to remove from amazon
            PublicCarousel.find({_id: image_id}, {image_path: 1}, function (err, image) {
                if(err){
                    res.json({error: true, message: err});
                }else{
                    if(image[0]){
                        var imageS3 = image[0].image_path;
                        console.log(imageS3);
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

    router.route('/admin/utilizatori/carouselPublic/editImage')

        .post(function(req, res) {
            var data = req.body.data.toUpdate;
            var id = req.body.data.id;
            var ans = {};
            //validate title and description
            var patt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
            if(!patt.test(data.title.toString()) || !patt.test(data.description.toString())){
                ans.error = true;
                ans.message = "Titlul si descrierea sunt obligatorii (minim 3 caractere)";
                res.json(ans);
            }else{
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
            }
        });

    router.route('/admin/utilizatori/carouselPublic/getById/:id')

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


    router.route('/admin/products')
        .get(function(req, res) {
            Products.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        })
        .post(function(req, res) {

            var product = new Products(); 		// create a new instance of the Bear model
            product.name = req.body.name;  // set the bears name (comes from the request)
            product.description=req.body.description ;
            product.enable= req.body.enable     ;
            product.file_path= req.body.file_path  ;
            product.image_path= req.body.image_path ;
            product.last_updated=req.body.last_updated;
            product['therapeutic-areasID']= req.body['therapeutic-areasID'] ;
            product.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Product created!' });
            });

        });
    router.route('/admin/products/:id')
        .get(function(req, res) {
            Products.findById(req.params.id, function(err, product) {
                if (err)
                    res.send(err);
                res.json(product);
            });
        })
        .put(function(req, res) {

            Products.findById(req.params.id, function(err, product) {

                if (err)
                    res.send(err);

                product.name = req.body.name;  // set the bears name (comes from the request)
                product.description=req.body.description ;
                product.enable= req.body.enable     ;
                product.file_path= req.body.file_path  ;
                product.image_path= req.body.image_path ;
                product.last_updated=req.body.last_updated;
                product['therapeutic-areasID']= req.body['therapeutic-areasID'] ;
                // save the bear
                product.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Product updated!' });
                });

            });
        })
        .delete(function(req, res) {
            Products.remove({
                _id: req.params.id
            }, function(err,prod) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted' });
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
                    UserGroup.find({}, {display_name: 1} ,function(err, cont2) {
                        if(err) {
                            console.log(err);
                            res.send(err);
                        }
                        contents['groups']=cont2;
                        console.log(contents);
                        res.json(contents);
                    });
                }
            });
        })
        .post(function(req, res) {
            console.log(req);
            var content = new Content(); 		// create a new instance of the Bear model
            content.title = req.body.title;  // set the bears name (comes from the request)
            content.author=req.body.author ;
            content.description= req.body.description     ;
            content.text= req.body.text  ;
            content.type= req.body.type ;
            content.last_updated=req.body.last_updated;
            content.version= req.body.version ;
            content.enable=req.body.enable;
            content.image_path=req.body.image_path;
            content.groupsID=req.body.groupsID;
            console.log(content.toString());
            console.log(typeof content);
            content.save(function(err,result) {
                if (err)
                {
                    console.log(err);
                    res.send(err);
                }
                else{
                    console.log(result);
                    res.json({ message: 'Content created!' });
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
                }
                content.title = req.body.title;  // set the bears name (comes from the request)
                content.author=req.body.author ;
                content.description= req.body.description     ;
                content.text= req.body.text  ;
                content.type= req.body.type ;
                content.last_updated=req.body.last_updated;
                content.version= req.body.version ;
                content.enable=req.body.enable;
                content.image_path=req.body.image_path;
                content.groupsID=req.body.groupsID;
                console.log(content);
                content.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Content updated!' });
                });

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

    router.route('/admin/events')

        .get(function(req, res) {
            Events.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        })
        .post(function(req, res) {

            var event = new Events(); 		// create a new instance of the Bear model
            event.description = req.body.description;  // set the bears name (comes from the request)
            event.enable=req.body.enable ;
            event.end= req.body.end     ;
            event.groupsID= req.body.groupsID  ;
            event.last_updated= req.body.last_updated ;
            event.name=req.body.name;
            event.place= req.body.place ;
            event.privacy=req.body.privacy;
            event.start=req.body.start;
            event.type=req.body.type;

            event.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Event created!' });
            });

        });
    router.route('/admin/events/:id')

        .get(function(req, res) {
            Events.find({_id:req.params.id}, function(err, cont) {
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

            Events.findById(req.params.id, function(err, event) {

                if (err)
                    res.send(err);

                event.description = req.body.description;  // set the bears name (comes from the request)
                event.enable=req.body.enable ;
                event.end= req.body.end     ;
                event.groupsID= req.body.groupsID  ;
                event.last_updated= req.body.last_updated ;
                event.name=req.body.name;
                event.place= req.body.place ;
                event.privacy=req.body.privacy;
                event.start=req.body.start;
                event.type=req.body.type;
                event.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'Event updated!' });
                });

            });
        })
        .delete(function(req, res) {
            Events.remove({
                _id: req.params.id
            }, function(err,cont) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted!' });
            });
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


    router.route('/admin/teste')

        .get(function(req, res) {
            Teste.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        })
        .post(function(req, res) {

            var test = new Teste(); 		// create a new instance of the Bear model
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
    router.route('/admin/teste/:id')

        .get(function(req, res) {
            Teste.find({_id:req.params.id}, function(err, cont) {
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

            Teste.findById(req.params.id, function(err, test) {

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
            Teste.remove({
                _id: req.params.id
            }, function(err,cont) {
                if (err)
                    res.send(err);

                res.json({ message: 'Successfully deleted!' });
            });
        });


    router.route('/admin/arii')

        .get(function(req, res) {
            Therapeutic_Area.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

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
    router.route('/admin/arii/:id')

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

    //==================================================================================================================================== routes for user

    router.route('/groups/specialGroups')

        .get(function(req, res) {
            UserGroup.find({_id: {$in: req.user.groupsID}, content_specific: {$exists:true, $ne: false}}, function(err, groups) {
                if(err) {
                    res.send(err);
                }
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
            getUserContent(req.user, cType, specialGroupSelected, null, null, function (err, content) {
                if(err){
                    res.send(err);
                }else{
                    res.json(content);
                }
            });
        });

    router.route('/userdata')

        .get(function(req, res) {
            var user = req.user;
            var userCopy = {};
            userCopy['name'] = user.name;
            userCopy['image_path'] = user.image_path;
            userCopy['phone'] = user.phone;
            userCopy['points'] = user.points;
            userCopy['subscription'] = user.subscription;
            userCopy['username'] = user.username;
            userCopy['therapeutic-areasID'] = user['therapeutic-areasID'];
            userCopy['citiesID'] = user.citiesID;
            Cities.find({_id:user.citiesID[0]}, function (err, city) {
                if(err){
                    res.send(err);
                }
                if(city[0]){
                    userCopy['city_id'] = city[0]._id;
                    userCopy['city_name'] = city[0].name;
                    Counties.find({citiesID: {$in: [userCopy['city_id'].toString()]}}, function (err, county) {
                        if(err){
                            res.send(err);
                        }
                        if(county[0]){
                            userCopy['county_id'] = county[0]._id;
                            userCopy['county_name'] = county[0].name;
                            if(user['jobsID']){
                                if(user['jobsID'][0]){
                                    var jobId = user.jobsID[0];
                                    Job.find({_id:jobId}, function (err, job) {
                                        if(err){
                                            res.send(err);
                                        }else{
                                            userCopy.job = job;
                                            res.json(userCopy);
                                        }
                                    })

                                }else{
                                    res.json(userCopy);
                                }

                            }else{
                                res.json(userCopy);
                            }
                        }else{
                            res.send(err);
                        }
                    });
                }else{
                    res.send(err);
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
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
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
                    console.log(newData.therapeuticAreas);
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
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
            var numberPatt = new XRegExp('^[0-9]{1,5}$');
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

    router.route('/changeEmail')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            //check if mail is valid
            var mailPatt = new XRegExp('^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,4}$', 'i');
            if(!mailPatt.test(userData.mail.toString())){
                ans.error = true;
                ans.message = "E-mail invalid";
                res.json(ans);
            }else{
                //check if mail already exists
                User.find({username: userData.mail}, function(err, result){
                    if(err){
                        ans.error = true;
                        ans.message = "Eroare la schimbarea adresei de e-mail";
                        res.json(ans);
                    }else{
                        if(result.length == 0){
                            //check password
                            if(SHA256(userData.pass).toString() === req.user.password){
                                var upd = User.update({_id:req.user._id}, {username: userData.mail}, function () {
                                    if(!upd._castError){
                                        ans.error = false;
                                        ans.message = "Adresa de e-mail a fost modificata";
                                        res.json(ans);
                                    }else{
                                        ans.error = true;
                                        ans.message = "Eroare la schimbarea adresei de e-mail";
                                        res.json(ans);
                                    }
                                });
                            }else{
                                ans.error = true;
                                ans.message = "Parola incorecta";
                                res.json(ans);
                            }
                        }else{
                            ans.error = true;
                            ans.message = "Acest e-mail este deja folosit";
                            res.json(ans);
                        }
                    }
                });
            }
        });

    router.route('/changePassword')
        .post(function (req, res) {
            var ans = {error: true, message:"Server error"};
            var userData = req.body.userData;
            //check if password is correct
            if(SHA256(userData.oldPass).toString() !== req.user.password){
                ans.error = true;
                ans.message = "Parola nu este corecta";
                res.json(ans);
            }else{
                //check if new password length is valid
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
                        var upd = User.update({_id:req.user._id}, {password: SHA256(userData.newPass).toString()}, function () {
                            if(!upd._castError){
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
        });

    router.route('/userHomeEvents')
        .get(function (req,res) {
            Events.find({groupsID: {$in: req.user.groupsID}, start: {$gte: new Date()}, enable: {$ne: false}}).sort({start: 1}).exec(function (err, events) {
                if(err){
                    res.send(err);
                }else{
                    res.json(events);
                }
            });
        });

    router.route('/userHomeMultimedia')
        .get(function (req,res) {
            Multimedia.find({groupsID: {$in: req.user.groupsID}, enable: {$ne: false}}, function (err, multimedia) {
                if(err){
                    res.send(err);
                }else{
                    res.json(multimedia);
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

                res.json(cont);
            })
        });

    router.route('/products/productsByArea/:id')

        .get(function(req, res) {
            var test = new Array(req.params.id);
            if(test[0]!=0)
            {
                Products.find({'therapeutic-areasID': {$in :test}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                 console.log(cont);
                res.json(cont);
            })}
            else
            {
                Products.find(function(err, cont) {
                    if(err) {
                        res.send(err);
                    }

                    res.json(cont);
                });
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

    router.route('/calendar')
        .get(function(req,res) {
            User.findOne({username: {$regex: new RegExp("^" + req.user.username, "i")}}, function (err, usr) {
                if (err) {
                    console.log(err);
                    res.send(err)
                }
                else {
                    Events.find({groupsID: {$in: usr.groupsID}}, function (err, cont) {
                        if (err) {
                            res.send(err);
                        }
                        res.json(cont);
                    }).limit(50);
                }
            })
        });
    router.route('/calendar/:id')
        .get(function(req,res){
            Events.findById(req.params.id,function(err, cont) {
                if(err) {
                    res.send(err);
                }
                console.log(cont);
                res.json(cont);
            });

        });
    router.route('/multimedia2/:idd')
        .get(function(req,res){
            Multimedia.findById(req.params.idd,function(err, cont) {
                if(err) {
                    res.json(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia')
        .get(function(req,res){
            Multimedia.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia/multimediaByArea/:id')
        .get(function(req,res){
            var findObj = {};
            if(req.params.id!=0) findObj = {'therapeutic-areasID': {$in: [req.params.id]}};
            //find all by area
            Multimedia.find(findObj, function (err, multimedia) {
                if (err) {
                    res.json(err);
                }else{
                    res.json(multimedia);
                }
            });
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

    router.route('/teste')
        .get(function(req,res){
            Teste.find(function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    //console.log(result);
                    res.json(result);
                }
            });
        });
    router.route('/teste/:id/questions/:idd')
        .get(function(req,res) {
            Teste.find({_id: req.params.id}, function (err, testR) {
                //console.log(req.params.id);
                if (err) {
                    console.log(err);
                    res.send(err);
                    return;
                }
                else {
                    var qa = {};
                    qa["test"] = testR;
                    Questions.find({_id: req.params.idd}, function (err2, cont) {
                        if (err) {
                            console.log(err);
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
        })

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
        console.log(req.body.score);
        //console.log(req.user.username);
        User.findOne({ username :  { $regex: new RegExp("^" + req.user.username, "i") }},function(err,usr){
            if(err) {
                console.log(err);
                res.send(err)
            }
            else {
                //console.log(req.body.score_obtained);
                usr.points += req.body.score;
                req.user.points=usr.points;
                console.log(usr);
                usr.save(function(err){
                    if(err)
                        res.send(err);
                })
            }
        }) ;
    });

    app.use('/api', router);
};
