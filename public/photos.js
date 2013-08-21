function Ctrl($scope) {

	$scope.photos = [];
	
	$scope.users = [];
	
	$scope.socket = io.connect(window.location.protocol + "//" + window.location.host);
		
	$scope.socket.on('photos', function(photos) {
		$scope.$apply(function(scope) {
			scope.photos = photos;
			angular.forEach(photos, function(photo){
				GetUsers(photo);
			})
		});
	});
	
	$scope.socket.on('new', function(photo) {
		console.log('calling scope new')
		$scope.$apply(function(scope){			
			scope.photos.push(photo);
			GetUsers(photo);
		});
	});
	
	$scope.userSearch = function(userselect) {
	  return function(photo) {
	  	if (!userselect) {
	  		return true;
	  	} else {
			return photo.user.username === userselect;
		}
	  };
	};
	
	var GetUsers = function(photo){
		if ($scope.users.indexOf(photo.user.username) == -1) {
			$scope.users.push(photo.user.username);
		};
		$scope.users.sort();
	}	
}