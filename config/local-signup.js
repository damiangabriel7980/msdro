var LocalStrategy    = require('passport-local').Strategy;
var XRegExp  = require('xregexp').XRegExp;
var validator = require('validator');
var crypto   = require('crypto');

// load up models
var User       = require('../app/models/user');
var Roles = require('../app/models/roles');

module.exports = function(passport) {
    var namePatt = new XRegExp('^[a-zA-Z\\s]{3,100}$');
    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {

            function lookup(obj, field) {
                if (!obj) { return null; }
                var chain = field.split(']').join('').split('[');
                for (var i = 0, len = chain.length; i < len; i++) {
                    var prop = obj[chain[i]];
                    if (typeof(prop) === 'undefined') { return null; }
                    if (typeof(prop) !== 'object') { return prop; }
                    obj = prop;
                }
                return null;
            }

            var name = lookup(req.body, 'name') || lookup(req.query, 'name') || "";
            var confirm = lookup(req.body, 'confirm') || lookup(req.query, 'confirm');
            var terms = lookup(req.body, 'terms') || lookup(req.query, 'terms');
            var signupFromConf = lookup(req.body, 'signupFromConf') || lookup(req.query, 'signupFromConf');

            var info = {
                email: email,
                name: name,
                message: null
            };

            // asynchronous
            process.nextTick(function() {
                // if the user is not already logged in:
                if (!req.user) {
                    //validate email, name, password, password match
                    if(!validator.isEmail(email)){
                        info.message = "Adresa de e-mail nu este valida";
                        return done(null, false, info);
                    }
                    console.log("name test");
                    if(!namePatt.test(name.replace(/ /g,''))){
                        info.message = "Numele trebuie sa contina doar litere, minim 3";
                        return done(null, false, info);
                    }
                    if(password.length < 6 || password.length > 32){
                        info.message = "Parola trebuie sa contina intre 6 si 32 de caractere";
                        return done(null, false, info);
                    }
                    if(password !== confirm){
                        info.message = "Parolele nu corespund";
                        return done(null, false, info);
                    }
                    if(!terms){
                        info.message = "Trebuie sa acceptati termenii si conditiile inainte de a continua";
                        return done(null, false, info);
                    }


                    User.findOne({ 'username' :  email }, function(err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if there's already a user with that email
                        if (user) {
                            info.message = "Acest e-mail este deja folosit";
                            return done(null, false, info);
                        } else {
                            // create the user
                            var newUser            = new User();

                            //get default role
                            Roles.findOne({'authority': 'ROLE_FARMACIST'}, function (err, role) {
                                if(err) return done(err);
                                newUser.rolesID = [role._id.toString()];
                                newUser.username = email;
                                newUser.name     = name;
                                newUser.password = newUser.generateHash(password);
                                newUser.password_expired = false;
                                newUser.account_expired = false;
                                newUser.account_locked = false;
                                newUser.enabled = false; //enable only after email activation
                                newUser.last_updated = Date.now();
                                newUser.state = "PENDING";
                                newUser.birthday=null;
                                newUser.phone="";
                                newUser.image_path="";
                                //set activation token
                                crypto.randomBytes(40, function(err, buf) {
                                    if(err) return done(err);

                                    newUser.activationToken = buf.toString('hex');

                                    //save user
                                    newUser.save(function(err) {
                                        if (err)
                                            return done(err);

                                        return done(null, newUser);
                                    });
                                });
                            });
                        }
                    });
                } else {
                    // user is logged in .Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }
            });
        }));
};