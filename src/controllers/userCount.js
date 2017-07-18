function userCount(locationList) {
	this.getUserCount = function(req, location, resultIndex, callback) {
		var db = req.db;
		var usergoings = db.collection('usergoings');

		var queryDate = this.getQueryDate();

		var searchQuery = {
			"locationId": location.id,
			"dateGoing": { "$gte": queryDate }
		}

		usergoings.count(searchQuery, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				callback(result, resultIndex);
			}
		});
	};

	this.isCurrentUserGoing = function(req, location, resultIndex, userId, callback) {
		var db = req.db;
		var usergoings = db.collection('usergoings');

		var queryDate = this.getQueryDate();

		var searchQuery = {
			"locationId": location.id,
			"userId": userId,
			"dateGoing": { "$gte": queryDate }
		}

		usergoings.count(searchQuery, function(err, result) {
			if(err) {
				console.log(err);
			}
			else {
				callback(result, resultIndex);
			}
		})
	};


	// TODO: Return list of all location by user by queryDate
	this.currentUserGoingList = function(req, currentUser, callback) {
		var db = req.db;
		var usergoings = db.collection('usergoings');

		var queryDate = this.getQueryDate();

		var searchQuery = {
			"userId": userId,
			"dateGoing": { "$gte": queryDate }
		}
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

	this.currentUserGoingByLocation = function(req, locationList, currentUser, callback) {
		var currentUserAttendingArr = [];
		var resultLength = 0;

		for(var i=0; i < locationList.length; i++) {
			this.isCurrentUserGoing(req, locationList[i], i, currentUser, function(isUserGoing, locationIndex) {
				currentUserAttendingArr[locationIndex] = isUserGoing;
				resultLength++;

				if(resultLength == locationList.length) {
					callback(currentUserAttendingArr);
				}
			});
		}
	};

	this.getQueryDate = function () {
		var timezoneOffset = (new Date()).getTimezoneOffset() * 60000;
		var localDate = new Date(Date.now() - timezoneOffset);

		queryDate = localDate.setHours(5);
		queryDate = localDate.setMinutes(0);
		queryDate = localDate.setSeconds(0);
		queryDate = new Date(queryDate);

		return queryDate;
	};
}

module.exports = new userCount();