var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('../config.js');
var User = require('../models/user');
var init = require('./init');

passport.use(new GoogleStrategy ({
	clientID: config.appConfig.GOOGLE_CLIENT_ID,
	clientSecret: config.appConfig.GOOGLE_CLIENT_SECRET,
	callbackURL: config.appConfig.GOOGLE_CALLBACK_URL
	},
	function(token, refreshToken, profile, cb) {
		var searchQuery = {
			id: profile.id
		};

		User.findOneAndUpdate(searchQuery, function(err, user) {
			if(err) {
				return cb(err);
			}
			else {
				return cb(null, user);
			}
		});
	}
));



init();

module.exports = passport;