var Content     = require('./models/content');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var UserGroup = require('./models/userGroup');
var bodyParser	= require('body-parser');

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
            Content.findById(req.params.content_id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
        });

    router.route('/content/type/:content_type')

        .get(function(req, res) {
            console.log(req.user.groupsID);
            Content.find({type: req.params.content_type, groupsID: req.user.groupsID}, {}, function (err, cont) {
                if(err) {
                    res.send(err);
                }
                console.log(cont);
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

    router.route('/products/:products_id')

        .get(function(req, res) {
            Products.findById(req.params.products_id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
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

    router.route('/therapeutic_areas/:therapeutic_areas_id')

        .get(function(req, res) {
            Therapeutic_Area.findById(req.params._id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
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

    app.use('/api', router);
};
