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
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});