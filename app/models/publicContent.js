var mongoose		= require('mongoose');
var Schema			= mongoose.Schema;
var mongoosastic = require('mongoosastic');

//type: 1 = stire
//      2 = articol
//      3 = elearning
//      4 = download
var publicContentSchema		= new Schema({
    title:        {type:String, es_indexed:true},
    author:       String,
    description:  {type:String, es_indexed:true},
    text:         {type:String, es_indexed:true},
    type:         Number,
    date_added:   Date,
    last_updated: Date,
    enable:       Boolean,
    image_path:   String,
    file_path:   String,
    'therapeutic-areasID': Array
});
publicContentSchema.plugin(mongoosastic,{host:'10.200.0.221',port:'9200'});


module.exports = mongoose.model('public-content', publicContentSchema, 'public-content');
var PublicContent = mongoose.model('public-content', publicContentSchema);
var stream = PublicContent.synchronize();
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