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
    readdirR = require('fs-readdir-recursive'),
    Q = require('q'),
    spawn = require('child_process').spawn;

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

gulp.task('copy_components', function () {
    return gulp.src('./public/components/**/*.*')
        .pipe(gulp.dest('./public_min/components'));
});

gulp.task('copy_assets', function () {
    return gulp.src('./public/assets/**/*.*')
        .pipe(gulp.dest('./public_min/assets'));
});


gulp.task('copy_partials', function () {
    return gulp.src('./public/partials/**/*.*')
        .pipe(gulp.dest('./public_min/partials'));
});

gulp.task('copy_module_templates', function () {
    return gulp.src('./public/modules/**/*.{html,eot,svg,ttf,woff,png,jpg,jpeg}')
        .pipe(gulp.dest('./public_min/modules'));
});

gulp.task('minify_css', function () {
    return gulp.src(['./public/**/*.css','!./public/components/**/*.*'])
        .pipe(minifyCSS())
        .pipe(gulp.dest('./public_min'));
});

gulp.task('minify_js', function () {
    return gulp.src(['./public/**/*.js','!./public/components/**/*.*'])
        .pipe(uglify())
        .pipe(gulp.dest('./public_min'));
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

gulp.task('prepare_production', ['minify_all', 'copy_components', 'copy_partials', 'copy_module_templates', 'copy_assets'], function () {
    console.log("DONE");
});

gulp.task('run', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'qa',
            'AWS_ACCESS_KEY_ID': 'AKIAIU26AHNKP7VDKG6A',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_dev_shared', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'devshared',
            'AWS_ACCESS_KEY_ID': 'AKIAIU26AHNKP7VDKG6A',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_staging', ['prepare_production'], function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'staging',
            'AWS_ACCESS_KEY_ID': 'AKIAIU26AHNKP7VDKG6A',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_production', ['prepare_production'], function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'production',
            'AWS_ACCESS_KEY_ID': 'AKIAIU26AHNKP7VDKG6A',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('toObjectId', function () {

    var dbAddress = "localhost:27017/msd";

    var mongoose = require('mongoose');
    var Utils = require('./app/modules/utils');
    mongoose.connect(dbAddress);
    console.log("connected");

    //var toConvert = {
    //    articles: {
    //        refs: ['groupsID'],
    //        model: require('./app/models/articles')
    //    },
    //    carousel_Medic: {
    //        refs: ["article_id"],
    //        model: require('./app/models/carousel_Medic'),
    //        log: false
    //    },
    //    counties: {
    //        refs: ["citiesID"],
    //        model: require('./app/models/counties')
    //    },
    //    events: {
    //        refs: ["groupsID"],
    //        model: require('./app/models/events')
    //    },
    //    multimedia: {
    //        refs: ["groupsID", "therapeutic-areasID"],
    //        model: require('./app/models/multimedia')
    //    },
    //    presentations: {
    //        refs: ["groupsID"],
    //        model: require('./app/models/presentations')
    //    },
    //    products: {
    //        refs: ["groupsID", "therapeutic-areasID"],
    //        model: require('./app/models/products')
    //    },
    //    therapeutic_areas: {
    //        refs: ["therapeutic-areasID"],
    //        model: require('./app/models/therapeutic_areas')
    //    },
    //    user: {
    //        refs: ["citiesID", "jobsID", "rolesID", "groupsID", "therapeutic-areasID"],
    //        model: require('./app/models/user'),
    //        select: "+citiesID +rolesID +jobsID"
    //    }
    //};

    var toConvert = {
        'publicContent': {
            refs: ["therapeutic-areasID"],
            model: require('./app/models/publicContent')
        }
    };

    async.each(Object.keys(toConvert), function (key, callback) {
        var model = toConvert[key].model;
        var refs = toConvert[key].refs;
        var select = toConvert[key].select;
        var log = toConvert[key].log;
        var cursor = model.find();
        if(select) cursor.select(select);
        cursor.exec(function (err, docs) {
            if(err){
                callback(err);
            }else{
                async.each(docs, function (doc, cbDoc) {
                    async.each(refs, function (ref, cbRef) {
                        if(log){
                            console.log(doc[ref]);
                            console.log(typeof doc[ref]);
                            console.log("====================");
                        }
                        var upd = {};
                        if(!doc[ref] || doc[ref] == ""){
                            cbRef();
                        }else{
                            if(Utils.isArray(doc[ref])){
                                var arr = [];
                                for(var i=0; i<doc[ref].length; i++){
                                    arr.push(mongoose.Types.ObjectId(doc[ref][i]));
                                }
                                upd[ref] = arr;
                            }else{
                                upd[ref] = mongoose.Types.ObjectId(doc[ref]);
                            }
                            model.update({_id: doc._id}, {$set: upd}, function (err, wres) {
                                cbRef(err)
                            });
                        }
                    }, function (err) {
                        cbDoc(err);
                    });
                }, function (err) {
                    callback(err);
                });
            }
        });
    }, function (err) {
        if(err){
            console.log(err);
        }else{
            console.log("done");
        }
    })

});

gulp.task("tpaCleanup", function () {

    var dbAddress = "mongodb://localhost:27017/msd";

    var mongoose = require('mongoose');
    mongoose.connect(dbAddress);
    console.log("connected");

    var Utils = require('./app/modules/utils');

    var TPA = require('./app/models/therapeutic_areas');

    TPA.find({}, function (err, areas) {
        if(err){
            console.log(err);
        }else{
            Utils.getIds(areas, true).then(function (areasIds) {
                var circularRefs = [];
                var lostRefs = [];
                var area;
                var ref;
                for(var i=0; i<areas.length; i++){
                    area = areas[i];
                    ref = area['therapeutic-areasID'];
                    if(ref && ref[0]){
                        if(area._id.toString() == ref[0].toString()){
                            circularRefs.push(area._id);
                        }
                        if(areasIds.indexOf(ref[0].toString()) == -1){
                            lostRefs.push(ref[0]);
                        }
                    }
                }
                //console.log(circularRefs);
                //console.log(lostRefs);
                var damagedRefs = circularRefs.concat(lostRefs);
                TPA.find({$or: [{_id: {$in: damagedRefs}}, {'therapeutic-areasID': {$in: damagedRefs}}]}, {name: 1}).exec(function (err, areas) {
                    if(err){
                        console.log(err);
                    }else{
                        console.log(areas);
                        Utils.getIds(areas).then(function (ids) {
                            //console.log(ids);
                            TPA.remove({_id: {$in: ids}}).exec(function (err, wres) {
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("Removed "+wres+" areas");
                                }
                            });
                        });
                    }
                });
            });
        }
    });

});

gulp.task("farma", function () {

    var dbAddress = "mongodb://localhost:27017/msd";

    var mongoose = require('mongoose');
    mongoose.connect(dbAddress);
    console.log("connected");

    var Groups = require('./app/models/userGroup');
    var Professions = require('./app/models/professions');

    //find all the Farmacist groups
    Professions.findOne({"display_name": /farma/i}, function(err, profession){
        if(err || !profession){
            console.log(err || !profession);
        }else{
            Groups.find({profession: profession._id, display_name: {$ne: "Default"}}, function(err, groups){
                if(err){
                    console.log(err);
                }else{
                    // now we need to hide all the Farmacist groups at signup
                    Groups.update(
                        {profession: profession._id, display_name: {$ne: "Default"}},
                        {$set: {show_at_signup: false}},
                        {multi: true},
                        function(err){
                            if(err){
                                console.log(err);
                            }else{
                                mongoose.disconnect();
                            }
                        });
                }
            });            
        }            
    });

});

gulp.task("countyDoubleBind", function () {

    var dbAddress = "mongodb://localhost:27017/msd";

    var mongoose = require('mongoose');
    mongoose.connect(dbAddress);
    console.log("connected");

    var County = require('./app/models/counties');
    var City = require('./app/models/cities');

    County.find({}, function (err, counties) {
        if(err){
            console.log(err);
        }else{
            async.each(counties, eachCounty, function (err) {
                if(err){
                    console.log(err);
                }else{
                    console.log("done");
                }
            });
        }
    });

    function eachCounty(county, callbackCounty){
        async.each(county.citiesID, function (city_id, callback) {
            City.update({_id: city_id}, {$set: {county: county._id}}, function (err, wres) {
                callback(err);
            });
        }, function (err) {
            callbackCounty(err);
        });
    }

});

function spawnCommand(command, args) {
    var deferred = Q.defer();
    var cmd = spawn(command, args);
    cmd.stdout.on('data', function (data) {
        deferred.notify(data);
    });

    cmd.stderr.on('data', function (err) {
        console.log(err.toString());
    });

    cmd.on('close', function (code) {
        if(code === 0) {
            deferred.resolve(command+" complete");
        }else{
            deferred.reject(command+" terminated with code "+code);
        }
    });

    return deferred.promise;
}

gulp.task("populateDB", function() {
    var workdirRel = "dbPopulate";
    var workdirAbs;
    spawnCommand("pwd", []).then(
        function(success){
            console.log(success);
        },
        function(err){
            console.log(err);
        },
        function(data){
            if(data){
                workdirAbs = data.toString().replace(/\n/g,"") + "/" + workdirRel;
                console.log("workdir:",workdirAbs);
                dumpDB(workdirAbs).then(
                    function() {
                        restoreDB(workdirAbs).then(
                            function() {
                                clearTracesAfterPopulateDB(workdirAbs).then(
                                    function(success){
                                        console.log("DONE");
                                    },
                                    function(err) {
                                        console.log(err);
                                    }
                                );
                            }
                        );
                    }
                );
            }
        }
    );
});

var Slides = require('./app/models/elearning/slides');
var Questions = require('./app/models/elearning/questions');
var Answers = require('./app/models/elearning/answers');

gulp.task("fillScores", function(){

    var slide_id = "55fae5ad0b42ffb9c19245dc";

    var dbAddress = "mongodb://localhost:27017/msd";
    var mongoose = require('mongoose');
    mongoose.connect(dbAddress);
    console.log("connected");
    
    Slides.findOne({_id: slide_id}, function(err, slide){
        if(err || !slide){
            console.log(err || "No slide");
        }else{
            async.each(slide.questions, function processQuestion(question_id, callback){
                Questions.findOne({_id: question_id}, function(err, question){
                    if(err || !question){
                        callback(err || "No question");
                    }else{
                        Answers.find({_id: {$in: question.answers}}).select("+ratio").exec(function(err, answers){
                            if(err){
                                callback(err);
                            }else{
                                var totalPoints = 0;
                                var unpointedAnswers = [];
                                for(var i=0; i<answers.length; i++){
                                    if(answers[i].ratio > 0){
                                        totalPoints+=answers[i].ratio;
                                    }else{
                                        unpointedAnswers.push(answers[i]._id);
                                    }
                                }
                                var adjustment = totalPoints / unpointedAnswers.length * -1;
                                console.log("====================");
                                console.log("Qestion "+question.order);
                                console.log("Total points: "+totalPoints);
                                console.log("Unpointed answers: "+unpointedAnswers.length);
                                console.log("Adjustment: "+adjustment);
                                Answers.update(
                                    {_id: {$in: unpointedAnswers}},
                                    {$set: {ratio: adjustment}},
                                    {multi: true},
                                    function(err){
                                        if(err){
                                            callback(err);
                                        }else{
                                            callback();
                                        }
                                    }
                                );
                            }
                        });
                    }
                })
            }, function done(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("done");
                }
                mongoose.disconnect();
            });
        }
    });
});

function dumpDB(workdirAbs) {
    var deferred = Q.defer();
    //make a dump of the QA database
    spawnCommand("mongodump", ["-h","10.200.0.213:27017","-u","msddev","-p","PWj4zOt_qX9oRRDH8cwiUqadb","-d","MSDdev","-o",workdirAbs]).then(
        function(success){
            console.log(success);
            deferred.resolve();
        },
        function(err){
            console.log(err);
            deferred.reject();
        },
        function(data){
            if(data){
                console.log(data.toString());
            }
        }
    )
    return deferred.promise;
}

function restoreDB(workdirAbs) {
    var deferred = Q.defer();
    //make a dump of the QA database
    spawnCommand("mongorestore", ["-h","localhost:27017","-d","msd","--drop","--dir="+workdirAbs+"/MSDdev"]).then(
        function(success){
            console.log(success);
            deferred.resolve();
        },
        function(err){
            console.log(err);
            deferred.reject();
        },
        function(data){
            if(data){
                console.log(data.toString());
            }
        }
    )
    return deferred.promise;
}

function clearTracesAfterPopulateDB (workdirAbs) {
    var deferred = Q.defer();
    var paths = readdirR(workdirAbs);
    //console.log(paths);
    //remove all files
    var toRemove;
    for (var i=0; i<paths.length; i++){
        toRemove = workdirAbs + "/" + paths[i];
        fs.unlinkSync(toRemove);
        console.log("Removed file: ",toRemove);
    }
    //remove folders
    toRemove = workdirAbs+"/MSDdev";
    fs.rmdirSync(toRemove);
    console.log("Removed folder: ",toRemove);
    fs.rmdirSync(workdirAbs);
    console.log("Removed folder: ",workdirAbs);
    deferred.resolve();
    return deferred.promise;
}