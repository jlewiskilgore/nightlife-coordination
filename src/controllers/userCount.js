function userCount(locationList) {
	this.getUserCount = function(req, location, resultIndex, callback) {
		var db = req.db;
		var usergoings = db.collection('usergoings');

		usergoings.count({ "locationId": location.id }, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				callback(result, resultIndex);
			}
		});
	};

	this.countLocationList = function(req, locationList, callback) {
		var usersAttendingArr = [];
		var resultLength = 0;

		for(var i=0; i < locationList.length; i++) {
			this.getUserCount(req, locationList[i], i, function(locationUserCount, userCountIndex) {
				usersAttendingArr[userCountIndex] = locationUserCount;
				resultLength++;

				if(resultLength == locationList.length) {
					callback(usersAttendingArr);
				}
			});
		}
	};
}

module.exports = new userCount();