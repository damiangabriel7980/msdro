var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;

//type: 1 = normal
//      2 = legislativ
//      3 = stiintific
var articlesSchema		= new Schema({
    title:        {type:String, es_indexed:true},
    author:       String,
    description:  String,
    text:         {type:String, es_indexed:true},
    type:         Number,
    last_updated: Date,
    version:      Number,
    enable:       Boolean,
    image_path:   String,
    groupsID:     Array,
    associated_images: Array
});
articlesSchema.plugin(mongoosastic,{host:process.env.elasticServer, port:process.env.elasticPORT});

module.exports = mongoose.model('articles', articlesSchema);
var Article = mongoose.model('articles', articlesSchema);
var stream = Article.synchronize();
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