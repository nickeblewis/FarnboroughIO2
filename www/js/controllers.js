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
  //google.maps.event.addDomListener(window, 'load', initialize);
  initialize();
            
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

.controller('FriendsCtrl', function($scope, Friends, $firebase, $ionicLoading) {
  $scope.friends = Friends.all();
  var placesURL= "https://farnborough.firebaseio.com"
  
  $scope.items = {};
  
  //$scope.alreadyLoaded = null;    
  // or we can retrieve data from the mock service if we need to - $scope.places = Items.all();
  //if(!alreadyLoaded) {
  //  $scope.loading = $ionicLoading.show({
  //        content: 'Loading places...',
  //        showBackdrop: false
  //      });
  //}
  
  $scope.items = $firebase(new Firebase(placesURL + '/places'));
  // TODO - Should I do something more specific with this onload event?
  $scope.items.$on('loaded', function() {
     //$scope.loading.hide();
     // alreadyLoaded = true;
    //console.log($scope.items);
  });
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends, $firebase) {
  //$scope.friend = Friends.get($stateParams.friendId);
  $scope.place = {};

  var dataRef = new Firebase('https://farnborough.firebaseio.com/places/' + $stateParams.itemId);
    dataRef.on('value', function(snapshot) {
      console.log(snapshot.val());
      $scope.place.name = snapshot.val().name;
      $scope.place.description = snapshot.val().description;
      $scope.place.lat = snapshot.val().lat;
      $scope.place.lng = snapshot.val().lng;
  });

  angular.extend($scope, {
    center: {
      lat: $scope.place.lat,
      lng: $scope.place.lng,
      zoom: 16
    },
    markers: {
      main_marker: {
        lat: $scope.place.lat,
        lng: $scope.place.lng,
        focus: true,
        draggable: true,
        message: "Fred"
             
      }
    },
    defaults: {
      maxZoom: 18,
      minZoom: 1,
      zoom: 6,
      zoomControlPosition: 'topright',
      tileLayerOptions: {
        opacity: 0.9,
        detectRetina: true,
        reuseTiles: true,
      },
      scrollWheelZoom: false
    }
  });
})

.controller('FriendEditCtrl', function($scope, $stateParams, Friends, $firebase, $location) {
  var placeUrl = 'https://farnborough.firebaseio.com/places/' + $stateParams.itemId;
    $scope.place = $firebase(new Firebase(placeUrl));
 
    $scope.destroy = function() {
      $scope.place.$remove();
      $location.path('/');
    };

    $scope.save = function() {
      $scope.place.updated = (new Date()).getTime();
      $scope.place.$save();
      $location.path('/');
    };

})

.controller('AddCtrl', function($scope, $firebase) {

  var URL= "https://farnborough.firebaseio.com"
  // var ref = new Firebase("https://farnborough.firebaseio.com/places");

  $scope.items = $firebase(new Firebase(URL + '/places'));
  //$scope.items = Items.all();

  var lat = 0, 
      lng = 0;

  $scope.place = {};

 // $scope.init = function() {
   // navigator.geolocation.getCurrentPosition(
     // function(position) {
       // $scope.place.lat = position.coords.latitude;
        //$scope.place.lng = position.coords.longitude;
      //},
      //function() {
       // alert('Error getting location');
      //});
  //};

  //$scope.init();

  $scope.$on('tab.hidden', function() {
    console.log("Hidden");
  });

  $scope.save = function(place) {
    $scope.items.$add({
      name: $scope.place.name,
      description: $scope.place.description,
    });
  };
});