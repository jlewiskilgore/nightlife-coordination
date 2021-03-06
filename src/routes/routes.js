var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectId;
var passport = require('../../auth/passport.js');
var https = require('https');
var request = require('request');
var config = require('../../config.js');
var yelpSearch = require('../controllers/yelpSearch.js');
var userCount = require('../controllers/userCount.js');
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
					userCount.countLocationList(req, businessArr, function(locationUserCountArr) {
						var userId;
						
						if(req.user) {
							userId = req.user.userId;
						}
						
						userCount.currentUserGoingByLocation(req, businessArr, userId, function(isUserGoingArr) {
							res.render('pages/index', {
								user: req.user,
								searchResults: businessArr,
								location: userLocation,
								locationUserCount: locationUserCountArr,
								userGoing: isUserGoingArr
							});
						});
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
				userCount.countLocationList(req, businessArr, function(locationUserCountArr) {
					var userId;
					
					if(req.user) {
						userId = req.user.userId;
					}
					
					userCount.currentUserGoingByLocation(req, businessArr, userId, function(isUserGoingArr) {
						res.render('pages/index', {
							user: req.user,
							searchResults: businessArr,
							location: searchLocation,
							locationUserCount: locationUserCountArr,
							userGoing: isUserGoingArr
						});
					});
				});
			});
		}
	});

	app.post('/addUserGoing', function(req, res) {
		var db = req.db;
		var usergoings = db.collection('usergoings');

		var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
		var localDate = new Date(Date.now() - timezoneOffset);
		var localISODate = localDate.toISOString().slice(0,-1);

		// Query on current date at beginning of day (after bars close night before)
		var queryDate = localDate.setHours(5);
		queryDate = localDate.setMinutes(0);
		queryDate = localDate.setSeconds(0);
		queryDate = new Date(queryDate);

		var dateGoing = localISODate;

		if(req.user) {
			var searchQuery = {
				"userId": req.user.userId,
				"locationId": req.body.locationId,
				"dateGoing": { "$gte": queryDate }
			}

			usergoings.findOne( searchQuery, function(err, result) {
				if(!result) {
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
				else {
					console.log("This user is already going to this location tonight!");
				}
			});
		}
	});

	app.post('/deleteUserGoing', function(req, res) {
		var db = req.db;
		var usergoings = db.collection('usergoings');

		var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
		var localDate = new Date(Date.now() - timezoneOffset);
		var queryDate = localDate.setHours(5);
		queryDate = localDate.setMinutes(0);
		queryDate = localDate.setSeconds(0);
		queryDate = new Date(queryDate);

		usergoings.remove({ "userId": req.body.userId, "locationId": req.body.locationId, "dateGoing": { "$gte": queryDate } }, function(err) {
			if(err) {
				console.log(err);
			}
			else {
				console.log("UserGoing Deleted!");
				res.redirect('/');
			}
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};