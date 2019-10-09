
var Promise = require('bluebird');
const yelp = require('yelp-fusion');
const config = require('./config')
var promises;
var express = require('express');
var router = express.Router();
const apiKey = config.YELP_API_KEY;
const client = yelp.client(apiKey);
router.get('/', function (req, res) {
    try {
        const searchresults = getSearchResults();
        promises = searchresults.then(businesses => {
            return businesses.map(eachshop => {
                const reviewRes = getReviews(eachshop.id);
                const businessDetails = getBusinessDetails(eachshop.id);
                return Promise.all([reviewRes, businessDetails]).then(function (values) {
                    const reviews = values[0];
                    eachshop.review = reviews.map((eachreview) => {
                        return ({
                            "text": eachreview.text,
                            "name": eachreview.user.name
                        })
                    });
                    eachshop.business_details = values[1];
                    return eachshop;
                }, function (err) {
                    res.json({ "promise rejected in review and details": err })
                });
            })

        }, function (err) {
            res.json({ "promise rejected in bussiness search": err })
        })
    }
    catch (ex) {
        res.json({ "exception": ex })

    }

    Promise.all(promises).then(function (values) {
        res.json(values.map((each) => {
            return ({
                "Bussiness Name": each.name,
                "Reviews": each.review,
                "Address": each.location.address1,
                "City": each.location.city,
                "details": each.business_details
            })
        }));
    }, function (err) {
        res.json({ "promise all rejected": err })
    }).catch((err) => {
        res.json({ "promise all rejected": err });
    })
})

function getSearchResults() {
    const searchRequest = {
        term: 'icecream',
        location: 'Alpharetta',
        limit: 5,
        //offset:51,
        sort_by: 'rating'
    };
    const searchresults = client.search(searchRequest)
        .then((searchresults) => {
            return searchresults.jsonBody.businesses;
        }).catch((error) => {
            console.log(error);
        });
    return searchresults;
}

function getReviews(id) {
    const reviews = client.reviews(id).then(rev => {
        return rev.jsonBody.reviews
    }, function (err) {
        res.json({ "promise rejected in reviews": err })
    }).catch((error) => {
        console.log(error);
    });
    return reviews;
}
function getBusinessDetails(id) {
    const details = client.business(id).then(details => {
        return details.jsonBody;
    }, function (err) {
        res.json({ "promise rejected in details": err })
    }).catch((error) => {
        console.log("bussiness promise" + error);
    });
    return details;
}

module.exports = router;