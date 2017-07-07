var passport = require('passport');
var User = require('../models/user');
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');

module.exports = function() {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
};