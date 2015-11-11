/**
 * Created by andreimirica on 11.11.2015.
 */

var JanuviaUsers = require('../../models/januvia/januvia_users');
var Cities = require('../../models/cities');
var async = require('async');
var Q = require('q');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var DiacriticsToLetters = function(input,anotherChar){
    if(typeof input !== 'string') input = "";
    console.log(input);
    var text = input
        .replace(/Ă/g,'A')
        .replace(/ă/g,'a')
        .replace(/Â/g,'A')
        .replace(/â/g,'a')
        .replace(/Î/g,'i')
        .replace(/î/g,'i')
        .replace(/Ș/g,'S')
        .replace(/ș/g,'s')
        .replace(/Ş/g,'S')
        .replace(/ş/g,'s')
        .replace(/Ț/g,'t')
        .replace(/ț/g,'t')
        .replace(/Ţ/g,'t')
        .replace(/ţ/g,'t');
    if(anotherChar)
        text = input.replace(',','');
    console.log(text);
    return text;
};

function Capitalise(string, isName) {
    if(isName){
        var nameArray = string.split(" ");
        var newName = '';
        for(var i = 0; i < nameArray.length; i++){
            var space;
            if( i == nameArray.length - 1)
             space = "";
            else
                space = " ";
            newName += nameArray[i].charAt(0).toUpperCase() + nameArray[i].slice(1).toLowerCase() + space;
        }
        newName = DiacriticsToLetters(newName,true);
        return newName;
    }else
        return DiacriticsToLetters(string.charAt(0).toUpperCase() + string.slice(1).toLowerCase());
}

var medic = 'Associated Contact';
var rep = 'Owner';
var workplace = 'Account';
var workplaceAddress = 'Account Address Address 1';
var city = 'Account Address City';


var insertUsers = function(arrayOfData){
    var deferred = Q.defer();
    async.each(arrayOfData, function(item, callback){

        var nameMedic = Capitalise(item[medic],true);
        var nameRep = Capitalise(item[rep],true);
        var CityName = Capitalise(item[city],true);
        JanuviaUsers.find({name : nameMedic}).exec(function(err,resp){
            if(err)
                deferred.reject(err);
            else {
                if(resp.length > 0)
                    callback();
                else {
                    Cities.findOne({name: CityName}).exec(function(err,retCity){
                        if(err)
                            deferred.reject(err);
                        else{
                            if(!retCity){
                                console.log('jere');
                                deferred.reject(err);
                            }
                            else
                                var medicToCreate = {};
                                medicToCreate.type = 'medic';
                                medicToCreate.date_created = new Date();
                                medicToCreate.last_modified = new Date();
                                medicToCreate.users_associated = [];
                                medicToCreate.name = nameMedic;
                                medicToCreate.city = ObjectId(retCity._id);
                                medicToCreate.workplace = Capitalise(item[workplace],true);
                                medicToCreate.workplaceAddress = Capitalise(item[workplaceAddress],true);
                                medicToCreate.save(function(err,respMed){
                                if(err)
                                    callback(err);
                                else {
                                    JanuviaUsers.findOne({name : nameRep}).exec(function(err,respRep){
                                        if(err)
                                            deferred.reject(err);
                                        else{
                                            if(!respRep){
                                                var repToCreate = {};
                                                repToCreate['type'] = 'reprezentant';
                                                repToCreate.date_created = new Date();
                                                repToCreate.last_modified = new Date();
                                                repToCreate.users_associated = [];
                                                repToCreate.users_associated.push(ObjectId(medicToCreate._id));
                                                repToCreate.name = nameRep;
                                                repToCreate.city = '';
                                                repToCreate.workplace = '';
                                                repToCreate.workplaceAddress = '';
                                                repToCreate.save(function(err,resp){
                                                    if(err)
                                                        deferred.reject(err);
                                                    else{
                                                        callback();
                                                    }
                                                })
                                            } else {
                                                respRep.users_associated.push(ObjectId(medicToCreate._id));
                                                respRep.save(function(err,resp){
                                                    if(err)
                                                        deferred.reject(err);
                                                    else{
                                                        callback();
                                                    }
                                                })
                                                 }
                                            }
                                        });
                                }

                                })

                        }
                    })
                }
            }

        })
    }, function (err) {
        if(err){
            deferred.reject(err);
        }else{
            deferred.resolve();
        }
    });
    return deferred.promise;
};

module.exports = {
    insertUsers: insertUsers
};

