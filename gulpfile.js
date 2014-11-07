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

    var toDelete = [
            "answers","base-users","carousel-contents","cities","articles",
        "counties","calendar-events","public-articles","multimedia",
        "parameters","presentations","products","questions","quizes",
        "slides","tags","jobs","groups","users","roles","therapeutic-areas"];

    for(var col in toDelete){
        apigee.request({method: 'DELETE', endpoint:toDelete[col]+"?limit=15&ql="}, function (err,data) {
            if(err){
                console.log(data);
            }
        });
    }
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
    const limit = 10; //used for testing; for no limit, set limit = 0

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
        "user_job":"jobs",
        //ai grija cu astea
        "user_group": "groups",
        "user": "users",
        "role": "roles",
        "therapeutic_area":"therapeutic-areas"
    };

    //-------------------- mappings (table1, table2, connection_table, table1_connect_id, table2_connect_id, connection_name)
    //-------------------- table1 is owner
    var connections = [
        ["county","city","city","county_id","id","contains"],
        ["user_group","content","content_user_group","user_group_id","content_id","canAccess"],
        ["question","answer","answer","question_id","id","hasAnswers"],
        ["user_group","event","event_user_group","user_group_id","event_id","canAttend"],
        ["general_content","therapeutic_area","general_content_therapeutic_areas","general_content_id","therapeutic_area_id","inArea"],
        ["multimedia","quiz","multimedia","id","quiz_id","quizAttached"],
        ["multimedia","therapeutic_area","multimedia_therapeutic_areas","multimedia_id","therapeutic_area_id","inArea"],
        ["user_group","multimedia","multimedia_user_group","user_group_id","multimedia_id","canAccess"],
        ["user_group","presentation","presentation","user_group_id","id","canAccess"],
        ["user_group","product","product_user_group","user_group_id","product_id","canAccess"],
        ["quiz","question","question","quiz_id","id","hasQuestions"],
        ["presentation","slide","slide","presentation_id","id","hasSlides"],
        ["product","therapeutic_area","therapeutic_area_product","product_id","therapeutic_area_id","inArea"],
        ["user","city","user","id","city_id","livesIn"],
        ["user","user_job","user","id","user_job_id","worksAs"],
        ["user_group","user","user_group_users","user_group_id","user_id",null],
        ["role","user","user_role","role_id","user_id",null],
        ["user","therapeutic_area","user_therapeutic_area","user_id","therapeutic_area_id","inArea"],
        ["therapeutic_area","therapeutic_area","therapeutic_area","id","parent_therapeutic_area_id","childOf"]
    ];

    //------------------------------------------------------- migrate all columns except for the ones in the list below
    var columnExceptions = ["version","used"];

    //---------------------------------------------------------------- rename columns for tables below
    //                                                                 add more names in array to duplicate that column
    var renameColumns = {
        "city": {
            "name": ["city-name"]
        },
        "event": {
            "name": ["event-name"]
        },
        "user": {
            "password": ["old-pass"]
        },
        "role": {
            "authority": ["name"]
        },
        "user_group": {
            "display_name": ["path","title"]
        }
    };

    //------------ replace spaces with dashes for columns (represented by arrays) in tables (represented by keys) below
    //------------ [in apigee, a unique column cannot contain spaces in any entry]
    var getRidOfSpaces = {
        "user_group": ["display_name"]
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
        if(arrayContainsString(columnExceptions,columnName)){
            return false;
        }else{
            return true;
        }
    };

    var isFk = function(columnName){
        if((columnName.indexOf("id") > -1) && (columnName.indexOf("_") > -1)){
            return true;
        }else{
            return false;
        }
    };

    var getPk = function(){
        //in my case, pk is always "id"
        return 'id';
    };

    var renameColumn = function(table_old, columnName){
        columnName = [columnName];
        //check if column needs to be explicitly renamed
        if(renameColumns[table_old]){
            if(renameColumns[table_old][columnName]){
                columnName = renameColumns[table_old][columnName];
            }
        }
        return columnName;
    };

    var makeRequest = function(endpoint,body,table_old,oldId){
        apigee.request({method: 'POST', endpoint: endpoint, body: body}, function (err,data) {
            if(err){
                console.log("!------------------------------- Error at adding entry");
                console.log("entity: "+endpoint);
                console.log(data);
                console.log("-------------------------------!");
            }else{
                pkMappings[table_old].push([oldId,data.entities[0].uuid]);
            }
            apigeeRequestsPending--;
        });
    };

    var mappingRequest = function (endpoint) {
        apigee.request({method: 'POST', endpoint:endpoint}, function (err,data) {
            if(err){
                console.log("!------------------------------- Error at mapping relation");
                console.log("At: "+endpoint);
                console.log(data);
                console.log("-------------------------------!");
                mappingsProcessedWithError++;
            }else{
                mappingsSuccessful++;
            }
            apigeeRequestsPending--;
        });
    };

    var searchInPkMappings = function (table_old,old_row_id) {
        var i=0;
//        console.log("table: "+table_old+"; id: "+old_row_id);
        while(i<pkMappings[table_old].length){
            if(pkMappings[table_old][i][0]==old_row_id){
                return pkMappings[table_old][i][1];
            }
            i++;
        }
        return null;
    };

    var sqlMapRequest = function (old_table_from, old_table_to, link_table, link_col_from, link_col_to, relationName) {
        sql.query("SELECT "+link_col_from+", "+link_col_to+" FROM "+schema+"."+link_table, function (err,rows,fields) {
            if(err){
                console.log(err);
            }else{
                for(var row in rows){
                    var rowData = rows[row];
                    var old_id_from = rowData[link_col_from];
                    var old_id_to = rowData[link_col_to];
                    if (old_id_from!=null && old_id_to!=null){
//                        console.log(rowData[link_col_from]+" - "+rowData[link_col_to]);
                        var new_id_from = searchInPkMappings(old_table_from,old_id_from);
                        var new_id_to = searchInPkMappings(old_table_to,old_id_to);
                        if(new_id_from!=null && new_id_to!=null){
                            var collectionFrom = toMigrate[old_table_from];
                            var collectionTo = toMigrate[old_table_to];

                            var requestString = collectionFrom+"/"+new_id_from+"/"+relationName+"/"+collectionTo+"/"+new_id_to;

                            //these connections need to be treated as exceptions
                            if(relationName==null){
                                requestString = collectionFrom+"/"+new_id_from+"/"+collectionTo+"/"+new_id_to;
                            }

                            //make the request using requestString
                            apigeeRequestsPending++;
                            mappingRequest(requestString);
                        }else{
                            mappingsFailedToProcess++;
                        }
                    }
                }
                sqlRequestsPending--;
            }
        });
    };

    sql.connect();

    var pkMappings = {
        /*
        "table_old": [
                [
                "old_row_id",
                "new_row_id_as_str"
                ]
            ]
        }
        */
    };

    var sqlBocks = {}; //put each sql query in an execution block

    var apigeeRequestsPending = 0;
    var sqlRequestsPending = 0;

    var mappingsFailedToProcess = 0;
    var mappingsProcessedWithError = 0;
    var mappingsSuccessful = 0;

    //--------------------------------------------------------------------- iterate through SQL DB and migrate all data
    console.log("Migrating tables");
    for(var table in toMigrate){
        sqlRequestsPending++;
        sql.query("SELECT * FROM "+schema+"."+table, function (err, rows, fields) {
            if (err) {
                console.log(err);
            } else {
                //TODO Separate gulp script for emptying all collections
                var table_old = fields[0]['table']; //get sql table name
                var collectionName = toMigrate[table_old]; //get new collection name
                pkMappings[table_old]=[]; //initialize pk mappings
                var it = 0;
                for(var row in rows){
                    var newJson = {};
                    var pk = getPk();
                    if(rows.hasOwnProperty(row)){
//                        /*
                        var rowData = rows[row];
                        for (var column in rowData){
                            if(rowData.hasOwnProperty(column)){
                                var columnData = rowData[column];
                                //------------------------------------------ now we have the column and columnData
                                //                                           to play with
                                //
                                var columnNames = renameColumn(table_old,column);  //name used for apigee
                                var valueToWrite = columnData;                        //value used for apigee

                                if(isMigrateCandidate(column) && !isFk(column) && column!=pk){
                                    if(columnData){
                                        //if column data is not allowed to contain spaces, replace them with a dash
                                        if(getRidOfSpaces[table_old]){
                                            if(arrayContainsString(getRidOfSpaces[table_old],column)){
                                                valueToWrite = valueToWrite.replace(" ","-");
                                            }
                                        }

                                        //format dates
                                        if(isDate(columnData)) valueToWrite = columnData.valueOf();
                                    }
                                    for(var k=0; k<columnNames.length; k++){
                                        newJson[columnNames[k]]=valueToWrite;
                                    }
                                }
                            }

                        }
                        it++;
                        if(limit!=0 && it>limit) break;

//                        console.log(newJson); //-------- now we have a json entry that we can add to it's collection

                        makeRequest(collectionName,newJson,table_old,rowData[pk]);
                        apigeeRequestsPending++;

//                        */
                    }

                }
                sqlRequestsPending--;
            }
        });
    }

    var postExecution = function () {
        if(sqlRequestsPending==0 && apigeeRequestsPending==0){
            clearInterval(checkForCompletion);
            //---------------------------------------------------------------------------------------------------------- all sql is now executed and
            //                                                                                                           all apigee requests received response
//            console.log(pkMappings);
            //--------------------------------------------------------- iterate through SQL DB and migrate all mappings
            console.log("Migrating mappings");
            for(var con in connections){
                var c = connections[con];
                sqlRequestsPending++;
                sqlMapRequest(c[0], c[1], c[2], c[3], c[4], c[5]);
            }

            var allDone = function () {
                if(apigeeRequestsPending==0 && sqlRequestsPending==0){
                    clearInterval(checkFinal);
                    sql.end();
                    console.log("ALL DONE");
                    console.log("Mappings successful = "+mappingsSuccessful);
                    console.log("Mappings processed with errors = "+mappingsProcessedWithError);
                    console.log("Mappings failed to process = "+mappingsFailedToProcess);
                }else{
                    console.log("Requests pending = "+apigeeRequestsPending);
                }
            };
            var checkFinal = setInterval(allDone, 3000);
        }else{
            console.log("Requests pending = "+apigeeRequestsPending);
        }
    };
    var checkForCompletion = setInterval(postExecution, 3000);
});

gulp.task('testA', function () {
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

    var searchInPkMappings = function (table_old,old_row_id) {
        // I assume the value I am searching has to be there. No point in slowing things down
        var i=0;
        while(true){
            if(pkMappings[table_old][i][0]==old_row_id){
                return pkMappings[table_old][i][1];
            }
            i++;
        }
    };

    var pkMappings = { answer: [
        [ 15, 'ec054244-6672-11e4-b4aa-ed3dc5a05e43' ],
        [ 12, 'ec0716fa-6672-11e4-9433-93d16653f435' ],
        [ 13, 'ec07170e-6672-11e4-81c1-1f2dcdb5a5b5' ],
        [ 14, 'ec0653aa-6672-11e4-9d50-a7769b091e78' ],
        [ 16, 'ec08015a-6672-11e4-a500-e7d2db3eae03' ],
        [ 17, 'ec3097fa-6672-11e4-a226-db8f2f620242' ],
        [ 21, 'ec31d07a-6672-11e4-82d4-593dfbb9871b' ],
        [ 20, 'ec337e2a-6672-11e4-b584-3106a16c43e4' ],
        [ 19, 'ec374eba-6672-11e4-81a6-41242bf02de5' ],
        [ 18, 'ec39237a-6672-11e4-897d-6b2aa4bb459d' ]
    ]
    };

    console.log(searchInPkMappings("answer",16));

});

gulp.task('default', ['sass', 'js', 'watch']);