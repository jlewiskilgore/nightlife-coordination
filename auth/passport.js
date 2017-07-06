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
			console.log(profile);
    		return done(null, profile);
    	});
	}
));



init();

module.exports = passport;