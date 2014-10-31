module.exports = function(app, client) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', isLoggedIn, function (req, res) {
        res.render('main2.ejs', {
            user: getUser()
        });
    }, function (req,res) {
        res.redirect('/login');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        client.logout();
        res.redirect('/');
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
                console.log("Login error");
                res.render('auth.ejs', {message: "Incorrect login credentials"})
            }else{
                console.log("Login ok");
                var token = client.token;
                res.render('main2.ejs', {username:req.body.email, token: token});
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
    function isLoggedIn() {
        client.getLoggedInUser(function (err, data, user) {
            if (err) {
                console.log("Not logged in");
                //error - could not get logged in user
                return false;
            } else {
                console.log("User is logged in");
                //success - got logged in user
                return true;
            }
        });
    }
    function getUser(){
        client.getLoggedInUser(function(err, data, user) {
            if(err) {
                console.log("Cannot get logged in user");
                return null;
            } else {
                console.log(user);
                return user;
            }
        });
    }
};