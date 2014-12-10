/**
 * Created by miricaandrei23 on 10.12.2014.
 */
var mongoose = require('mongoose');

module.exports = function(app, router) {


    router.route('/test')
        .get(function(req,res){
            res.send(200, 'Congratulations! You are authorized!');
        });



    app.use('/apiConferences', router);
};