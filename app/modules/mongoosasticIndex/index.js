/**
 * Created by andreimirica on 06.07.2015.
 */
/**
 * Mongoosastic Index module.
 * @module mongoosasticIndexModule
 */
var mongoosasticIndex = function(ObjectToIndex){
    var stream = ObjectToIndex.synchronize();
    var count = 0;
    stream.on('data', function(err, doc){
        count++;
    });
    stream.on('close', function(){
        console.log('indexed ' + count + ' documents!');
    });
    stream.on('error', function(err){
        console.log(err);
    });
};
module.exports = {
    /**
     * Index a mongoDB entity for search
     *
     * @function
     * @name mongoosasticIndex
     * @param {Object} ObjectToIndex - A mongoDB model to index
     * @example
     * var mongoosasticIndexer = require(/path/to/mongoosasticIndex/module)
     * var Article = mongoose.model('articles', articlesSchema);
     * mongoosasticIndexer.mongoosasticIndex(Article);
     */
    mongoosasticIndex :  mongoosasticIndex
};