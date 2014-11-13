var Content     = require('./models/articles');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var bodyParser	= require('body-parser');
var Events = require('./models/events');
var Counties = require('./models/counties');
var Cities = require('./models/cities');
var Multimedia = require('./models/multimedia');

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

    router.route('/userdata')

        .get(function(req, res) {
            var user = req.user;
            res.json(user);
        });

    router.route('/counties')

        .get(function(req, res) {
            Counties.find({}, {name: 1}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                res.json(cont);
            });
        });

    router.route('/cities/:county_name')

        .get(function(req, res) {
            Counties.find({name: req.params.county_name}, function (err, counties) {
                if(err) {
                    res.send(err);
                }
                Cities.find({_id: {$in: counties[0].citiesID}}, function (err, cities) {
                    if(err) {
                        console.log("errr");
                        res.send(err);
                    }
                    res.json(cities);
                });
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
            Multimedia.findById(req.params.idd,function(err, cont) {
                if(err) {
                    res.json(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia')
        .get(function(req,res){
            Multimedia.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });

        });
    router.route('/multimedia/multimediaByArea/:id')
        .get(function(req,res){
            var x = [];
            x.push(req.params.id);
            console.log(x);
            if (x[0] != 0) {
                console.log(x[0]);
                Multimedia.find({'enable': false}, function (err, cont) {
                    if (err) {
                        console.log(err);
                        res.json(err);
                        return;
                    }
                    console.log(cont);
                    res.json(cont);
                });
            }
            else {
                Multimedia.find({},function (error, result) {
                    if (error) {
                        //console.log(error);
                        res.json(error);
                        return;
                    }
                    console.log(result);
                    res.json(result);
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
