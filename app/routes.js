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
        console.log(req.cookies);
        if(hasToken(req)){
            res.render('profile.ejs');
        }else{
            res.redirect('/login');
        }
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        if(hasToken(req)) res.clearCookie('userToken');
        res.redirect('/login');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        console.log("Cookies: ", req.cookies);
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
                // set a cookie
                var cookie = req.cookies.userToken;
                if (cookie === undefined)
                {
                    // no: set a new cookie
                    res.cookie('userToken',token, { maxAge: 60000, httpOnly: true });
                    console.log('cookie created successfully');
                }
                else
                {
                    // yes, cookie was already present
                    console.log('cookie exists: ', cookie);
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

