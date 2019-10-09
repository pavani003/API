var express = require('Express');
var app = express();

var api = require('./api.js');


app.use('/api', api);



app.listen(3000);