/**
 * Created by andreimirica on 06.07.2015.
 */
/**
 * Mongoose Index module.
 * @module mongooseIndexModule
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
    /**
     * Index a mongoDB entity for better query performance
     *
     * @function
     * @name mongooseIndex
     * @param {Object} ObjectToIndex - A mongoDB model to index
     * @example
     * var mongooseIndexer = require(/path/to/mongooseIndex/module)
     * var Article = mongoose.model('articles', articlesSchema);
     * mongooseIndexer.mongooseIndex(Article);
     */
    mongooseIndex : mongooseIndex
};