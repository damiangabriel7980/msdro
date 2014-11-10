var Content     = require('./models/content');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var bodyParser	= require('body-parser');
var Events = require('./models/events');
var usergrid = require('usergrid');

module.exports = function(app, router) {

    var getClient = function(req){
        return new usergrid.client({
            orgName:'qualitance.leaderamp',
            appName:'msd',
            authType:usergrid.AUTH_APP_USER,
            token:req.cookies.userToken
        });
    };

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
    getClient(req).request({method: 'GET' , endpoint: 'products'}, function (error, result) {
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
            getClient(req).getEntity({method: 'GET' , type: 'products', uuid: y }, function(err, cont) {
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
            if(req.params.id!='0'&&req.params.id!='339df1ba-6104-11e4-9b03-83702f045177')
            {
            getClient(req).request({method: 'GET' , endpoint: 'products', qs:{ql:"area_parent= '" + x + "'"}}, function(err, cont) {
                if(err) {
                    res.send(err);
                }
                 console.log(cont);
                res.send(cont.entities);
            })}
            else
            {
                getClient(req).request({method: 'GET' , endpoint: 'products'}, function (error, result) {
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
            getClient(req).request({method: 'GET' , endpoint: 'therapeuticareas',qs:{limit:50}}, function (error, result) {
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
            getClient(req).request({method: 'GET' , endpoint: 'evenimentes',qs:{limit:50}}, function (error, result) {
                if (error) {
                    res.send(error);
                } else {
                    console.log(result);
                    res.send(result.entities);
                }
            });

        });
    router.route('/calendar/:id')
        .get(function(req,res){
            getClient(req).getEntity({method: 'GET' , type: 'evenimentes', uuid: req.params.id},function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont._data);
            });

        });
    router.route('/multimedia2/:idd')
        .get(function(req,res){
            getClient(req).getEntity({method: 'GET' , type: 'multimedia', uuid: req.params.idd},function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont._data);
            });

        });
    router.route('/multimedia')
        .get(function(req,res){
            getClient(req).getEntity({method: 'GET' , type: 'multimedia'},function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.send(cont.entities);
            });

        });
    router.route('/multimedia/multimediaByArea/:id')
        .get(function(req,res){
            var x = req.params.id;
            if(req.params.id!='0')
            {
                getClient(req).request({method: 'GET' , endpoint: 'multimedia',qs:{ql:"parent_id= " + x},limit:50}, function(err, cont) {
                    if(err) {
                        res.send(err);
                    }
                    console.log(cont);
                    res.send(cont.entities);
                })}
            else
            {
                getClient(req).request({method: 'GET' , endpoint: 'multimedia', qs:{limit:50}}, function (error, result) {
                    if (error) {
                        res.send(error);
                    } else {
                        res.send(result.entities);
                    }
                });
            }
        });
    router.route('/teste')
        .get(function(req,res){
            getClient(req).request({method: 'GET' , endpoint: 'quizzes',qs:{limit:50}}, function (error, result) {
                if (error) {
                    res.send(error);
                    return ;
                } else {
                    console.log(result);
                    res.send(result.entities);
                }
            });
        });
    router.route('/teste/:id')
        .get(function(req,res) {
            getClient(req).request({method: 'GET', endpoint: 'questions',
                qs: {ql: "quiz_id =" + req.params.id, limit: 1000}
            }, function (err, cont) {
                if (err) {
                    res.send(err);
                    return;
                }
                console.log(cont);
                res.send(cont.entities);
            });
        });
    app.use('/api', router);
};
