var request = require('request');
var config = require('../../config.js');

function yelpSearch() {
	this.getBusinessList = function(searchLocation, callback) {
		var apiBaseSearchUrl = 'https://api.yelp.com/v3/businesses/search?';
		var searchTerm = "bar"; // This app only looks for "nightlife" spots using bar as a search
		var fullSearchApiUrl = apiBaseSearchUrl + "term=" + searchTerm + '&location=' + searchLocation;

		var authParams = {
			bearer: config.appConfig.YELP_AUTH_TOKEN
		}

		request.get(fullSearchApiUrl, {auth: authParams, json: true}, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				var businessArr = result.body.businesses;
				//console.log(businessArr);
				callback(businessArr);
			}
		});
	};
}

module.exports = new yelpSearch();