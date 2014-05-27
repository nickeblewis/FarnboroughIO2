angular.module('fg.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
  function initialize() {
    // Show the middle of Farnborough but this could be other places though
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

.controller('FeedCtrl', function($scope, Friends, $firebase, $ionicLoading) {
  $scope.ref = 'https://farnborough.firebaseio.com/places';
  $scope.limit = 10;
  $scope.orderby = 'updated';
  
  // Now we can set the source ref for the feed, other refs we may use are listed below
  // $scope.ref = 'https://farnborough.firebaseio.com/feed';
  
})

.controller('DetailCtrl', function($scope, $stateParams, Friends, $firebase) {
  //$scope.friend = Friends.get($stateParams.friendId);
  $scope.place = {};

  console.log('Stateparams' + $stateParams.itemId);
  var dataRef = new Firebase('https://farnborough.firebaseio.com/places/' + $stateParams.itemId);
    dataRef.on('value', function(snapshot) {
      
      $scope.place = snapshot.val();
      
      // NOTE: Cool don't need to explicitly pull out every field, just pass the objects around      
      // $scope.place.name = snapshot.val().name;
      // $scope.place.description = snapshot.val().description;
      // $scope.place.lat = snapshot.val().lat;
      // $scope.place.lng = snapshot.val().lng;
      // $scope.feed = snapshot.val().feed;
  });

  // None of the below is needed at the moment, keeping the code for reference purposes
  //   angular.extend($scope, {
  //     center: {
  //       lat: $scope.place.lat,
  //       lng: $scope.place.lng,
  //       zoom: 16
  //     },
  //     markers: {
  //       main_marker: {
  //         lat: $scope.place.lat,
  //         lng: $scope.place.lng,
  //         focus: true,
  //         draggable: true,
  //         message: "Fred"

  //       }
  //     },
  //     defaults: {
  //       maxZoom: 18,
  //       minZoom: 1,
  //       zoom: 6,
  //       zoomControlPosition: 'topright',
  //       tileLayerOptions: {
  //         opacity: 0.9,
  //         detectRetina: true,
  //         reuseTiles: true,
  //       },
  //       scrollWheelZoom: false
  //     }
  //   });
})

.controller('EditCtrl', function($scope, $stateParams, Friends, $firebase, $location, $timeout, $ionicPopup, $q) {
  var placeUrl = 'https://farnborough.firebaseio.com/places/' + $stateParams.itemId;
  $scope.place = $firebase(new Firebase(placeUrl));
 
  $scope.confirmDelete = function() {
    $ionicPopup.confirm({
      title: 'Delete Item',
      content: 'Are you sure you want to delete this item?'
    }).then(function(res) {
      if(res) {
        $scope.place.$remove();
        $location.path('/');
      } else {
        $location.path('/');
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
    $scope.place.$save();

    // Update the feed

    // Need some unit tests for this but...
    // "Link Up Ltd" updated their Profile
    var messageListRef = new Firebase('https://farnborough.firebaseio.com/places');
    var newMessageRef = messageListRef.push();          
                   
    //$scope.place.imageData = 0;

    newMessageRef.set({
      'message': $scope.place.name + " has been edited",
      'updated': $scope.place.updated});
    
    $location.path('/');
    
  };
})

.controller('AddCtrl', function($scope, $firebase, $location) {

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
      updated: (new Date()).getTime()
    });
    $location.path('/');
  };
})

.controller('LoginCtrl', function($scope, $firebase, Auth, $location) {

  
//   if (Auth.signedIn()) {
//       $location.path('/');
//     }
  
  $scope.login = function() {
//     Authenticate.auth.login('password', {
//       email: $scope.login.email,
//       password: $scope.login.password
//     });  
    
    Auth.login($scope.user).then(function() {
      $location.path('/');
    })
  };
  
  $scope.register = function() {

    
//     Authenticate.auth.createUser($scope.login.email, $scope.login.password, function(error, user) {
//       if (!error) {
//         console.log('User Id: ' + user.uid + ', Email: ' + user.email);
//       }
//     });
    Auth.register($scope.user).then(function (authUser) {
        console.log(authUser);
        $location.path('/');
      });
  };
});