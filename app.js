var express = require('Express');
var app = express();

var api = require('./api.js');


app.use('/api', api);

var request = require("request");
var options =
 {
  method: 'GET',
  url: "https://api.yelp.com/v3/businesses/busZqvXX73idGQMLagMtpQ",
  headers:
         {
         authorization:"Bearer YwVGsgo08WguXOmUQao5BdxlDq0Tek3XLft6NsdTSPvCTSa_uu9WxBmSI3zboviwnVMXBftoJ0KnEfIfKcQGv5In61Uaj7LRQKqITbR3Unrs_AP_RbziVd4fuAWbXXYx"
         },
 // body: '{}'
 };
 request(options, function (error, response, body){
    if (error) {  
         res.status(400).json({MESSAGE:MESSAGE})
     }
     else
     console.log(response);
    });

//app.listen(3000);