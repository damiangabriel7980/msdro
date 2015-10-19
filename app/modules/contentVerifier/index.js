/**
 * Created by andreimirica on 19.10.2015.
 */
var Q = require('q');
var _ = require('underscore');

var getContentById = function(content_entity, content_id, userSpecialGroups, markView, entity_enable_property, populateFields, groupsField, isCourse) {
    var deferred = Q.defer();
    //first check if the user has access tot the content
    var queryParams = {_id: content_id};
    queryParams[entity_enable_property] = true;
    if(isCourse){
        content_entity.findOne(queryParams).deepPopulate('listChapters.listSubchapters.listSlides',{
            whitelist: ["listChapters.listSubchapters.listSlides"],
            populate: {
                "listChapters": {
                    match: {enabled: true}
                },
                "listChapters.listSubchapters": {
                    match: {enabled: true}
                },
                "listChapters.listSubchapters.listSlides": {
                    match: {enabled: true}
                }
            }
        }).exec(function(err, content){
            if(err)
                deferred.reject({status: 500, message: err});
            else {
                if(!content)
                    deferred.reject({status: 404, message: "Content not found"});
                else{
                    if(userSpecialGroups){
                        //create string arrays since UnderscoreJS doesn't know to compare ObjectId's
                        var userGroups = convertToStrings(userSpecialGroups);
                        var itemGroups = convertToStrings(content[groupsField]);
                        var intersection = _.intersection(userGroups,itemGroups);
                        if(intersection.length >= 1){
                            if(markView){
                                markViews(content_entity,content_id).then(
                                    function (success) {
                                        deferred.resolve(success);
                                    },
                                    function (err) {
                                        deferred.reject({status: 500, message: err});
                                    }
                                )
                            } else
                                deferred.resolve(content);
                        }else{
                            deferred.reject({status: 403, message: "Access forbidden!"});
                        }
                    } else {
                        if(markView){
                            markViews(content_entity,content_id).then(
                                function (success) {
                                    deferred.resolve(success);
                                },
                                function (err) {
                                    deferred.reject({status: 500, message: err});
                                }
                            )
                        } else
                            deferred.resolve(content);
                    }
                }
            }
        });
    } else {
        var fields;
        if(populateFields)
            fields = populateFields;
        else
            fields = '';
        content_entity.findOne(queryParams).populate(fields).exec(function(err, content){
            if(err)
                deferred.reject({status: 500, message: err});
            else {
                if(!content)
                    deferred.reject({status: 404, message: "Content not found"});
                else{
                    if(userSpecialGroups){
                        //create string arrays since UnderscoreJS doesn't know to compare ObjectId's
                        var userGroups = convertToStrings(userSpecialGroups);
                        var itemGroups = convertToStrings(content[groupsField]);
                        var intersection = _.intersection(userGroups,itemGroups);
                        if(intersection.length >= 1){
                            if(markView){
                                markViews(content_entity,content_id).then(
                                    function (success) {
                                        deferred.resolve(success);
                                    },
                                    function (err) {
                                        deferred.reject({status: 500, message: err});
                                    }
                                )
                            } else
                                deferred.resolve(content);
                        }else{
                            deferred.reject({status: 403, message: "Access forbidden!"});
                        }
                    } else {
                        if(markView){
                            markViews(content_entity,content_id).then(
                                function (success) {
                                    deferred.resolve(success);
                                },
                                function (err) {
                                    deferred.reject({status: 500, message: err});
                                }
                            )
                        } else
                            deferred.resolve(content);
                    }
                }
            }
        });
    }

    return deferred.promise;
};

function markViews (content_entity, entity_id) {
    var deferred = Q.defer();
    var updateQuery = {$inc: {}};
    var upd = "nrOfViews";
    updateQuery.$inc[upd] = 1;
    content_entity.findOneAndUpdate({_id: entity_id},updateQuery, {upsert: false}, function (err, resp) {
        if(err){
            deferred.reject({status: 500, message: err});
        }else{
            deferred.resolve(resp);
        }
    });
    return deferred.promise;
};

var convertToStrings = function(arrayToConvert){
    var converted = [];
  for(var i=0; i < arrayToConvert.length; i++)
    converted.push(arrayToConvert[i].toString());
    return converted;
};

module.exports = {
    getContentById: getContentById
};