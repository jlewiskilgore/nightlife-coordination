var mongoose = require('mongoose'); 

var userSchema = new mongoose.Schema({
	username: String,
	userId: String,
	lastLocationSearched: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;