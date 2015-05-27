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