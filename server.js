// server.js

var sessionSecret = "yours3cr3tisveryveryvvverysafew1thmee";
var tokenSecret = "d0nt3ventry2takeMyTooKEn0rillWhoopYoAss";
var mandrillKey=process.env.mandrillKey;
// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var socketPort = process.env.SOCKET_PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan   = require('morgan');
var fs       = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
var email = require('mandrill-send')(mandrillKey);
var socketServer = require('http').createServer(app); //http server used for socket comm

//logging ======================================================================
//configure winston logger
var logger = require('./config/winston');
//override express logger
app.use(morgan({ "stream": logger.stream }));

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport, logger); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // set up ejs for templating
// required for passport
app.use(session({ secret: sessionSecret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//token auth ===================================================================
require('./config/tokenAuth')(app,  logger, tokenSecret);

app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, email, logger, passport); // load our routes and pass in our app and fully configured passport

// api ======================================================================
require('./app/api.js')(app, sessionSecret, email, logger, express.Router()); // load our private routes and pass in our app and session secret
require('./app/apiPublic.js')(app, email, express.Router()); // load our public routes and pass in our app
require('./app/apiConferences.js')(app, email, logger, tokenSecret, express.Router());

// socket comm =================================================================
require('./app/socketComm.js')(socketServer, logger);

// launch ======================================================================
app.listen(port);
socketServer.listen(socketPort);
console.log('App runs on port: ' + port);
console.log('Socket comm port: ' + socketPort);
