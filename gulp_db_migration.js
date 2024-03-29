gulp.task('deleteCollections', function () {
    var toDelete = [
        "answers","base-users","carousel-contents","cities","articles",
        "counties","calendar-events","public-articles","multimedia",
        "parameters","presentations","products","questions","quizes",
        "slides","tags","jobs","groups","users","roles","therapeutic-areas"];
    toDelete.concat("carousel_Medic","chat-messages","conferences","new_groups","professions",
        "public-carousel","public-content","qa_answerGivers","qa_messages",
        "qa_threads","qa_topics","rooms","speakers");
    MongoClient.connect('mongodb://msd:mstest@ds051960.mongolab.com:51960/msd_test', function (err,db) {
        for(var c in toDelete){
            var collection = db.collection(toDelete[c]);
            try{
                collection.drop();
            }catch (ex){}
        }
        db.close();
    });
});

gulp.task('migrateDB', function () {

    var mongoAddress = 'mongodb://msd:mstest@ds051960.mongolab.com:51960/msd_test';

    // connect to sql db
    var sql = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        typeCast : function (field, next) {
            if (field.type == 'BIT' && field.length == 1) {
                return (field.buffer()[0] == 1); // 1 = true, 0 = false
            }
            return next();
        }
    });

    //------------------------------------------------------------------------------------------------------- constants
    const schema = "msd_prod";
    const limit = 0; //used for testing; for no limit, set limit = 0

//    var dnm = ["content_user_group","databasechangelog","DATABASECHANGELOG","databasechangeloglock","DATABASECHANGELOGLOCK","event_user_group",
//               "folder","general_content_therapeutic_areas","multimedia_user_group","product_user_group","role","therapeutic_area_product",
//               "user_group_users","user_role","user_session","user_therapeutic_area"];

    //------------------------------------------------------------------- migrate following tables and assign new names

    var toMigrate = {
        "answer":"answers",
        "base_user":"base-users",
        "carousel":"public-carousel",
        "city":"cities",
        "content":"articles",
        "county":"counties",
        "event":"calendar-events",
        "general_content":"public-content",
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

    //-------------------- mappings (table1, table2, connection_table, table1_connect_id, table2_connect_id, bidirectional)
    //-------------------- table1 is owner
    var connections = [
        ["county","city","city","county_id","id",false],
        ["content","user_group","content_user_group","content_id","user_group_id",false],
        ["question","answer","answer","question_id","id",false],
        ["event","user_group","event_user_group","event_id","user_group_id",false],
        ["multimedia","quiz","multimedia","id","quiz_id",false],
        ["multimedia","therapeutic_area","multimedia_therapeutic_areas","multimedia_id","therapeutic_area_id",false],
        ["multimedia","user_group","multimedia_user_group","multimedia_id","user_group_id",false],
        ["presentation","user_group","presentation","id","user_group_id",false],
        ["product","user_group","product_user_group","product_id","user_group_id",false],
        ["quiz","question","question","quiz_id","id",false],
        ["multimedia","slide","slide","presentation_id","id",false],
        ["product","therapeutic_area","therapeutic_area_product","product_id","therapeutic_area_id",false],
        ["user","city","user","id","city_id",false],
        ["user","user_job","user","id","user_job_id",false],
        ["user","user_group","user_group_users","user_id","user_group_id",false],
        ["user","role","user_role","user_id","role_id",false],
        ["user","therapeutic_area","user_therapeutic_area","user_id","therapeutic_area_id",false],
        ["therapeutic_area","therapeutic_area","therapeutic_area","id","parent_therapeutic_area_id",false]
    ];

    //------------------------------------------------------- migrate all columns except for the ones in the list below
    var columnExceptions = ["version","used"];

    //---------------------------------------------------------------- rename columns for tables below
    //                                                                 add more names in array to duplicate that column
    var renameColumns = {
        "general_content": {
            "last_updated": ["last_updated", "date_added"]
        }
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

    var sqlMapRequest = function (db, old_table_from, old_table_to, link_table, link_col_from, link_col_to, bothWays) {
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

                            //make the request
                            mongoRequestsPending++;
                            mappingRequest(db, collectionFrom, new_id_from, new_id_to, collectionTo+"ID");
                            if(bothWays){
                                mongoRequestsPending++;
                                mappingRequest(db, collectionTo, new_id_to, new_id_from, collectionFrom+"ID");
                            }
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
    MongoClient.connect(mongoAddress, function (err,mongoDB) {
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
        var updateCount = 0;
        var eventsUpdateCount = 0;
        async.waterfall([
            function (wtfCallback) {
                db.collection('users').find({}).toArray(function (err, users) {
                    if(err){
                        wtfCallback(err);
                    }else{
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
                                wtfCallback(err);
                            }else{
                                console.log("Updated "+updateCount+" users");
                                wtfCallback();
                            }
                        });
                    }
                });
            },
            function (wtfCallback) {
                db.collection('calendar-events').find({}).toArray(function (err, events) {
                    if(err){
                        wtfCallback(err);
                    }else{
                        async.each(events, function (event, callback) {
                            var newGroups = [];
                            if(event.groupsID){
                                for(var i=0; i<event.groupsID.length; i++){
                                    //console.log(conversionArrays.groupsID[event.groupsID[i]]);
                                    newGroups.push(conversionArrays.groupsID[event.groupsID[i]]);
                                }
                                //console.log(newGroups);
                            }
                            db.collection('calendar-events').update({_id: event._id}, {$set: {groupsID: newGroups}}, function (err, wres) {
                                if(err){
                                    callback(err);
                                }else{
                                    eventsUpdateCount++;
                                    callback();
                                }
                            });
                        }, function (err) {
                            if(err){
                                wtfCallback(err);
                            }else{
                                console.log("Updated "+eventsUpdateCount+" events");
                                wtfCallback();
                            }
                        });
                    }
                });
            }
        ], function (err) {
            if(err){
                console.log(err);
            }else{
                console.log("SUCCESS");
                db.close();
            }
        });
    });
});