var express = require('express');
var app = express();

var accessToken = 'fc316ac1f7404dc28af26d5baed1416c';

var rollbar = require("rollbar");
rollbar.init(accessToken, {
  environment: 'cascadiafest-2016'
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cause_server_side_exception', function(req, res) {
  var test = this_variable_has_not_been_set;
});

app.get('/cause_another_exception', function(req, res) {
  var x = {};
  var other = x['test'];
});

app.get('/cause_critical', function(req, res) {
  rollbar.reportMessageWithPayloadData('Hull breach!', 'critical', {
    custom: {
      shield_level: Math.random() * 25 + " percent"
    }
  }, req);
});

app.use(rollbar.errorHandler(accessToken, {
  environment: 'cascadiafest-2016'
}));

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


