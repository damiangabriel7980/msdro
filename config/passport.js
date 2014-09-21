module.exports = function(passport) {

    require('./passport-init')(passport);
    require('./local-login')(passport);
    require('./local-signup')(passport);

//    require('./facebook-login')(passport);
//    require('./twitter-login')(passport);
//    require('./google-login')(passport);

};
