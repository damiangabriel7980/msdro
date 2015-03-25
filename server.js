// server.js
var Config = require('./config/environment.js'),
    my_config = new Config();
console.log(my_config);

var sessionSecret = "yours3cr3tisveryveryvvverysafew1thmee";
var tokenSecret = "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss";
var mandrillKey = my_config.mandrillKey;
var pushServerAddr = my_config.pushServerAddress;

//=========================================================== https certificates
var fs = require('fs');
var certificateOptions = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.crt'),
    requestCert: false,
    rejectUnauthorized: false
};

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path = require('path');
var app      = express();
var http = require('http');
var https = require('https');
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var email = require('mandrill-send')(mandrillKey);
var mandrill = require('node-mandrill')(mandrillKey);
var rooms = {},
    userIds = {};
    //logging ======================================================================
//configure winston logger
var logger = require('./config/winston');
//override express logger
app.use(morgan({ "stream": logger.stream }));

// configuration ===============================================================
mongoose.connect(my_config.database); // connect to our database

require('./config/passport')(passport, logger); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json({limit: '50mb'})); // get information from html forms
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }));
app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({ secret: sessionSecret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//token auth ===================================================================
require('./config/tokenAuth')(app,  logger, tokenSecret, pushServerAddr);

app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, email, logger, passport); // load our routes and pass in our app and fully configured passport

//create https server ==========================================================
var secureServer = https.createServer(certificateOptions, app);
var devServer = http.createServer(app);

// api ======================================================================
require('./app/api.js')(app, sessionSecret, email, logger, pushServerAddr, express.Router()); // load our private routes and pass in our app and session secret
require('./app/apiPublic.js')(app, email, express.Router()); // load our public routes and pass in our app
require('./app/apiGloballyShared.js')(app, email, logger, express.Router());
require('./app/apiMobileShared.js')(app, email, logger, tokenSecret, pushServerAddr, express.Router());
require('./app/apiConferences.js')(app, email, logger, tokenSecret, pushServerAddr, express.Router());
require('./app/apiMSDDoc.js')(app, logger, tokenSecret, secureServer, express.Router());
require('./app/apiDPOC.js')(app, mandrill, logger, express.Router());
require('./app/apiCourses.js')(app, logger, tokenSecret, express.Router());
require('./app/apiContractManagement.js')(app, logger, express.Router());
// socket comm test =================================================================
// require('./app/socketComm.js')(secureServer, tokenSecret, logger);

// launch ======================================================================

var devPort = my_config.devPORT || 8080;
var ssPort   = my_config.ssPORT || 3000;

secureServer.listen(ssPort);
devServer.listen(devPort);
console.log("Https server started on port " + ssPort);
console.log("Dev server started on port " + devPort);
