var express = require('express');
var app = express();

var accessToken = 'fc316ac1f7404dc28af26d5baed1416c';

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cause_server_side_exception', function(req, res) {

});

app.use(rollbar.errorHandler(accessToken));

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


