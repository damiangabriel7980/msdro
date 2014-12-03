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
//    IAM_msdAdmin
//    Access Key ID:        AKIAIM6KJKTQ3DODHQPA
//    Secret Access Key:    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

//    export AWS_ACCESS_KEY_ID="AKIAIM6KJKTQ3DODHQPA"
//    export AWS_SECRET_ACCESS_KEY="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"

//    IAM users sign-in link:
//    https://578381890239.signin.aws.amazon.com/console

//    resource format:     arn:aws:s3:::*/*
//    "Action":["s3:GetObject", "s3:PutObject"],

    // Note that environment credentials are loaded by default,
    // the following line is shown for clarity:
    AWS.config.credentials = new AWS.EnvironmentCredentials('AWS');
//    console.log(AWS.config.credentials);

// Now set temporary credentials seeded from the master credentials
//    generic:
//    AWS.config.credentials = new AWS.TemporaryCredentials();

    //for IAM user:
    AWS.config.credentials = new AWS.TemporaryCredentials({
        RoleArn: 'arn:aws:iam::578381890239:role/msdAdmin'
    });

// subsequent requests will now use temporary credentials from AWS STS.
    var s3 = new AWS.S3();
    console.log("================================================================ START");
//    console.log(s3.config.credentials);
    s3.getObject({Bucket: 'msddev-test', Key: 'multimedia/1/slide/multimedia_1.jpg'}, function (err, data) {
        console.log(err);
        console.log(data);
        console.log("                                                     msddev-test");
        console.log("================================================================");
    });

    s3.getObject({Bucket: 'msddev-test2', Key: 'multimedia/13/slide/multimedia_22.jpg'}, function (err, data) {
        console.log(err);
        console.log(data);
        console.log("                                                    msddev-test2");
        console.log("================================================================");
    });

    s3.listBuckets(function(err, data) {
        console.log(err);
        console.log(data);
        console.log("                                                    list buckets");
        console.log("================================================================");
    });
});

gulp.task('default', ['sass', 'js', 'watch']);