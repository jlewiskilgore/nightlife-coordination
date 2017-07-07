var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var config = require('../config.js');
var User = require('../models/user');
var init = require('./init');

passport.use(new GoogleStrategy ({
	clientID: config.appConfig.GOOGLE_CLIENT_ID,
	clientSecret: config.appConfig.GOOGLE_CLIENT_SECRET,
	callbackURL: config.appConfig.GOOGLE_CALLBACK_URL,
	passReqToCallback: true
	},
	function(request, accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			console.log(profile.id);
			console.log(profile.displayName);

			/*
			User.findOne({ 'userId': profile.id }, function(err, user) {
				if(user) {
					return done(null, user);
				}
				else {
					var newUser = new User();

					newUser.userId = profile.id;
					newUser.username = profile.displayName;

					newUser.save(function(err) {
						if(err) {
							throw err;
						}
						return done(null, newUser);
					});
					
				}
			});
			*/

			var searchQuery = {
				userId: profile.id
			};

			var updates = {
				username: profile.displayName,
				userId: profile.id
			};

			var options = {
				upsert: true
			};

			User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
				if(err) {
					return done(err);
				}
				else {
					return done(null, user);
				}
			});
    		
    	});
	}
));

init();

module.exports = passport;