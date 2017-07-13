var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectId;
var passport = require('../../auth/passport.js');
var https = require('https');
var request = require('request');
var config = require('../../config.js');
var yelpSearch = require('../controllers/yelpSearch.js');
var UserGoing = require('../../models/userGoing');

module.exports = function(app, env, passport) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		var businessList;

		if(req.user) {
			var userLocation = req.user.lastLocationSearched;

			if(userLocation) {
				yelpSearch.getBusinessList(userLocation, function(businessArr) {
					res.render('pages/index', {
						user: req.user,
						searchResults: businessArr,
						location: userLocation
					});
				});
			}
		}
		else {
			businessList = [];
			res.render('pages/index', 
				{
					user: req.user,
					searchResults: businessList,
					location: ''
				});
		}
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

	app.get('/auth/google',
		passport.authenticate('google', { scope : ['profile', 'email'] }));

	app.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/'}),
		function(req, res) {
			res.redirect('/');
		});

	app.post('/search', function(req, res) {
		var db = req.db;
		var users = db.collection('users');

		var searchLocation = req.body.searchLocation;

		if(req.user) {
			users.findOne({ "userId": req.user.userId }, function(err, result) {
				if(err) {
					console.log(err);
				}
				else {
					users.update(
						{ "userId": result.userId },
						{ $set: { "lastLocationSearched": searchLocation } },
						{ upsert: true }
					);
				}
			});
		}

		if(searchLocation) {
			yelpSearch.getBusinessList(searchLocation, function(businessArr) {
				res.render('pages/index', {
					user: req.user,
					searchResults: businessArr,
					location: searchLocation
				});
			});
		}
	});

	app.post('/toggleUserGoing', function(req, res) {
		var db = req.db;
		var userAttending = db.collection('userAttending');
		
		//console.log("toggleUserGoing");
		//console.log(req.body.locationId);

		var dateGoing = new Date();
		dateGoing = dateGoing.toDateString();

		if(req.user) {
			var newUserGoing = new UserGoing({
				userId: req.user.userId,
				locationId: req.body.locationId,
				dateGoing: dateGoing
			});

			newUserGoing.save(function(err, data) {
				if(err) {
					console.log(err);
				}
				else {
					console.log("New UserGoing Saved!");
					res.redirect('/');
				}
			});
		}
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};