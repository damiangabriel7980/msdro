var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    AWS = require('aws-sdk'),
    webserver = require('gulp-webserver'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
    mysql = require('mysql');
    async = require('async');

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

gulp.task('minify_angular', function () {
    var stream = gulp.src('./public/javascript/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./public/min/javascript'));
    return stream;
});

gulp.task('run', function () {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development',
            'AWS_ACCESS_KEY_ID': 'AKIAIM6KJKTQ3DODHQPA',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});

gulp.task('run_staging', ['minify_angular'], function () {
    nodemon({
        script: 'server.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development',
            'AWS_ACCESS_KEY_ID': 'AKIAIM6KJKTQ3DODHQPA',
            'AWS_SECRET_ACCESS_KEY': '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'
        }
    })
});