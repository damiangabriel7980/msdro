var Content     = require('./models/articles');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var bodyParser	= require('body-parser');
var Events = require('./models/events');
var Counties = require('./models/counties');
var Cities = require('./models/cities');
var Multimedia = require('./models/multimedia');
var User = require('./models/user');

var XRegExp = require('xregexp').XRegExp;

var s3 = require('s3');
var s3Client = s3.createClient({
    s3Options:{
        accessKeyId: "AKIAJYA22DHN4HZ6MXHQ",
        secretAccessKey: "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"
    }
});

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
            var userCopy = {};
            userCopy['name'] = user.name;
            userCopy['image_path'] = user.image_path;
            userCopy['phone'] = user.phone;
            userCopy['points'] = user.points;
            userCopy['subscription'] = user.subscription;
            userCopy['username'] = user.username;
            userCopy['therapeutic-areasID'] = user['therapeutic-areasID'];
            userCopy['citiesID'] = user.citiesID;
            Cities.find({_id:user.citiesID[0]}, function (err, city) {
                if(err){
                    res.send(err);
                }
                if(city[0]){
                    userCopy['city_id'] = city[0]._id;
                    userCopy['city_name'] = city[0].name;
                    Counties.find({citiesID: {$in: [userCopy['city_id'].toString()]}}, function (err, county) {
                        if(err){
                            res.send(err);
                        }
                        if(county[0]){
                            userCopy['county_id'] = county[0]._id;
                            userCopy['county_name'] = county[0].name;
                            res.json(userCopy);
                        }else{
                            res.send(err);
                        }
                    });
                }else{
                    res.send(err);
                }

            });
        });

    router.route('/counties')

        .get(function(req, res) {
            Counties.find({$query:{}, $orderby: {name: 1}}, {name: 1}, function (err, cont) {
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
                        res.send(err);
                    }
                    res.json(cities);
                });
            });
        });

    router.route('/userProfile')

        .post(function (req, res) {
            var ans = {};
            var newData = req.body.newData;
            console.log(newData);
            var namePatt = new XRegExp('^[a-zA-Z\\s]{3,30}$');
            var phonePatt = new XRegExp('^[0-9]{10,20}$');
            if((!namePatt.test(newData.firstName.toString())) || (!namePatt.test(newData.lastName.toString()))){
                ans.error = true;
                ans.message = "Invalid name";
                res.json(ans);
            }else{
                if(!phonePatt.test(newData.phone.toString())){
                    ans.error = true;
                    ans.message = "Invalid phone number";
                    res.json(ans);
                }else{
                    var upd = User.update({_id:req.user._id}, {
                        name: newData.firstName+" "+newData.lastName,
                        phone: newData.phone,
                        subscription: newData.newsletter?1:0,
                        "therapeutic-areasID": newData.therapeuticAreas,
                        citiesID: [newData.city]
                    }, function () {
                        if(!upd._castError){
                            ans.error = false;
                            ans.message = "Datele au fost modificate";
                        }else{
                            ans.error = true;
                            ans.message = "Eroare la actualizare. Verificati datele";
                        }
                        res.json(ans);
                    });
                }
            }
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
            Therapeutic_Area.find({$query:{}, $orderby: {name: 1}}, function(err, cont) {
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
