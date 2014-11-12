var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    watch = require('gulp-watch'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    webserver = require('gulp-webserver'),
    MongoClient = require('mongodb').MongoClient,
    ObjectID = require('mongodb').ObjectID,
    assert = require('assert'),
    mysql = require('mysql');


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
    var toDelete = [
        "answers","base-users","carousel-contents","cities","articles",
        "counties","calendar-events","public-articles","multimedia",
        "parameters","presentations","products","questions","quizes",
        "slides","tags","jobs","groups","users","roles","therapeutic-areas"];
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

    //------------------------------------------------------------------------------------------------------- constants
    const schema = "msd";
    const limit = 0; //used for testing; for no limit, set limit = 0

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
        ["county","city","city","county_id","id","citiesIds"],
        ["user_group","content","content_user_group","user_group_id","content_id","articlesIds"],
        ["question","answer","answer","question_id","id","answersIds"],
        ["user_group","event","event_user_group","user_group_id","event_id","eventsIds"],
        ["general_content","therapeutic_area","general_content_therapeutic_areas","general_content_id","therapeutic_area_id","therapeuticAreasIds"],
        ["multimedia","quiz","multimedia","id","quiz_id","quizesIds"],
        ["multimedia","therapeutic_area","multimedia_therapeutic_areas","multimedia_id","therapeutic_area_id","therapeuticAreasIds"],
        ["user_group","multimedia","multimedia_user_group","user_group_id","multimedia_id","multimediaIds"],
        ["user_group","presentation","presentation","user_group_id","id","presentationsIds"],
        ["user_group","product","product_user_group","user_group_id","product_id","productsIds"],
        ["quiz","question","question","quiz_id","id","questionsIds"],
        ["presentation","slide","slide","presentation_id","id","slidesIds"],
        ["product","therapeutic_area","therapeutic_area_product","product_id","therapeutic_area_id","therapeuticAreasIds"],
        ["user","city","user","id","city_id","citiesIds"],
        ["user","user_job","user","id","user_job_id","jobsIds"],
        ["user_group","user","user_group_users","user_group_id","user_id","usersIds"],
        ["role","user","user_role","role_id","user_id","usersIds"],
        ["user","therapeutic_area","user_therapeutic_area","user_id","therapeutic_area_id","therapeuticAreasIds"],
        ["therapeutic_area","therapeutic_area","therapeutic_area","id","parent_therapeutic_area_id","parentIds"]
    ];

    //------------------------------------------------------- migrate all columns except for the ones in the list below
    var columnExceptions = ["version","used"];

    //---------------------------------------------------------------- rename columns for tables below
    //                                                                 add more names in array to duplicate that column
    var renameColumns = {
//        "city": {
//            "name": ["city-name"]
//        },
//        "event": {
//            "name": ["event-name"],
//            "type": ["event-type"]
//        },
//        "user": {
//            "password": ["old-pass"]
//        },
//        "role": {
//            "authority": ["name"]
//        },
//        "user_group": {
//            "display_name": ["path","title"]
//        },
//        "content": {
//            "type": ["article-type"]
//        },
//        "general_content": {
//            "type": ["gcType"]
//        },
//        "multimedia": {
//            "type": ["multimediaType"]
//        },
//        "quiz": {
//            "entity": ["quiz-entity"]
//        }
    };

    //------------ replace spaces with dashes for columns (represented by arrays) in tables (represented by keys) below
    //------------ [in apigee, a unique column cannot contain spaces in any entry]
    var getRidOfSpaces = {
//        "user_group": ["display_name"]
    };

    // ------------------------------------------------------------------------------------------------ mongo functions
    var insertDocuments = function(db, collectionName, jsonDoc, callback) {
        // Get the documents collection
        var collection = db.collection(collectionName);
        // Insert some documents
        collection.insert(jsonDoc , function(err, result) {
            if(err){
                console.log("!------------------------------- Error at adding entry");
                console.log("collectionName: "+collectionName);
                console.log(err);
                console.log(result);
                console.log("-------------------------------!");
            }else{
                callback(result);
            }

        });
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

    var makeRequest = function(db, endpoint,body,table_old,oldId){
        insertDocuments(db, endpoint, body, function(result){
            if(result[0]){
                pkMappings[table_old].push([oldId,result[0]['_id'].toString()]);
            }else{
                console.log("!------------------------------- Error at adding entry");
                console.log("Result size different than expected. Id may not have been returned");
                console.log("endpoint: "+endpoint);
                console.log("body: "+body);
                console.log("-------------------------------!");
            }
            mongoRequestsPending--;
        });
    };

    var mappingRequest = function (db, collectionFrom, new_id_from, new_id_to, relationName) {
        var collection = db.collection(collectionFrom);
        // find document to update
        collection.find({"_id" : ObjectID(new_id_from)}).toArray(function(err, docs) {
            if(err!=null){
                console.log("!------------------------------- Error at mapping relation");
                console.log("Error retrieving collection");
                console.log("At: "+collectionFrom);
                console.log(docs);
                console.log("-------------------------------!");
                mappingsProcessedWithError++;
                mongoRequestsPending--;
            }else{
                if(docs[0]){
                    var sett = {};
                    sett[relationName] = new_id_to;
                    collection.update({ "_id" : ObjectID(new_id_from) }
                        , { $push: sett }, function(err, result) {
                            if(err==null){
                                mappingsSuccessful++;
                                mongoRequestsPending--;
                            }else{
                                console.log("!------------------------------- Error at mapping relation");
                                console.log("Could not update collection");
                                console.log("At: "+collectionFrom);
                                console.log("Id: "+new_id_from.toString());
                                console.log("Set to update: "+sett[relationName]);
                                console.log(docs);
                                console.log("-------------------------------!");
                                mappingsProcessedWithError++;
                                mongoRequestsPending--;
                            }
                        });
                }else{
                    console.log("!------------------------------- Error at mapping relation");
                    console.log("Unexpected size of result");
                    console.log("At: "+collectionFrom);
                    console.log(docs);
                    console.log("-------------------------------!");
                    mappingsProcessedWithError++;
                    mongoRequestsPending--;
                }
            }
        });
        // Insert some documents
//        collection.update({ a : 2 }
//            , { $set: { b : 1 } }, function(err, result) {
//                assert.equal(err, null);
//                assert.equal(1, result.result.n);
//                console.log("Updated the document with the field a equal to 2");
//                callback(result);
//            });
//        apigee.request({method: 'POST', endpoint:endpoint}, function (err,data) {
//            if(err){
//                console.log("!------------------------------- Error at mapping relation");
//                console.log("At: "+endpoint);
//                console.log(data);
//                console.log("-------------------------------!");
//                mappingsProcessedWithError++;
//            }else{
//                mappingsSuccessful++;
//            }
//            mongoRequestsPending--;
//        });
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

    var sqlMapRequest = function (db, old_table_from, old_table_to, link_table, link_col_from, link_col_to, relationName) {
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
//                            var collectionTo = toMigrate[old_table_to];

                            //make the request
                            mongoRequestsPending++;
                            mappingRequest(db, collectionFrom, new_id_from, new_id_to, relationName);
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

    var mongoRequestsPending = 0;
    var sqlRequestsPending = 0;

    var mappingsFailedToProcess = 0;
    var mappingsProcessedWithError = 0;
    var mappingsSuccessful = 0;

    // ---------------------------------------------------------------------------------------- connect to mongo client
    MongoClient.connect('mongodb://msd:mstest@ds051960.mongolab.com:51960/msd_test', function (err,mongoDB) {
        console.log("Connected to mongo server");

        //--------------------------------------------------------------------- iterate through SQL DB and migrate all data
        console.log("Migrating tables");
        for(var table in toMigrate){
            sqlRequestsPending++;
            sql.query("SELECT * FROM "+schema+"."+table, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                } else {
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
                                    var columnNames = renameColumn(table_old,column);  //name used for mongo
                                    var valueToWrite = columnData;                        //value used for mongo

                                    if(isMigrateCandidate(column) && !isFk(column) && column!=pk){
                                        if(columnData){
                                            //if column data is not allowed to contain spaces, replace them with a dash
                                            if(getRidOfSpaces[table_old]){
                                                if(arrayContainsString(getRidOfSpaces[table_old],column)){
                                                    valueToWrite = valueToWrite.replace(" ","-");
                                                }
                                            }

                                            //format dates
                                            if(isDate(columnData)) valueToWrite = columnData;
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

                            mongoRequestsPending++;
                            makeRequest(mongoDB, collectionName,newJson,table_old,rowData[pk]);

//                        */
                        }

                    }
                    sqlRequestsPending--;
                }
            });
        }

        var postExecution = function () {
            if(sqlRequestsPending==0 && mongoRequestsPending==0){
                clearInterval(checkForCompletion);
                //---------------------------------------------------------------------------------------------------------- all sql is now executed and
                //                                                                                                           all mongo requests received response
//            console.log(pkMappings);
                //--------------------------------------------------------- iterate through SQL DB and migrate all mappings
                console.log("Migrating mappings");
                for(var con in connections){
                    var c = connections[con];
                    sqlRequestsPending++;
                    sqlMapRequest(mongoDB, c[0], c[1], c[2], c[3], c[4], c[5]);
                }

                var allDone = function () {
                    if(mongoRequestsPending==0 && sqlRequestsPending==0){
                        clearInterval(checkFinal);
                        sql.end();
                        mongoDB.close();
                        console.log("ALL DONE");
                        console.log("Mappings successful = "+mappingsSuccessful);
                        console.log("Mappings processed with errors = "+mappingsProcessedWithError);
                        console.log("Mappings failed to process = "+mappingsFailedToProcess);
                    }else{
                        console.log("Requests pending = "+mongoRequestsPending);
                    }
                };
                var checkFinal = setInterval(allDone, 500);
            }else{
                console.log("Requests pending = "+mongoRequestsPending);
            }
        };
        var checkForCompletion = setInterval(postExecution, 500);

    });
});

gulp.task('testA', function () {
    MongoClient.connect('mongodb://msd:mstest@ds051960.mongolab.com:51960/msd_test', function (err,db) {

        // Get the documents collection
        var collection = db.collection('test');
        // Insert some documents

//        collection.find({"_id":ObjectID("54626d54e8c919e9beef56db")}).toArray(function(err,docs) {
//            console.log(docs);
//
//            });

        var arr = {};
        arr['arr'] = [1,1,1];
        collection.update({ "_id":ObjectID("54626d54e8c919e9beef56db") }
            , { $set: arr }, function(err, result) {
                if(err){
                    console.log("error");
                    console.log(result);
                }
                db.close();
            });


    });

});

gulp.task('default', ['sass', 'js', 'watch']);