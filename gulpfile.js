var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    webserver = require('gulp-webserver'),
    mongoose = require('mongoose'),
    mysql = require('mysql'),
    usergrid = require('usergrid');

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
        }));
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

gulp.task('deleteCollections', function () {
    var apigee = new usergrid.client({
        orgName:'andrei.paduraru',
        appName:'testmsd',
        authType:usergrid.AUTH_CLIENT_ID,
        clientId:'b3U6yvFz2mAnEeSkR8-U-7j7tQ',
        clientSecret:'b3U6kRcnxmjRJusz9CPfgSXq8HVnQgo',
        logging: false, //optional - turn on logging, off by default
        buildCurl: false //optional - turn on curl commands, off by default
    });

    var ent;

    apigee.createCollection({type: 'cities'}, function (err,data) {
        if(err){
            console.log("Error");
        }else{
            while(data.hasNextPage()){
                data.getNextPage(function (err) {
                    if(err){
                        console.log("Error");
                    }else{
                        console.log("Got page");
                        while(data.hasNextEntity()){
                            data.getNextEntity().destroy(function (err) {
                                if(err){
                                    console.log("Err");
                                }else{
                                    data = null;
                                }
                            });
                        }
                    }
                });
            }
        }
    })
});

gulp.task('migrateDB', function () {

    // connect to sql db
    var sql = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        typeCast : function (field, next) {
            if (field.type == 'BIT' && field.length == 1) {
                return (field.string() == '1'); // 1 = true, 0 = false
            }
            return next();
        }
    });

    // connect to apigee
    var apigee = new usergrid.client({
        orgName:'andrei.paduraru',
        appName:'testmsd',
        authType:usergrid.AUTH_CLIENT_ID,
        clientId:'b3U6yvFz2mAnEeSkR8-U-7j7tQ',
        clientSecret:'b3U6kRcnxmjRJusz9CPfgSXq8HVnQgo',
        logging: false, //optional - turn on logging, off by default
        buildCurl: false //optional - turn on curl commands, off by default
    });

    //------------------------------------------------------------------------------------------------------- constants
    const schema = "msd";

//    var dnm = ["content_user_group","databasechangelog","DATABASECHANGELOG","databasechangeloglock","DATABASECHANGELOGLOCK","event_user_group",
//               "folder","general_content_therapeutic_areas","multimedia_user_group","product_user_group","role","therapeutic_area_product",
//               "user_group_users","user_role","user_session","user_therapeutic_area"];

    //------------------------------------------------------------------- migrate following tables and assign new names
    var toMigrate = {
        "answer":"answers",
        "base_user":"base-users",
        "carousel":"carousel-contents",
        "city":"cities",
        "content":"articles",
        "county":"counties",
        "event":"calendar-events",
        "general_content":"public-articles",
        "multimedia":"multimedia",
        "parameter":"parameters",
        "presentation":"presentations",
        "product":"products",
        "question":"questions",
        "quiz":"quizes",
        "slide":"slides",
        "tag":"tags",
        "user_job":"jobs"
    };

    //-------------------- mappings (table1, table2, connection_table, table1_connect_id, table2_connect_id, connection_name)
    //-------------------- table1 is owner
    var connections = [
        ["county","city","city","county_id",null,"contains"],
        ["user_group","content","content_user_group","user_group_id","content_id","canAccess"],
        ["question","answer","answer","question_id",null,"hasAnswers"],
        ["user_group","event","event_user_group","user_group_id","event_id","canAttend"],
        ["general_content","therapeutic_areas","general_content_therapeutic_areas","general_content_id","therapeutic_area_id","inArea"],
        ["multimedia","quiz","multimedia",null,"quiz_id","quizAttached"],
        ["multimedia","therapeutic_areas","multimedia_therapeutic_areas","multimedia_id","therapeutic_area_id","inArea"],
        ["user_group","multimedia","multimedia_user_group","user_group_id","multimedia_id","canAccess"],
        ["user_group","presentation","presentation","user_group_id",null,"canAccess"],
        ["user_group","product","product_user_group","user_group_id","product_id","canAccess"],
        ["quiz","question","question","quiz_id",null,"hasQuestions"],
        ["presentation","slide","slide","presentation_id",null,"hasSlides"],
        ["product","therapeutic_areas","therapeutic_area_product","product_id","therapeutic_area_id","inArea"],
        ["user","city","user","id","city_id","livesIn"],
        ["user","user_job","user","id","user_job_id","worksAs"],
        ["user_group","user","user_group_users","user_group_id","user_id","contains"],
        ["user","role","user_role","user_id","role_id","roleOwned"],
        ["user","therapeutic_area","user_therapeutic_area","user_id","therapeutic_area_id","inArea"]
    ];
    //------------------------------------------------------------------- treat these tables uniquely
    var specificMappings = {
        "user_group": "groups",
        "user": "users",
        "role": "roles",
        "therapeutic_area":"therapeutic-areas"
    };

    //--------------------------------------- migrate all columns except for the ones that are pk, fk, or in list below
    var columnExceptions = ["version","used"];

    //--------------------------------------------------------------------------------- rename columns for tables below
    var renameColumns = {
        "cities": {
            "name": "city-name"
        },
        "calendar-events": {
            "name": "event-name"
        }
    };

    //------------------------------------------------------------------------------------------------ useful functions
    var isDate = function(columnData){
        return (columnData.constructor.toString().indexOf("Date") > -1);
    };
    var arrayContainsString = function (stringArray,stringToCheck) {
        for(var i=0; i<stringArray.length; i++){
            if(stringArray[i].indexOf(stringToCheck) >-1) return true;
        }
        return false;
    };
    var isMigrateCandidate = function(columnName){
        if(((columnName.indexOf("id") > -1) && (columnName.indexOf("_") > -1)) || columnName=="id" || arrayContainsString(columnExceptions,columnName)){
            return false;
        }else{
            return true;
        }
    };

    //------------------------------------------------------------------------------------------ iterate through SQL DB

    sql.connect();

    var objectsAdded = 0;
    var limit = 10; //used for testing; for no limit, set limit = 0

    for(var table in toMigrate){
        sql.query("SELECT * FROM "+schema+"."+table, function (err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                //TODO Separate gulp script for emtying all collections
                var collectionName = toMigrate[fields[0]['table']];
                var it = 0;
                for(var row in rows){
                    var newJson = {};
                    if(rows.hasOwnProperty(row)){
                        var rowData = rows[row];
                        for (var column in rowData){
                            if(rowData.hasOwnProperty(column)){
                                var columnData = rowData[column];
                                //------------------------------------------ now we have the column and columnData
                                if(columnData){//                            to play with
//                                    console.log(column+":"+columnData);
                                    if(isMigrateCandidate(column)){
                                        var columnName = column;
                                        var valueToWrite = columnData;

                                        if(renameColumns[collectionName]){
                                            if(renameColumns[collectionName][columnName]){
                                                columnName = renameColumns[collectionName][columnName];
                                            }
                                        }

                                        if(isDate(columnData)) valueToWrite = columnData.valueOf();

                                        newJson[columnName]=valueToWrite;
                                    }
                                }else{
                                    if(isMigrateCandidate(column)){
                                        newJson[column]=columnData;
                                        it++;
                                        if(limit!=0 && it>limit) break;
                                    }
                                }
                            }
                        }
                    }

//                    console.log(newJson); //-------- now we have a json entry that we can add to it's collection

                    apigee.request({method: 'POST', endpoint: collectionName, body: newJson}, function (err,data) {
                        if(err){
                            console.log("!------------------------------- Error at adding entry");
                            console.log(data);
                            console.log("-------------------------------!");
                        }else{
                            objectsAdded++;
                            if (objectsAdded % 200 == 0) console.log("Total added = "+objectsAdded);
                        }
                    });
                }
            }
        });
    }

    sql.end();
});

gulp.task('default', ['sass', 'js', 'watch']);