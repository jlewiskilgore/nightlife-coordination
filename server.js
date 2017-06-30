var express = require('express');
var session = require('express-session');
var routes = require('./src/routes/routes.js');
var config = require('./config.js');
var passport = require('passport');

var app = express();

var mongoose = require('mongoose');
var dbURL = process.env.MONGOLAB_URI;

mongoose.connect(dbURL || 'mongodb://localhost/nightlifedb', {
		useMongoClient: true
	});

var db = mongoose.connection;

db.on('error', function(err) {
	console.log(err);
})

db.once('open', function() {
	console.log('Connected to database.');

	app.use(function(req, res, next) {
		req.db = db;
		next();
	});

	app.use(express.static('public'));

	app.set('view engine', 'ejs');

	app.use(session({
		secret: config.appConfig.SESSION_SECRET,
		resave: false,
		saveUninitialized: false
	}));

	app.use(passport.initialize());
	app.use(passport.session());

	routes(app, process.env, passport);

	app.set('port', (process.env.PORT || 8080));

	app.listen(process.env.PORT || 8080, function() {
		console.log('Server Listening on Port 8080');
	});
});