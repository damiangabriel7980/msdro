var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;

var Config = require('../../config/environment.js'),
    my_config = new Config();

//type: 1 = normal
//      2 = legislativ
//      3 = stiintific
var articlesSchema		= new Schema({
    title:        {type:String, es_indexed:true},
    author:       String,
    description:  String,
    text:         {type:String, es_indexed:true},
    type:         Number,
    created: Date,
    last_updated: Date,
    version:      Number,
    enable:       Boolean,
    image_path:   String,
    groupsID:     Array,
    associated_images: Array
});
articlesSchema.plugin(mongoosastic,{host:my_config.elasticServer, port:my_config.elasticPORT, auth:my_config.elasticUser+":"+my_config.elasticPass});

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