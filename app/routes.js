var usergrid = require('usergrid');
var crypto = require("crypto-js");

module.exports = function(app, client) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function (req, res) {
        if(hasToken(req)){
            res.render('main.ejs');
        }else{
            res.redirect('/login');
        }
    });

    // PROFILE SECTION =========================
    app.get('/profile', function (req, res) {
        if(hasToken(req)){
            res.render('profile.ejs');
        }else{
            res.redirect('/login');
        }
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        if(hasToken(req)){
            var appUserClient = new usergrid.client({
                orgName:'qualitance.leaderamp',
                appName:'msd',
                authType:usergrid.AUTH_APP_USER,
                token:req.cookies.userToken
            });
            appUserClient.logout();
            res.clearCookie('userToken');
        }
        res.redirect('/login');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    var loginUser = function (req, res, username, pass) {
        client.login(username,pass, function (err) {
            if(err){
                res.render('auth.ejs', {message: "Incorrect login credentials"});
            }else{
                //Login ok. Get token
                var token = client.token;
                // set a cookie
                var cookie = req.cookies.userToken;
                if (cookie === undefined)
                {
                    // no: set a new cookie
                    res.cookie('userToken',token, { maxAge: 180000000, httpOnly: false });
                }
                else
                {
                    // yes, cookie was already present
                }
                res.redirect('/');
            }
        });
    };

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        if(hasToken(req)){
            res.render('main.ejs');
        }else{
            res.render('auth.ejs', { message: "" });
        }

    });

    // process the login form
    app.post('/login', function (req,res) {
        var entered_pass = req.body.password;
        var entered_user = req.body.email;
        client.request({method: 'GET', endpoint: '/users/'+req.body.email}, function (err,data) {
            if(err){
                res.render('auth.ejs', {message: "Incorrect login credentials"});
            }else{
                if(data.entities.length != 1){
                    res.render('auth.ejs', {message: "Incorrect login credentials"});
                }else{
                    var ent = data.entities[0];
                    if(ent['state']!=="ACCEPTED") {
                        res.render('auth.ejs', {message: "Incorrect login credentials"});
                    }else{
                        var old_pass = ent['old-pass'];
                        if(old_pass!==undefined && old_pass!==null){
                            //user logged in the first time; check password against old one

                            var entered_pass_enc = crypto.SHA256(entered_pass).toString();
                            if(entered_pass_enc === old_pass){
                                //password is correct; create new pass and delete old one
                                client.request({method:'PUT', endpoint:'users/'+entered_user+'/password', body: {"newpassword":entered_pass, "oldpassword":null}}, function (err,data) {
                                    if(err){
                                        res.render('auth.ejs', {message: "Error at login"});
                                    }else{
                                        client.request({method: 'PUT', endpoint: '/users/'+entered_user, body:{"old-pass":null}}, function (err,data) {
                                            loginUser(req,res,entered_user,entered_pass);
                                        });
                                    }
                                });
                            }else{
                                res.render('auth.ejs', {message: "Incorrect login credentials"});
                            }
                        }else{
                            //user already has a new password; proceed with login
                            loginUser(req,res,entered_user,entered_pass);
                        }
                    }

                }
            }
        });


    });

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
//    app.post('/signup', passport.authenticate('local-signup', {
//        successRedirect: '/', // redirect to the secure profile section
//        failureRedirect: '/signup', // redirect back to the signup page if there is an error
//        failureFlash: true // allow flash messages
//    }));

// ensure user is logged in
    var hasToken = function(req){
        var cookie = req.cookies.userToken;
        if (cookie === undefined)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
};

