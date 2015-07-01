module.exports = function(logger){
    return function(res, object, message){
        res.send({success: object, message: message});
    };
};