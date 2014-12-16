var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
var User       = require('../app/models/user');

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
                logger.info("local auth - email: ", email);
                User.findOne({username:{$regex: new RegExp("^"+email,"i")}, enabled:{$ne: false}}, function(err, user) {
                    // if there are any errors, return the error
                    if (err)
                        return done(err);

                    // if no user is found, return the message
                    if (!user)
                        return done(null, false, req.flash('loginMessage', 'Nu s-a gasit utilizatorul, sau utilizatorul nu este activat'));

                    if (!user.validPassword(password))
                        return done(null, false, req.flash('loginMessage', 'Parola este gresita'));

                    // all is well, return user
                    else
                        return done(null, user);
                });
            });

        }));

}