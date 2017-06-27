var express = require('express');
var session = require('express-session');
var routes = require('./src/routes/routes.js');
var passport = require('passport');
var config = require('./config.js');

var app = express();

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