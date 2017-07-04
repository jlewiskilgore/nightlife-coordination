var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var config = require('../config.js');
var User = require('../models/user');
var init = require('./init');

passport.use(new TwitterStrategy ({
	consumerKey: config.appConfig.TWITTER_API_KEY,
	consumerSecret: config.appConfig.TWITTER_API_SECRET,
	callbackURL: config.appConfig.TWITTER_CALLBACK_URL
	},
	function(accessToken, refreshToken, profile, done) {
		var searchQuery = {
			username: profile.displayName
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
	}
));

init();

module.exports = passport;