var Content     = require('./models/content');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var bodyParser	= require('body-parser');
var Events = require('./models/events');

module.exports = function(app, router,client) {

    router.route('/content')

        .get(function(req, res) {
            Content.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        });

    router.route('/content/:content_id')

        .get(function(req, res) {
            var userGr = req.user.groupsID.split(",");
            Content.find({_id:req.params.content_id, groupsID: { $in: userGr}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                if(cont.length == 1){
                    res.json(cont[0]);
                }else{
                    res.json(null);
                }
            })
        });

    router.route('/content/type/:content_type')

        .get(function(req, res) {
            var userGr = req.user.groupsID.split(",");
            Content.find({type: req.params.content_type, groupsID: { $in: userGr}}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/products')

    .get(function(req,res){

//Call request to initiate the API call
    client.request({method: 'GET' , endpoint: 'products'}, function (error, result) {
        if (error) {
            res.send(error);
        } else {
            res.json(result);
        }
    })});

    router.route('/products/:id')

        .get(function(req,res){
            if(req.params.id!='0')
            {
            var y = req.params.id;
            client.getEntity({method: 'GET' , type: 'products', uuid: y }, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                console.log(cont);
                res.json(cont._data);
            })
            }});

    router.route('/products/productsByArea/:id')

        .get(function(req, res) {
            var x = req.params.id;
            if(req.params.id!='0')
            {
            client.request({method: 'GET' , endpoint: 'products', qs:{ql:"area_parent= '" + x + "'"}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                 console.log(cont);
                res.send(cont.entities);
            })}
            else
            {
                client.request({method: 'GET' , endpoint: 'products'}, function (error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.send(result.entities);
                    }
                });
            }
        });

    router.route('/therapeutic_areas')

        .get(function(req, res) {
            client.request({method: 'GET' , endpoint: 'therapeuticareas'}, function (error, result) {
                if (error) {
                    res.send(error);
                } else {
                    res.send(result.entities);
                }
            });
        });

    router.route('/userGroup')

        .get(function(req, res) {
            UserGroup.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        });

    router.route('/userGroup/:group_id')

        .get(function(req, res) {
            UserGroup.findById(req.params.group_id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
        });
    router.route('/calendar')
        .get(function(req,res){
            Events.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    router.route('/calendar/:id')
        .get(function(req,res){
            Events.findById(req.params.id,function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia/:id')
        .get(function(req,res){
            Events.findById(req.params.id,function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia')
        .get(function(req,res){
            Events.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    app.use('/api', router);
};
