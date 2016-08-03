// app/routes.js
var rollbar = require("rollbar");

module.exports = function(app, passport) {

  app.get('/', function(request, response) {
    response.render('pages/index');
  });

  // show the login form
  app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('pages/login', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // show the signup form
  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('pages/signup', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('pages/profile', {
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  // routes that cause errors or report to rollbar
  app.get('/cause_server_side_exception', function(req, res) {
    var test = this_variable_has_not_been_set;
  });

  app.get('/cause_another_exception', function(req, res) {
    var x = {};
    x.test('foo');
  });

  app.get('/cause_critical', function(req, res) {
    rollbar.reportMessageWithPayloadData('Hull breach!', 'critical', {
      custom: {
        shield_level: Math.random() * 25 + " percent"
      }
    }, req);
    res.render('pages/index', { message: req.flash('errorCreated') });

  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}