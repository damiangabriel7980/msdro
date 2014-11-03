var usergrid = require('usergrid');

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

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('auth.ejs', { message: "" });
    });

    // process the login form
    app.post('/login', function (req,res) {
        client.login(req.body.email,req.body.password, function (err) {
            if(err){
                res.render('auth.ejs', {message: "Incorrect login credentials"})
            }else{
                //Login ok. Get token
                var token = client.token;
                // set a cookie
                var cookie = req.cookies.userToken;
                if (cookie === undefined)
                {
                    // no: set a new cookie
                    res.cookie('userToken',token, { maxAge: 60000, httpOnly: true });
                }
                else
                {
                    // yes, cookie was already present
                }
                res.redirect('/');
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

