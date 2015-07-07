var Q = require('q');
var async = require('async');

var XRegExp  = require('xregexp').XRegExp;

exports.discardFields = function(obj, fieldsArray) {
    fieldsArray = fieldsArray || [];
    for(var key in obj){
        if(fieldsArray.indexOf(key) >=0) delete obj[key];
    }
};
exports.allowFields = function(obj, fieldsArray) {
    fieldsArray = fieldsArray || [];
    for(var key in obj){
        if(fieldsArray.indexOf(key) == -1) delete obj[key];
    }
};
exports.isDate = function (obj) {
    return obj && obj.constructor && obj.constructor.toString && obj.constructor.toString().indexOf("Date") > -1;
};
exports.isArray = function (obj) {
    return obj && obj.constructor && obj.constructor.toString && obj.constructor.toString().indexOf("Array") > -1;
};
exports.isEmptyObject = function (obj) {
    return Object.keys(obj).length === 0;
};

//receives an array of documents and returns an array with only the id's of those documents
exports.getIds = function (arr, convertToString) {
    var deferred = Q.defer();
    var ret = [];
    async.each(arr, function (item, callback) {
        if(item._id){
            convertToString?ret.push(item._id.toString()):ret.push(item._id);
        }
        callback();
    }, function () {
        deferred.resolve(ret);
    });
    return deferred.promise;
};

exports.regexes = {
    name: new XRegExp('^[a-zA-ZĂăÂâÎîȘșŞşȚțŢţ-\\s]{3,100}$'),
    phone: new XRegExp('^[0-9]{10,20}$'),
    jobName: new XRegExp('^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\s]{3,30}$'),
    jobNumber: new XRegExp('^[a-zA-Z0-9-\\s]{1,5}$'),
    authorAndTitle: new XRegExp('^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\s]{3,100}$'),
    streetName: new XRegExp('^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>]{1}[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\-_]{1,50}$','i'),
    nickname: new XRegExp('^[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>]{1}[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\-_]{1,50}$','i'),
    emailQuery: function (email) {
        return {$regex: "^" + (email || "").replace(/\+/g,"\\+") + "$", $options: "i"};
    },
    startsWithLetter: function (letter) {
        return new XRegExp("^" + letter, "i");
    }
};