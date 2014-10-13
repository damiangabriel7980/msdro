var Content     = require('./models/content');
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
        });

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

    app.use('/api', router);
}