var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var User       = require('../app/models/user');

var Utils = require('../app/modules/utils');

module.exports = function(passport, logger) {
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function() {
                logger.warn("local auth - email: ", email);
                User.findOne({username: Utils.regexes.emailQuery(email)}).select("+enabled +password +account_locked +account_expired +state +proof_path").exec(function(err, user) {

                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, {code: 16});

                    if (!user.validPassword(password))
                        return done(null, false, {code: 16});

                    if((!user.enabled || user.account_locked || user.account_expired || user.state === "REJECTED") && (!user.temporaryAccount))
                        return done(null, false, {code: 17});

                    if(user.state === "PENDING" && user.proof_path){
                        return done(null, false, {code: 18});
                    }

                    // all is well, return user
                    else
                        return done(null, user);
                });
            });

        }));

}