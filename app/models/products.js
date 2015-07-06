/**
 * Created by miricaandrei23 on 15.10.2014.
 */
var mongoose		= require('mongoose');
var mongoosastic = require('mongoosastic');
var Schema			= mongoose.Schema;

var Config = require('../../config/environment.js'),
    my_config = new Config();

var ProductSchema		= new Schema({
    description: {type:String,es_indexed:true},
    enable:      Boolean,
    file_path:   String,
    image_path:  String,
    last_updated: Date,
    name: {type:String,es_indexed:true, index: true},
    groupsID: [{type: String, ref: 'UserGroup', index: true}],
    'therapeutic-areasID': [{type: String, ref: 'therapeutic-areas', index: true}]
});
ProductSchema.plugin(mongoosastic,{host:my_config.elasticServer,port:my_config.elasticPORT});
module.exports = mongoose.model('products', ProductSchema);
var Product = mongoose.model('products', ProductSchema);
ProductSchema.index({name: 1});
Product.ensureIndexes(function (err) {
    if (err)
        console.log(err);
});
Product.on('index', function (err) {
    if (err)
        console.log(err); // error occurred during index creation
});
var stream = Product.synchronize();
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