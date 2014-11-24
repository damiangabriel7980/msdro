var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    webserver = require('gulp-webserver'),
    AWS = require('aws-sdk');

// sass task
gulp.task('sass', function () {
    gulp.src('./assets/styles/**/*.scss')
        .pipe(sass({
            noCache: true,
            style: "expanded",
            lineNumbers: true,
            loadPath: './assets/styles/*'
        }))
        .pipe(gulp.dest('./assets/styles'))
        .pipe(notify({
            message: "You just got super Sassy!"
        }));;
});

// uglify task
gulp.task('js', function() {
    // main app js file
    gulp.src('./assets/js/app.js')
        .pipe(uglify())
        .pipe(concat("app.min.js"))
        .pipe(gulp.dest('./assets/js/'));

    // create 1 vendor.js file from all vendor plugin code
    gulp.src('./assets/js/vendor/**/*.js')
        .pipe(uglify())
        .pipe(concat("vendor.js"))
        .pipe(gulp.dest('./assets/js'))
        .pipe( notify({ message: "Javascript is now ugly!"}) );
});
gulp.task('webserver', function() {
    gulp.src('app')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});

gulp.task('watch', function() {
    // watch scss files
    gulp.watch('./assets/styles/**/*.scss', function() {
        gulp.run('sass');
    });

    gulp.watch('./assets/js/**/*.js', function() {
        gulp.run('js');
    });
});

//test amazon
gulp.task('test', function () {
    /*
    uses aws-sdk
    */
    //environment credentials
    var AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN;
    // Note that environment credentials are loaded by default,
// the following line is shown for clarity:
    AWS.config.credentials = new AWS.EnvironmentCredentials('AWS');

// Now set temporary credentials seeded from the master credentials
    // generic:
    AWS.config.credentials = new AWS.TemporaryCredentials();
    //for IAM user:
    AWS.config.credentials = new AWS.TemporaryCredentials({
        RoleArn: 'arn:aws:iam::1234567890:role/TemporaryCredentials'
    });

// subsequent requests will now use temporary credentials from AWS STS.
    new AWS.S3().listBucket(function(err, data) {

    });
});

gulp.task('default', ['sass', 'js', 'watch']);