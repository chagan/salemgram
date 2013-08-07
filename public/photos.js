function Ctrl($scope) {

	$scope.photos = [];
	
	$scope.socket = io.connect(window.location.protocol + "//" + window.location.host);
		
	$scope.socket.on('photos', function(photos) {
		$scope.$apply(function(scope) {
			scope.photos = photos;
		});
	});
	
	$scope.socket.on('new', function(photo) {
		console.log('calling scope new')
		$scope.$apply(function(scope){			
			scope.photos.push(photo);
		});
	});

}