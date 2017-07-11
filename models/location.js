var mongoose = require('mongoose'); 

var locationSchema = new mongoose.Schema({
	locationName: String,
	locationId: String,
	locationUserCount: Number
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;