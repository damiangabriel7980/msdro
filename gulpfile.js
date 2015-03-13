var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    AWS = require('aws-sdk'),
    webserver = require('gulp-webserver'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
    mysql = require('mysql'),
    async = require('async'),
    fs = require('fs'),
    readdirR = require('fs-readdir-recursive');

//// sass task
//gulp.task('sass', function () {
//    gulp.src('./assets/styles/**/*.scss')
//        .pipe(sass({
//            noCache: true,
//            style: "expanded",
//            lineNumbers: true,
//            loadPath: './assets/styles/*'
//        }))
//        .pipe(gulp.dest('./assets/styles'))
//        .pipe(notify({
//            message: "You just got super Sassy!"
//        }));
//});
//
//// uglify task
//gulp.task('js', function() {
//    // main app js file
//    gulp.src('./assets/js/app.js')
//        .pipe(uglify())
//        .pipe(concat("app.min.js"))
//        .pipe(gulp.dest('./assets/js/'));
//
//    // create 1 vendor.js file from all vendor plugin code
//    gulp.src('./assets/js/vendor/**/*.js')
//        .pipe(uglify())
//        .pipe(concat("vendor.js"))
//        .pipe(gulp.dest('./assets/js'))
//        .pipe( notify({ message: "Javascript is now ugly!"}) );
//});
//gulp.task('webserver', function() {
//    gulp.src('app')
//        .pipe(webserver({
//            livereload: true,
//            directoryListing: true,
//            open: true
//        }));
//});
//
//gulp.task('watch', function() {
//    // watch scss files
//    gulp.watch('./assets/styles/**/*.scss', function() {
//        gulp.run('sass');
//    });
//
//    gulp.watch('./assets/js/**/*.js', function() {
//        gulp.run('js');
//    });
//});
//
//gulp.task('default', ['sass', 'js', 'watch']);

gulp.task('minify_all', ['minify_css', 'minify_js'], function (callback) {
    callback();
});

gulp.task('minify_css', function () {
    return gulp.src('./public/**/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public'));
});

gulp.task('minify_js', function () {
    return gulp.src(['./public/**/*.js','!./public/components/**/*.*'])
        .pipe(uglify())
        .pipe(gulp.dest('./public'));
});

gulp.task('generate_manifests', ['minify_all'], function () {
    var componentsPaths = fs.readFileSync('config/cached_components.txt');
    var commonData = "CACHE MANIFEST\n#"+Date.now().toString()+"\n\nNETWORK:\n*\n\nCACHE:\n"+componentsPaths+"\n";
    var publicFolder = "public";
    var prefixes = [
        ['public', 'javascript/public'],
        ['medic', 'javascript/medic']
    ];
    for(var p=0; p<prefixes.length; p++){
        var common_path = prefixes[p][1];
        var paths = readdirR(publicFolder+"/"+common_path);
        var data = "";
        for(var i=0; i<paths.length;i++){
            data = data.concat(common_path+"/"+paths[i]+"\n");
        }
        fs.writeFileSync('public/manifest_'+prefixes[p][0]+'.mf', commonData+data);
    }
});

gulp.task('run', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'development',
            'AWS_ACCESS_KEY_ID': 'AKIAIM6KJKTQ3DODHQPA',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_staging', ['minify_all'], function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'staging',
            'AWS_ACCESS_KEY_ID': 'AKIAIM6KJKTQ3DODHQPA',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_staging_no_min', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'staging',
            'AWS_ACCESS_KEY_ID': 'AKIAIM6KJKTQ3DODHQPA',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_production', ['minify_all'], function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'production',
            'AWS_ACCESS_KEY_ID': 'AKIAIM6KJKTQ3DODHQPA',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_production_no_min', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'production',
            'AWS_ACCESS_KEY_ID': 'AKIAIM6KJKTQ3DODHQPA',
            'AWS_SECRET_ACCESS_KEY': 'EZAVbfuV05z5oFYDuB4KlpxSLMVtI7YYyqLKMvou'
        }
    })
});

gulp.task('replaceUsers', function () {
    var conversionArrays = {
        groupsID: {
            "54f58b16c3ee70fa20571e46": "54d12b2968a61a964a33523d",
            "54f58b16c3ee70fa20571e47": "54d12b2968a61a964a33523e",
            "54f58b16c3ee70fa20571e48": "54d12b2968a61a964a335241",
            "54f58b16c3ee70fa20571e49": "54d12b2968a61a964a335242",
            "54f58b16c3ee70fa20571e4a": "54d12b2968a61a964a335243",
            "54f58b16c3ee70fa20571e4b": "54d12b2968a61a964a335246"
        }
    };

    var conversionAttributes = {
        profession: {
            "54f58b16c3ee70fa20571e44": ObjectID("54d12b2968a61a964a33523b"),
            "54f58b16c3ee70fa20571e45": ObjectID("54d12b2968a61a964a33523c")
        }
    };

    var mongoAddress = 'mongodb://msdprod:PWj4zOt_qX9oRRDH8cwiUqadb@81.196.104.4:2941/MSDQualitance';

    MongoClient.connect(mongoAddress, function (err, db) {
        db.collection('users').find({}).toArray(function (err, users) {
            if(err){
                console.log('FAIL');
                db.close();
            }else{
                var updateCount = 0;
                async.each(users, function (user, callback) {
                    var newProfession = null;
                    var newGroups = [];
                    if(user.profession){
                        //console.log(conversionAttributes.profession[user.profession.toString()]);
                        newProfession = conversionAttributes.profession[user.profession.toString()];
                    }
                    if(user.groupsID){
                        for(var i=0; i<user.groupsID.length; i++){
                            //console.log(conversionArrays.groupsID[user.groupsID[i]]);
                            newGroups.push(conversionArrays.groupsID[user.groupsID[i]]);
                        }
                        //console.log(newGroups);
                    }
                    db.collection('users').update({_id: user._id}, {$set: {profession: newProfession, groupsID: newGroups}}, function (err, wres) {
                        if(err){
                            callback(err);
                        }else{
                            updateCount++;
                            callback();
                        }
                    });
                }, function (err) {
                    if(err){
                        console.log(err);
                    }
                    console.log("Updated "+updateCount+" users");
                    db.close();
                });
            }
        });
    });
});

gulp.task('breakGroups', function () {

    var newGroupsName = 'groups'; //use another collection for testing

    var toProfessions = ["Medic", "Farmacist"]; //this CANNOT be customised yet

    var ignoreGroups = ["Grup predefinit"];

    var noProfessionAssignUsers = "Farmacist";
    var noProfessionAssignOthers = "Medic";

    var usersToUpdate = {};

    var mongoAddress = 'mongodb://localhost:27017/MSDdev';

    //connect to mongo
    MongoClient.connect(mongoAddress, function (err, db) {

        //======================================================= FUNCTIONS

        var copyGroups = function (masterCallback) {
            db.collection('groups').find({}).toArray(function (err, groups) {
                if(err){
                    console.log(err);
                }else{
                    var associationsOldGroups = {};
                    for(var i=0; i<groups.length; i++){
                        associationsOldGroups[groups[i]._id.toString()] = groups[i];
                    }
                    masterCallback(groups, associationsOldGroups);
                }
            });
        };

        var getGroupById = function (groupsArray, id) {
            for(var i=0; i<groupsArray.length; i++){
                if(groupsArray[i]._id.toString() == id.toString()){
                    return groupsArray[i];
                }
            }
            return null;
        };

        var createProfessions = function (masterCallback) {
            var newProfessions = [];
            //create the professions and store a correspondence of id -> name for them
            async.each(toProfessions, function (profession, callback) {
                db.collection('professions').insert({display_name: profession}, function (err, inserted) {
                    if(err){
                        console.log(err);
                    }else{
                        newProfessions.push(inserted[0]);
                        callback();
                    }
                });
            }, function (err) {
                if(err){
                    console.log(err);
                }else{
                    masterCallback(newProfessions);
                }
            });
        };

        var separateGroups = function (arrayOfGroups, masterCallback) {
            var separatedProfessions = [];
            var separatedGroups = [];
            for(var i=0; i<arrayOfGroups.length; i++){
                var name = arrayOfGroups[i].display_name;
                if(toProfessions.indexOf(name) > -1){
                    separatedProfessions.push(arrayOfGroups[i]);
                }else{
                    separatedGroups.push(arrayOfGroups[i]);
                }
            }
            masterCallback(separatedGroups, separatedProfessions);
        };

        var createNewGroups = function(newProfessions, separatedGroups, masterCallback) {
            //add defaults
            separatedGroups.push({
                display_name: "Default"
            });

            var newProAssignations = {};

            async.each(newProfessions, function (profession, cbProfessions) {
                async.each(separatedGroups, function (group, cbGroups) {
                    if(ignoreGroups.indexOf(group.display_name) > -1){
                        cbGroups();
                    }else{
                        db.collection(newGroupsName).insert({
                            display_name: group.display_name,
                            description: group.description,
                            image_path: group.image_path,
                            content_specific: group.display_name!="Default"?group.content_specific:false,
                            restrict_CRUD: group.display_name=="Default",
                            profession: profession._id
                        }, function (err, inserted) {
                            if(err){
                                cbGroups(err);
                            }else{
                                if(profession._id.toString() == inserted[0].profession.toString()){
                                    if(!newProAssignations[profession.display_name]) newProAssignations[profession.display_name] = [];
                                    newProAssignations[profession.display_name].push(inserted[0]);
                                    cbGroups();
                                }else{
                                    cbGroups("Eroare la asignare profesie - grup");
                                }
                            }
                        });
                    }
                }, function (err) {
                    if(err){
                        cbProfessions(err);
                    }else{
                        cbProfessions();
                    }
                })
            }, function (err) {
                if(err){
                    console.log(err);
                }else{
                    masterCallback(newProAssignations);
                }
            })
        };

        var findDocumentByDisplayName = function(arr, name){
            for(var i=0; i<arr.length; i++){
                if(arr[i].display_name == name) return arr[i];
            }
            return null;
        };

        var getIdsToAdd = function (documents) {
            var ret = [];
            for(var i=0; i<documents.length; i++){
                ret.push(documents[i]._id.toString());
            }
            return ret;
        };

        var refactorConnections = function (associationsOldGroups, newProAssignations, callbackMaster) {
            var arrayConnected = ["articles", "calendar-events", "multimedia", "users","products"];
            async.each(arrayConnected, function (connected, callbackConnectedAll) {
                db.collection(connected).find({}).toArray(function (err, documents) {
                    if(err){
                        callbackConnectedAll(err);
                    }else{
                        async.each(documents, function (document, callbackEachDocument) {
                            var oldConnections = document['groupsID'];
                            if(!oldConnections) {
                                callbackEachDocument();
                            }else if(oldConnections.length == 0){
                                callbackEachDocument();
                            }else{
                                console.log("========================== START ENTRY");
                                console.log("Collection: "+connected);
                                console.log("Document id: "+document._id);
                                var populatedGroupsID = [];
                                //populate groupsID with old groups
                                for(var i=0; i<oldConnections.length; i++){
                                    if(associationsOldGroups[oldConnections[i]]){
                                        populatedGroupsID.push(associationsOldGroups[oldConnections[i].toString()]);
                                    }
                                }

                                console.log("groupsID:");
                                console.log(populatedGroupsID);
                                console.log("==========================");

                                //will replace the old connections in groupsID with the new connections
                                var newConnections = [];

                                separateGroups(populatedGroupsID, function (separatedGroups, separatedProfessions) {
                                    var foundProfessions = [];
                                    var toAdd;
                                    var toIgnore;
                                    var k;

                                    for(k=0; k<separatedProfessions.length; k++){
                                        foundProfessions.push(separatedProfessions[k].display_name);
                                    }

                                    if(connected == "users"){
                                        if(document.accepted)
                                        var chosenProfession; //choose only one profession for users
                                        if(foundProfessions.length > 1){
                                            chosenProfession = "Medic";
                                        }else if(foundProfessions.length == 0){
                                            chosenProfession = noProfessionAssignUsers;
                                        }else{
                                            chosenProfession = foundProfessions[0];
                                        }
                                        console.log("Profession decided:");
                                        console.log(chosenProfession);

                                        //record profession id and user id associations for updating users at the end
                                        var idPro = newProAssignations[chosenProfession][0].profession.toString();
                                        if(!usersToUpdate[idPro]) usersToUpdate[idPro] = [];
                                        usersToUpdate[idPro].push(document._id);

                                        //add default group
                                        toAdd = findDocumentByDisplayName(newProAssignations[chosenProfession], "Default");
                                        newConnections.push(toAdd);

                                        //ignore professions and everything on the ignore list
                                        toIgnore = toProfessions.concat(ignoreGroups);
                                        console.log("Ignore:");
                                        console.log(toIgnore);

                                        for(k=0; k<populatedGroupsID.length; k++){
                                            if(toIgnore.indexOf(populatedGroupsID[k].display_name) == -1){
                                                toAdd = findDocumentByDisplayName(newProAssignations[chosenProfession], populatedGroupsID[k].display_name);
                                                newConnections.push(toAdd);
                                            }
                                        }
                                        console.log("New groupsID:");
                                        console.log(newConnections);
                                        console.log("========================== END ENTRY");
                                    }else{
                                        //if there is no profession assigned to an article, assign default
                                        if(foundProfessions.length == 0){
                                            foundProfessions = [noProfessionAssignOthers];
                                        }
                                        console.log("Professions decided:");
                                        console.log(foundProfessions);
                                        //ignore everything on the ignore list
                                        toIgnore = ignoreGroups;
                                        console.log("Ignore:");
                                        console.log(toIgnore);

                                        for(k=0; k<populatedGroupsID.length; k++){
                                            if(toIgnore.indexOf(populatedGroupsID[k].display_name) == -1){
                                                if(populatedGroupsID[k].display_name == "Medic"){
                                                    toAdd = findDocumentByDisplayName(newProAssignations["Medic"], "Default");
                                                    newConnections.push(toAdd);
                                                }else if(populatedGroupsID[k].display_name == "Farmacist"){
                                                    toAdd = findDocumentByDisplayName(newProAssignations["Farmacist"], "Default");
                                                    newConnections.push(toAdd);
                                                }else{
                                                    if(foundProfessions.indexOf("Medic")!=-1){
                                                        toAdd = findDocumentByDisplayName(newProAssignations["Medic"], populatedGroupsID[k].display_name);
                                                        newConnections.push(toAdd);
                                                    }
                                                    if(foundProfessions.indexOf("Farmacist")!=-1){
                                                        toAdd = findDocumentByDisplayName(newProAssignations["Farmacist"], populatedGroupsID[k].display_name);
                                                        newConnections.push(toAdd);
                                                    }
                                                }

                                            }
                                        }
                                        console.log("New groupsID:");
                                        console.log(newConnections);
                                        console.log("========================== END ENTRY");
                                    }

                                    //update with new ids
                                    db.collection(connected).update({_id: document._id}, {$set: {groupsID: getIdsToAdd(newConnections)}}, function (err) {
                                        if(err){
                                            callbackEachDocument(err);
                                        }else{
                                            callbackEachDocument();
                                        }
                                    });

                                });
                            }
                        }, function (err) {
                            if(err){
                                callbackConnectedAll(err);
                            }else{
                                callbackConnectedAll();
                            }
                        })
                    }
                });
            }, function (err) {
                if(err){
                    console.log(err);
                }else{
                    callbackMaster();
                }
            })
        };

        //====================================================== START

        //make a copy of the old groups collection in memory
        copyGroups(function (copyOfGroups, associationsOldGroups) {
            console.log("Copy of old groups: ");
            console.log(copyOfGroups);
            db.collection(newGroupsName).remove({}, {justOne: false}, function (err, wRes) {
                if(err){
                    console.log(err);
                }else{
                    console.log("Removed "+wRes+" groups");

                    //create professions and get the correspondence of id -> name
                    createProfessions(function (newProfessions) {
                        console.log("New professions:");
                        console.log(newProfessions);
                        separateGroups(copyOfGroups, function (separatedGroups) {
                            createNewGroups(newProfessions, separatedGroups, function (newProAssignations) {
                                console.log(newProAssignations);
                                refactorConnections(associationsOldGroups, newProAssignations, function () {
                                    var usersUpdated = 0;
                                    console.log("Profession id to array of users assignment:");
                                    console.log(usersToUpdate);
                                    async.each(newProfessions, function (profession, callback) {
                                        var professionId = profession._id.toString();
                                        var usersArray = usersToUpdate[professionId];
                                        if(!usersArray) usersArray = [];
                                        db.collection('users').update({_id: {$in: usersArray}}, {$set: {profession: ObjectID(professionId)}}, {multi: true}, function (err, wRes) {
                                            if(err){
                                                callback(err);
                                            }else{
                                                usersUpdated+=wRes;
                                                callback();
                                            }
                                        });
                                    }, function (err) {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log("Updated "+usersUpdated+" users");
                                        }
                                        db.close();
                                    });
                                });
                            })
                        });
                    });
                }
            });
        });
    });
});