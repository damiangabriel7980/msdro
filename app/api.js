var Content     = require('./models/content');
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

    router.route('/content/:content_type')

        .get(function(req, res) {
            console.log("Content type = "+req.content_type);
            Content.findByType(req.params.content_type, function(err, cont) {
                if(err) {
                    res.send(err);
                }

                res.json(cont);
            })
        });

    app.use('/api', router);
}