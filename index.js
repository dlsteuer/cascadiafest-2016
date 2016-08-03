var express = require('express');
var app = express();

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var configDB = require('./config/database.js');


var accessToken = 'fc316ac1f7404dc28af26d5baed1416c';

var rollbar = require("rollbar");
var options = {
  environment: 'cascadiafest-2016'
};
rollbar.init(accessToken, options);

rollbar.handleUncaughtExceptionsAndRejections(accessToken, options);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// required for passport
app.use(session({secret: 'ilovescotchscotchyscotchscotch'})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport);

app.use(rollbar.errorHandler(accessToken, options));

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});


