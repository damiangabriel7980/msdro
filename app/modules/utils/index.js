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
var validationStrings = {
    name: {
        str: '^[a-zA-ZĂăÂâÎîȘșŞşȚțŢţ\\-\\s]{3,100}$'
    },
    phone: {
        str: '^[0-9]{10,20}$'
    },
    jobName: {
        str: '^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\s]{3,30}$'
    },
    jobNumber: {
        str: '^[a-zA-Z0-9\\-\\s]{1,5}$'
    },
    authorAndTitle: {
        str: '^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\s]{3,100}$'
    },
    streetName: {
        str: '^[a-zA-Z0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\+\\)\\(\\-\\_\\"\\;\\,\\/]{1}[a-zA-Zs0-9ĂăÂâÎîȘșŞşȚțŢţ\\.\\+\\)\\(\\-\\_\\"\\;\\,\\/\\s]{1,50}$',
        options: "i"
    },
    nickname: {
        str: '^[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>]{1}[a-zĂăÂâÎîȘșŞşȚțŢţ0-9\\.\\?\\+\\*\\^\\$\\)\\[\\]\\{\\}\\|\\!\\@\\#\\%||&\\^\\(\\-\\_\\=\\+\\:\\"\\;\\/\\,\\<\\>\\-_]{1,50}$',
        options: "i"
    }
};

exports.validationStrings  = validationStrings;

exports.regexes = {
    name: new XRegExp(validationStrings.name.str),
    phone: new XRegExp(validationStrings.phone.str),
    jobName: new XRegExp(validationStrings.jobName.str),
    jobNumber: new XRegExp(validationStrings.jobNumber.str),
    authorAndTitle: new XRegExp(validationStrings.authorAndTitle.str),
    streetName: new XRegExp(validationStrings.streetName.str,validationStrings.streetName.options),
    nickname: new XRegExp(validationStrings.nickname.str,validationStrings.nickname.options),
    emailQuery: function (email) {
        return {$regex: "^" + (email || "").replace(/\+/g,"\\+") + "$", $options: "i"};
    },
    startsWithLetter: function (letter) {
        return new XRegExp("^" + letter, "i");
    }
};