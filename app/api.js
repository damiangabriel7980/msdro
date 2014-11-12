var Content     = require('./models/articles');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var bodyParser	= require('body-parser');
var Events = require('./models/events');

module.exports = function(app, router) {

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
            var userGr = req.user.groupsID;
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
            var userGr = req.user.groupsID;
            Content.find({type: req.params.content_type, groupsID: { $in: userGr}}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/products')

    .get(function(req, res) {
        Products.find(function(err, cont) {
            if(err) {
                res.send(err);
            }

            res.json(cont);
        });
    });

    router.route('/products/:id')

        .get(function(req, res) {
            Products.findById(req.params.id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
        });

    router.route('/products/productsByArea/:id')

        .get(function(req, res) {
            var test = new Array(req.params.id);
            if(test[0]!=0)
            {Products.find({'therapeutic-areasID': {$in :test}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                 console.log(cont);
                res.json(cont);
            })}
            else
            {
                Products.find(function(err, cont) {
                    if(err) {
                        res.send(err);
                    }

                    res.json(cont);
                });
            }
        });

    router.route('/therapeutic_areas')

        .get(function(req, res) {
            Therapeutic_Area.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        });

    //router.route('/therapeutic_areas/:therapeutic_areas_id')
    //
    //    .get(function(req, res) {
    //        Therapeutic_Area.findById(req.params._id, function(err, cont) {
    //            if(err) {
    //                res.send(err);
    //            }
    //
    //            res.json(cont);
    //        })
    //    });

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
            }).limit(50);

        });
    router.route('/calendar/:id')
        .get(function(req,res){
            Events.findById(req.params.id,function(err, cont) {
                if(err) {
                    res.send(err);
                }
                console.log(cont);
                res.json(cont);
            });

        });
    router.route('/multimedia2/:idd')
        .get(function(req,res){
            multimedia.findById(req.params.idd,function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia')
        .get(function(req,res){
            multimedia.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.send(cont);
            });

        });
    router.route('/multimedia/multimediaByArea/:id')
        .get(function(req,res){
            var x = req.params.id;
            if(req.params.id!='0') {
                multimedia.findById(x,function(err, cont){

                    if (err) {
                        console.log(err);
                        res.send(err);
                        return ;
                    }
                    console.log(cont);
                    var prods = [];
                    for (var i = 0; i < cont.length; i++)
                    {
                        if(cont[i].type=='multimedia')
                            prods.push(cont.entities[i]);
                    }
                    console.log(prods);
                    res.send(prods);
                })
            }
            else
            {
                multimedia.find(function (error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.send(result);
                    }
                });
            }
        });
    router.route('/teste')
        .get(function(req,res){
            teste.find(function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    console.log(result);
                    res.send(result);
                }
            });
        });
    router.route('/teste/:id')
        .get(function(req,res) {
            teste.findById(req.params.id, function (err, cont) {
                if (err) {
                    res.send(err);
                    return;
                }
                console.log(cont);
                res.send(cont);
            });
        });
    app.use('/api', router);
};
