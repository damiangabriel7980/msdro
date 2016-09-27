var Q = require('q');
var async = require('async');

var XRegExp  = require('xregexp').XRegExp;

var RFC822 = /(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*:(?:(?:\r\n)?[ \t])*(?:(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*)(?:,\s*(?:(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*|(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)*\<(?:(?:\r\n)?[ \t])*(?:@(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*(?:,@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*)*:(?:(?:\r\n)?[ \t])*)?(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|"(?:[^\"\r\\]|\\.|(?:(?:\r\n)?[ \t]))*"(?:(?:\r\n)?[ \t])*))*@(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*)(?:\.(?:(?:\r\n)?[ \t])*(?:[^()<>@,;:\\".\[\] \000-\031]+(?:(?:(?:\r\n)?[ \t])+|\Z|(?=[\["()<>@,;:\\".\[\]]))|\[([^\[\]\r\\]|\\.)*\](?:(?:\r\n)?[ \t])*))*\>(?:(?:\r\n)?[ \t])*))*)?;\s*)/;

/**
 * Utils module.
 * @module utilsModule
 */

var discardFields = function(obj, fieldsArray) {
    fieldsArray = fieldsArray || [];
    for(var key in obj){
        if(fieldsArray.indexOf(key) >=0) delete obj[key];
    }
};
/**
 * Function that removes fields from object
 *
 * @name discardFields
 * @function
 * @param {Object} object - The object which will be stripped of properties
 * @param {Array} fieldsArray - An array of properties to remove from the object
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var strippedObject = utilsModule.discardFields({prop: 1}, ['prop']);
 */
exports.discardFields = discardFields;

/**
 * Function that keeps only certain properties of an object
 *
 * @name allowFields
 * @function
 * @param {Object} object - The object which will be stripped of properties
 * @param {Array} fieldsArray - An array of properties to keep from the object
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var strippedObject = utilsModule.allowFields({prop: 1, pros:2}, ['prop']);
 */
exports.allowFields = function(obj, fieldsArray) {
    fieldsArray = fieldsArray || [];
    for(var key in obj){
        if(fieldsArray.indexOf(key) == -1) delete obj[key];
    }
};

/**
 * Function that returns true if a property is a date
 *
 * @name isDate
 * @function
 * @param {Date} dateProperty - The property to check if it's a date
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var date = new Date();
 * var isDate = utilsModule.isDate(date);
 */
exports.isDate = function (obj) {
    return obj && obj.constructor && obj.constructor.toString && obj.constructor.toString().indexOf("Date") > -1;
};

/**
 * Function that returns true if a property is an array
 *
 * @name isArray
 * @function
 * @param {Array} arrayProperty - The property to check if it's an array
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var arr = [];
 * var isArray = utilsModule.isArray(arr);
 */
exports.isArray = function (obj) {
    return obj && obj.constructor && obj.constructor.toString && obj.constructor.toString().indexOf("Array") > -1;
};

/**
 * Function that returns true if an object is empty
 *
 * @name isEmptyObject
 * @function
 * @param {Object} objectParam - The object to check if it's empty
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var obj = {};
 * var isObj = utilsModule.isEmptyObject(obj);
 */
exports.isEmptyObject = function (obj) {
    return Object.keys(obj).length === 0;
};

/**
 * Function that returns a date to which a number of days were added/subtracted or null if existing date is not valid
 *
 * @name addDaysToDate
 * @function
 * @param {Date} date - The date to add/subtract days
 * @param {Number} days - The number of days to add/subtract
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var date = new Date();
 * var futureDate = utilsModule.addDaysToDate(date, -4);
 */
exports.addDaysToDate = function (date, days) {
    try{
        return new Date().setDate(date.getDate() + days);
    }catch(ex){
        return null;
    }
};

/**
 * Function that returns an array of MongoDB ids subtracted from an array of MongoDB objects
 *
 * @name getIds
 * @function
 * @param {Array} arr - An array of MongoDB Objects
 * @param {Boolean} convertToString - Optional Boolean param if we want the ids to be Strings instead of ObjectIDs
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var mongoArr = [{_id: "23121212dswwwd21", name: "someName"},{_id: "23121212dswwwd21dd", name: "someNameTwo"}];
 * utilsModule.getIds(mongoArr, true).then(
 *      function(success){
 *
 *      },
 *      function(error){
 *
 *      }
 * );
 */
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
/**
 * A variable in the global namespace called 'validationStrings' used for validating certain strings.
 * @var {Object} validationStrings
 */
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
    },
    email: {
        str: RFC822,
        stringified: RFC822.toString()
    }
};
exports.validationStrings  = validationStrings;


    var fixUpdateId = function(req,res,next){
        discardFields(req.body , ['_id']);
        next();
    };

exports.fixUpdateId = fixUpdateId;

/**
 * Function that returns true if a string is a valid email address
 *
 * @name validateEmail
 * @function
 * @param {String} emailAddress - The string to check if it's a valid email address
 * @example
 * var utilsModule = require(/path/to/utils/module)
 * var email = "john@test.com";
 * var isEmail = utilsModule.validateEmail(email);
 */
exports.validateEmail = function(str){
    return new XRegExp(validationStrings.email.str).test(str);
}

exports.regexes = {
    /**
     * Function that returns true if a string is a valid name based on validationStrings name.str property
     *
     * @name name
     * @function
     * @param {String} name - The string to check if it's a valid name
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var name = "john@test.com";
     * var isName = utilsModule.regexes.name(name);
     */
    name: new XRegExp(validationStrings.name.str),
    /**
     * Function that returns true if a string is a valid phone number based on validationStrings phone.str property
     *
     * @name phone
     * @function
     * @param {String} phone - The string to check if it's a valid phone number
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var phone = "23141515";
     * var isPhone = utilsModule.regexes.phone(phone);
     */
    phone: new XRegExp(validationStrings.phone.str),
    /**
     * Function that returns true if a string is a valid job name based on validationStrings jobName.str property
     *
     * @name jobName
     * @function
     * @param {String} jobName - The string to check if it's a valid job name
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var jobName = "nameOfJob";
     * var validJobName = utilsModule.regexes.jobName(jobName);
     */
    jobName: new XRegExp(validationStrings.jobName.str),
    /**
     * Function that returns true if a string is a valid job number based on validationStrings jobNumber.str property
     *
     * @name jobNumber
     * @function
     * @param {String} jobNumber - The string to check if it's a valid job number
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var jobNumber = "23141515";
     * var validJobNumber = utilsModule.regexes.jobNumber(jobNumber);
     */
    jobNumber: new XRegExp(validationStrings.jobNumber.str),
    /**
     * Function that returns true if a string is a valid author&title based on validationStrings authorAndTitle.str property
     *
     * @name authorAndTitle
     * @function
     * @param {String} authorAndTitle - The string to check if it's a valid author&title
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var authorAndTitle = "Author (Title)";
     * var validAuthorTitle = utilsModule.regexes.authorAndTitle(authorAndTitle);
     */
    authorAndTitle: new XRegExp(validationStrings.authorAndTitle.str),
    /**
     * Function that returns true if a string is a valid street name based on validationStrings streetName.str property
     *
     * @name streetName
     * @function
     * @param {String} streetName - The string to check if it's a valid street name
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var streetName = "nameOfstreet";
     * var streetName = utilsModule.regexes.streetName(streetName);
     */
    streetName: new XRegExp(validationStrings.streetName.str,validationStrings.streetName.options),
    /**
     * Function that returns true if a string is a valid nickname based on validationStrings nickname.str property
     *
     * @name nickname
     * @function
     * @param {String} nickname - The string to check if it's a valid nickname
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var nickname = "wd@wwd";
     * var validNickname = utilsModule.regexes.nickname(nickname);
     */
    nickname: new XRegExp(validationStrings.nickname.str,validationStrings.nickname.options),
    email: new XRegExp(validationStrings.email.str),
    emailQuery: function (email) {
        return {$regex: "^" + (email || "").replace(/\+/g,"\\+") + "$", $options: "i"};
    },
    /**
     * Function that returns true if a string starts with a letter
     *
     * @name startsWithLetter
     * @function
     * @param {String} startsWithLetter - The string to check if it starts with a letter
     * @example
     * var utilsModule = require(/path/to/utils/module)
     * var startsWithLetter = "A221s";
     * var beginsWithLetter = utilsModule.regexes.startsWithLetter(startsWithLetter);
     */
    startsWithLetter: function (letter) {
        return new XRegExp("^" + letter, "i");
    }
};