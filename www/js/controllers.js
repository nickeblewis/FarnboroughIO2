angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading) {
  function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(43.07493,-89.381388),
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
          e.preventDefault();
          return false;
        });

        $scope.map = map;
    
        $scope.centerOnMe();
      }
      google.maps.event.addDomListener(window, 'load', initialize);
  
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
})

.controller('FriendsCtrl', function($scope, Friends, $firebase) {
  $scope.friends = Friends.all();
  var placesURL= "https://farnborough.firebaseio.com"
      
  $scope.items = $firebase(new Firebase(placesURL + '/places'));
  // or we can retrieve data from the mock service if we need to - $scope.places = Items.all();

  // TODO - Should I do something more specific with this onload event?
  $scope.items.$on('loaded', function() {
    console.log($scope.items);
  });

  // TODO: The pull to refresh feature isn't working for the Phonegap build but what should happen is that the places list gets refreshed
  $scope.onRefresh = function() {
    $scope.items.$update();
  };
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
});
