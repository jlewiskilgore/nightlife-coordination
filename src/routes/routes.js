var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectId;
var https = require('https');
var request = require('request');
var config = require('../../config.js');

module.exports = function(app, env, passport) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		res.render('pages/index');
	});

	app.post('/getToken', function(req, res) {
		var authUrl = 'https://api.yelp.com/oauth2/token';

		var authParams = {
			grant_type: 'client_credentials',
			client_id: config.appConfig.YELP_API_CLIENT_ID,
			client_secret: config.appConfig.YELP_API_CLIENT_SECRET
		};

		request.post(authUrl, {form: authParams, json: true}, function(err, res) {
			console.log(res.body.access_token);
			console.log(res.body.expires_in);
		});
	});

	app.get('/auth/twitter',
		passport.authenticate('twitter'));

	app.get('/auth/twitter/callback',
		passport.authenticate('twitter', { failureRedirect: '/' }),
		function(req, res) {
			res.redirect('/');
		});

	app.post('/search', function(req, res) {
		console.log('yelp search...');
		var apiBaseSearchUrl = 'https://api.yelp.com/v3/businesses/search?';
		var searchTerm = "bar"; // This app only looks for "nightlife" spots using bar as a search
		var searchLocation = req.body.searchLocation;

		if(searchLocation) {
			var fullSearchApiUrl = apiBaseSearchUrl + "term=" + searchTerm + '&location=' + searchLocation;

			var authParams = {
				bearer: config.appConfig.YELP_AUTH_TOKEN
			}

			request.get(fullSearchApiUrl, {auth: authParams}, function(err, result) {
				if(err) {
					console.log(err);
				}
				else {
					console.log(result);
					res.render('pages/index', 
						{
							searchResults: result
						});
				}
			});
		}
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};