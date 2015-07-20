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

gulp.task('copy_components', function () {
    return gulp.src('./public/components/**/*.*')
        .pipe(gulp.dest('./public_min/components'));
});

gulp.task('copy_partials', function () {
    return gulp.src('./public/partials/**/*.*')
        .pipe(gulp.dest('./public_min/partials'));
});

gulp.task('copy_module_templates', function () {
    return gulp.src('./public/modules/**/*.{html,eot,svg,ttf,woff}')
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

gulp.task('run', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html css',
        env: {
            'NODE_ENV': 'development',
            'AWS_ACCESS_KEY_ID': 'AKIAIU26AHNKP7VDKG6A',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_staging', ['minify_all', 'copy_components', 'copy_partials', 'copy_module_templates'], function () {
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

gulp.task('run_staging_no_min', function () {
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

gulp.task('run_production', ['minify_all', 'copy_components', 'copy_partials', 'copy_module_templates'], function () {
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

gulp.task('run_production_no_min', function () {
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