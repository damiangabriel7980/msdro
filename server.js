// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var path = require('path');
var app      = express();
var port     = process.env.PORT || 8080;
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var usergrid = require('usergrid');

// configuration ===============================================================
var client = new usergrid.client({
    orgName:'qualitance.leaderamp',
    appName:'msd',
    authType:usergrid.AUTH_CLIENT_ID,
    clientId:'b3U6OZ4E6jyyEeS4q9tVRb7NeA',
    clientSecret:'b3U6KNFzp2OcurK-m7aLG4F_71TkmHs',
    logging: false, //optional - turn on logging, off by default
    buildCurl: false //optional - turn on curl commands, off by default
});

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

// routes ======================================================================
require('./app/routes.js')(app, client); // load our routes and pass in our app and client

// api ======================================================================
require('./app/api.js')(app, express.Router(),client); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
