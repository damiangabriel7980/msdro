var Content     = require('./models/content');
var Products    = require('./models/products');
var Therapeutic_Area = require('./models/therapeutic_areas');
var bodyParser	= require('body-parser');

module.exports = function(app, router) {

    router.route('/content')

        .post(function(req, res) {

            var content = new Content();

            content.title    = req.body.title;
            content.author   = req.body.author;

            content.save(function(err){
                if(err) {
                    res.send(err);
                }

                res.json(content);
            });

        })

        .get(function(req, res) {
            Content.find(function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            });
        })



    router.route('/content/:content_id')

        .get(function(req, res) {
            Content.findById(req.params.content_id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
        })

        .put(function(req, res) {
            Content.findById(req.params.content_id, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                cont.title = req.body.title;

                cont.save(function(err){
                    if(err) {
                        res.send(err);
                    }

                    res.json({ message: "Content updated!"});
                })
            });

        })

        .delete(function(req, res) {
            Content.remove({
                _id: req.params.content_id
            }, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json({ message: 'Succesfully deleted'});
            })
        });

    router.route('/products')

        .post(function(req, res) {

            var product = new Products();

            product.version_prod = req.body.version_prod;
            product.description = req.body.description;
            product.enableP = req.body.enableP;
            product.file_path = req.body.file_path;
            product.image_path = req.body.image_path;
            product.last_updated = new Date();
            product.nameP = req.body.nameP;

            product.save(function(err){
                if(err) {
                    res.send(err);
                }

                res.json(product);
            });

        })

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
        })

        .put(function(req, res) {
            Products.findById(req.params.products_id, function(err, cont) {
                if(err) {
                    res.send(err);
                }


                cont.version_prod = req.body.version_prod;
                cont.description = req.body.description;
                cont.enableP = req.body.enableP;
                cont.file_path = req.body.file_path;
                cont.image_path = req.body.image_path;
                cont.last_updated = new Date();
                cont.nameP = req.body.nameP;

                cont.save(function(err){
                    if(err) {
                        res.send(err);
                    }

                    res.json({ message: "Product updated!"});
                })
            });

        })

        .delete(function(req, res) {
            Products.remove({
                _id: req.params.products_id
            }, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json({ message: 'Succesfully deleted'});
            })
        });

    router.route('/therapeutic_areas')

        .post(function(req, res) {

            var therapeutic_area = new Therapeutic_Area();

            therapeutic_area.version_ther = req.body.version_ther;
            therapeutic_area.has_children = req.body.has_children;
            therapeutic_area.last_updated = new Date();
            therapeutic_area.enable = req.body.enable;
            therapeutic_area.parent_id = req.body.parent_id;

            therapeutic_area.name = req.body.name;

            therapeutic_area.save(function(err){
                if(err) {
                    res.send(err);
                }

                res.json(therapeutic_area);
            });

        })

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
        })

        .put(function(req, res) {
            Therapeutic_Area.findById(req.params._id, function(err, cont) {
                if(err) {
                    res.send(err);
                }


                cont.version_ther = req.body.version_ther;
                cont.has_children = req.body.has_children;
                cont.last_updated = new Date();
                cont.enable = req.body.enable;
                cont.parent_id = req.body.parent_id;
                cont.name = req.body.name;

                cont.save(function(err){
                    if(err) {
                        res.send(err);
                    }

                    res.json({ message: "Area updated!"});
                })
            });

        })

        .delete(function(req, res) {
            Therapeutic_Area.remove({
                _id: req.params.therapeutic_areas_id
            }, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json({ message: 'Succesfully deleted'});
            })
        });

    app.use('/api', router);
};