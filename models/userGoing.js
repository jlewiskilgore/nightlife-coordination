var mongoose = require('mongoose'); 

var userGoingSchema = new mongoose.Schema({
	userId: String,
	locationId: String,
	dateGoing: Date
});

var UserGoing = mongoose.model('UserGoing', userGoingSchema);

module.exports = UserGoing;