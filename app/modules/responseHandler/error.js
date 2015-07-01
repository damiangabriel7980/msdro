var errorCodes = {
    0: "Eroare necunoscuta"
};

module.exports = function(logger){
    return function(res, error ,status, code){
        logger.log(error);
        if(status === 500)
        {
            res.send(500,{error: 'A aparut o eroare pe server!'});
        }
        else{
            res.send(status,{error: errorCodes[code || 0]})
        }
    };
};