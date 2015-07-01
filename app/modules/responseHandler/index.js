/**
 * Created by andreimirica on 29.06.2015.
 */
module.exports = function(logger){
    var handleErr = function(res, error ,status, message){
        logger.log(error);
        if(status === 500)
        {
            res.send(500,{error: 'A aparut o eroare pe server!'});
        }
        else{
            res.send(status,{error: message})
        }
    };

    var handleSuccess = function(res, object){
        res.send({success: object});
    };

    return {
        handleError: handleErr,
        handleSuccess: handleSuccess
    }
};