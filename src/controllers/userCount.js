function userCount(locationList) {
	this.getUserCount = function(req, location, callback) {
		var db = req.db;
		var usergoings = db.collection('usergoings');

		usergoings.count({ "locationId": location.id }, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				callback(result);
			}
		});
	};

	this.countLocationList = function(req, locationList, callback) {
		var usersAttendingArr = [];

		for(var i=0; i < locationList.length; i++) {
			this.getUserCount(req, locationList[i], function(locationUserCount) {
				usersAttendingArr.push(locationUserCount);

				if(usersAttendingArr.length == locationList.length) {
					callback(usersAttendingArr);
				}
			});
		}
	}
}

module.exports = new userCount();