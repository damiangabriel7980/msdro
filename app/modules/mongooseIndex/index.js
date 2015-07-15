/**
 * Created by andreimirica on 06.07.2015.
 */
var mongooseIndex = function(ObjectToIndex){
    ObjectToIndex.ensureIndexes(function (err) {
        if (err)
            console.log(err);
    });
    ObjectToIndex.on('index', function (err) {
        if (err)
            console.log(err); // error occurred during index creation
    });
};
module.exports = {
    mongooseIndex : mongooseIndex
};