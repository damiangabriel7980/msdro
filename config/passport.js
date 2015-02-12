module.exports = function(passport, logger) {

    require('./passport-init')(passport);
    require('./local-login')(passport, logger);
    require('./local-signup')(passport);

};
