const express=require('express');
var Promise = require('bluebird');

const app=express();

app.listen(3000);

const yelp = require('yelp-fusion');
var promises;
//const apiKey = process.env.YELP_API_KEY;
app.get('/api',function(req,res){
const searchRequest = {
  term: 'icecream',
  location: 'Alpharetta',
  limit:5,
  //offset:51,
  sort_by:'rating'
};

const client = yelp.client('YwVGsgo08WguXOmUQao5BdxlDq0Tek3XLft6NsdTSPvCTSa_uu9WxBmSI3zboviwnVMXBftoJ0KnEfIfKcQGv5In61Uaj7LRQKqITbR3Unrs_AP_RbziVd4fuAWbXXYx');

client.search(searchRequest)
  .then((response) => {
    var top=response.jsonBody;
    console.log(top.businesses.length);
    Promise.all(top.businesses.map(eachshop=>{
      return client.reviews(eachshop.id).then(response=>{
        var reviews=response.jsonBody.reviews
        eachshop.review=reviews.map((eachreview)=>
            {
            return ({"text":eachreview.text,
          "name":eachreview.user.name
         })
          });
        return eachshop;
      })

      return client.business(eachshop.id).then(response => {
        eachshop.businessdetails=response.jsonBody;
        return eachshop;
      }).catch(e => {
        console.log(e);
      });

    })).then(function(values){
      res.json(values.map((each)=>{
      return ({
        "Bussiness Name":each.name,
        "Reviews":each.review,
        "Address":each.location.address1,
        "City":each.city,
        "details":each.businessdetails
      })
    }));
  })
  .catch((error) => {
    console.log(error);
  });

});
});