var path = require('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var ObjectId = require('mongodb').ObjectId;
var Yelp = require

module.exports = function(app, env, passport) {
	app.use(bodyParser.urlencoded({ extended: true }));

	app.use(bodyParser.json());

	app.get('/', function(req, res) {
		res.render('pages/index');
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
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};