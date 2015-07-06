/**
 * Created by andreimirica on 06.07.2015.
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
    mongoosasticIndex :  mongoosasticIndex
};