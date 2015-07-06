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
    type:         {type:Number, index: true},
    created: Date,
    last_updated: Date,
    version:      Number,
    enable:       Boolean,
    image_path:   String,
    groupsID:     {type:Array, index: true},
    associated_images: Array
});
articlesSchema.plugin(mongoosastic,{host:my_config.elasticServer, port:my_config.elasticPORT});

module.exports = mongoose.model('articles', articlesSchema);
var Article = mongoose.model('articles', articlesSchema);
articlesSchema.index({title: 1});
Article.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
Article.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});
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