/**
 * Created by andreimirica on 11.11.2015.
 */

var JanuviaUsers = require('../../models/januvia/januvia_users');
var Counties = require('../../models/counties');
var async = require('async');
var Q = require('q');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var _ = require('underscore');
var mrObj = {};

mrObj.map = function(){
    emit(this._id,this.name);
};

mrObj.reduce = function (k, vals) {
    return "TBD";
};

mrObj.finalize = function (k, vals) {
    return vals.toLowerCase().replace("-","").replace(/\s+/g, "");
};

mrObj.out = {
    inline: 1
};

var insertUsers = function(arrayOfData){
    var deferred = Q.defer();
    var UsersTemp = null;
    JanuviaUsers.mapReduce(mrObj,function(err,data,stats){
        if(err){
            deferred.reject(err);
        }
        else {
            UsersTemp = data;
            async.eachSeries(arrayOfData, function(item, callback){
                        var nameMedic = lowerString(item[medic]);
                        var nameRep = lowerString(item[rep]);
                        var CityName = lowerString(item[city]);
                        var realMed = Capitalise(item[medic],true);
                        var realRep = Capitalise(item[rep],true);
                        var checkMedic = _.findWhere(UsersTemp, {'value': nameMedic});
                        if(checkMedic){
                            addRep(nameRep, realRep, checkMedic._id, UsersTemp).then(
                                function(success){
                                    callback();
                                },
                                function (err) {
                                    callback(err);
                                }
                            );
                        } else{
                            //first we find the county
                            Counties.findOne({label: item[county]}).populate('citiesID').exec(function(err, foundCounty){
                                if(err || !foundCounty){
                                    callback('County not found / Error processing county field');
                                } else {
                                    formatCitiesArray(foundCounty.citiesID).then(
                                        function (citiesFormatted) {
                                            var checkCity = _.findWhere(citiesFormatted, {'name': CityName});
                                            if(!checkCity)
                                                callback('City not found!');
                                            else {
                                                var medicToCreate = {};
                                                medicToCreate.type = 'medic';
                                                medicToCreate.date_created = new Date();
                                                medicToCreate.last_modified = new Date();
                                                medicToCreate.users_associated = [];
                                                medicToCreate.name = realMed;
                                                medicToCreate.city = ObjectId(checkCity._id);
                                                medicToCreate.workplace = Capitalise(item[workplace],true);
                                                medicToCreate.workplaceAddress = Capitalise(item[workplaceAddress],true);
                                                var toSaveMed = new JanuviaUsers(medicToCreate);
                                                toSaveMed.save(function(err,respMed) {
                                                    if (err) {
                                                        callback(err);
                                                    }
                                                    else {
                                                        UsersTemp.push({_id: respMed._id, value: nameMedic});
                                                        addRep(nameRep, realRep, respMed._id, UsersTemp).then(
                                                            function(success){
                                                                callback();
                                                            },
                                                            function (err) {
                                                                callback(err);
                                                            }
                                                        );
                                                    }
                                                });
                                            }
                                        },
                                        function (err) {
                                            callback('Error while processing cities!');
                                        }
                                    );

                                }
                            });
                        }
                    }, function (err) {
                        if(err){
                            deferred.reject(err);
                        }else{
                            deferred.resolve();
                        }
                    });
            }

    });

    return deferred.promise;
};

module.exports = {
    insertUsers: insertUsers
};

