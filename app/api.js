var Child       = require('./models/persons');
var bodyParser	= require('body-parser');

module.exports = function(app, router) {

    router.route('/children')

        .post(function(req, res) {

            var child = new Child();

            child.type      = 'CHILD'
            child.name      = req.body.name;
            child.surname   = req.body.surname;
//            child.birthDate = req.body.birthDate;

            child.save(function(err){
                if(err) {
                    res.send(err);
                }

                res.json(child);
            });

        })

        .get(function(req, res) {
            Child.find(function(err, children) {
                if(err) {
                    res.send(err);
                }

                res.json(children);
            });
        });

    router.route('/children/:child_id')

        .get(function(req, res) {
            Child.findById(req.params.child_id, function(err, child) {
                if(err) {
                    res.send(err);
                }

                res.json(child);
            })
        })

        .put(function(req, res) {
            Child.findById(req.params.child_id, function(err, child) {
                if(err) {
                    res.send(err);
                }

                child.name = req.body.name;

                child.save(function(err){
                    if(err) {
                        res.send(err);
                    }

                    res.json({ message: "Child updated!"});
                })
            });

        })

        .delete(function(req, res) {
            Child.remove({
                _id: req.params.child_id
            }, function(err, child) {
                if(err) {
                    res.send(err);
                }

                res.json({ message: 'Succesfully deleted'});
            })
        });

    app.use('/api', router);
}