angular.module('fg.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(51.2944828,-0.7694426),
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
  
  // NOTE: This would only work for when the app first loads which I may re-introduce once I know how to make it work for going back to the tab
  // as the other issue is that it resets the map, the user loses their position which isnt ideal
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

.controller('FeedCtrl', function($scope, FIREBASE_URL) {
  $scope.ref = FIREBASE_URL + 'places';
  $scope.limit = 100;
  $scope.orderby = 'updated';
})

.controller('DetailCtrl', function($scope, $stateParams, $firebase, FIREBASE_URL) {
  var placeUrl = FIREBASE_URL + 'places/' + $stateParams.itemId;
  $scope.place = $firebase(new Firebase(placeUrl));
  $scope.place.id = $stateParams.itemId;
})

.controller('EditCtrl', function($scope, $stateParams, $firebase, $location, $timeout, $ionicPopup, $q, Auth, FIREBASE_URL) {
  var placeUrl = FIREBASE_URL + 'places/' + $stateParams.itemId;
  $scope.place = $firebase(new Firebase(placeUrl));
 
  $scope.confirmDelete = function() {
    $ionicPopup.confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item?'
    }).then(function(res) {
      if(res) {
        $scope.place.$remove();
        $location.path('#/tab/friend/' + $stateParams.itemId);
      } else {
        $location.path('#/tab/friend/' + $stateParams.itemId);
      }
    });
  };
                
  $scope.destroy = function() {
    $scope.place.$remove();
    $location.path('/');
  };

  $scope.save = function() {
                
    // Update the profile           
    $scope.place.updated = (new Date()).getTime();
    $scope.place.userid = Auth.signedInAs().id;
    $scope.place.$save();

    // Update the feed

    // Need some unit tests for this but...
    // "Link Up Ltd" updated their Profile
    var messageListRef = new Firebase(FIREBASE_URL + 'feed');
    var newMessageRef = messageListRef.push();          
                   
    //$scope.place.imageData = 0;

    newMessageRef.set({
      'message': $scope.place.name + " has been edited",
      'updated': $scope.place.updated,
      'userid': Auth.signedInAs().id});
    $location.path('/');    
  };
})

.controller('AddCtrl', function($scope, $firebase, $location, Auth, FIREBASE_URL) {
//   if (!Auth.signedIn()) {
//     $location.path('/');
//   }
  
  $scope.items = $firebase(new Firebase(FIREBASE_URL + '/places'));

  var lat = 0, 
      lng = 0;

  $scope.place = {};

  $scope.$on('tab.hidden', function() {
    console.log("Hidden");
  });

  $scope.save = function(place) {
    $scope.items.$add({
      name: $scope.place.name,
      description: $scope.place.description,
      updated: (new Date()).getTime(),
      userid: Auth.signedInAs().id
    });
    $location.path('/');
  };
  
  $scope.signedIn = function() {
    return Auth.signedIn();  
  };
})

.controller('LoginCtrl', function($scope, $firebase, Auth, $location, $rootScope) {
  
  $scope.user = {};
    
  $scope.login = function() {    
    Auth.login($scope.user).then(function() {
      $location.path('/');
    })
  };
  
  $scope.logout = function() {
    Auth.logout();
      $location.path('/');    
  };
  
  $scope.signedIn = function() {
    return Auth.signedIn();  
  };
  
  $scope.signedInAs = function() {
    return Auth.signedInAs().email;  
  };
  
  $scope.register = function() {
    Auth.register($scope.user).then(function (authUser) {
      console.log(authUser);
      $location.path('/');
    });
  };
});