var successCodes = {
    0: "Cererea a fost procesata cu succes"
};

module.exports = function(logger){
    return function(res, object, code){
        res.send({success: object, message: successCodes[code || 0]});
    };
};