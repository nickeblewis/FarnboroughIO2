angular.module('starter.controllers', [])

.controller('PopupCtrl', function($scope, $timeout, $q, $ionicPopup) {
          $scope.showPopup = function() {
            $scope.data = {}

            $ionicPopup.show({
              templateUrl: 'popup-template.html',
              title: 'Enter Wi-Fi Password',
              subTitle: 'WPA2',
              scope: $scope,
              buttons: [
                { text: 'Cancel', onTap: function(e) { return true; } },
                {
                  text: '<b>Save</b>',
                  type: 'button-positive',
                  onTap: function(e) {
                    return $scope.data.wifi;
                  }
                },
              ]
              }).then(function(res) {
                console.log('Tapped!', res);
              }, function(err) {
                console.log('Err:', err);
              }, function(msg) {
                console.log('message:', msg);
              });

            $timeout(function() {
              $ionicPopup.alert({
                title: 'Unable to connect to network'
              }).then(function(res) {
                console.log('Your love for ice cream:', res);
              });
            }, 1000);
          };

          $scope.showConfirm = function() {
            $ionicPopup.confirm({
              title: 'Consume Ice Cream',
              content: 'Are you sure you want to eat this ice cream?'
            }).then(function(res) {
              if(res) {
                console.log('You are sure');
              } else {
                console.log('You are not sure');
              }
            });
          };
          $scope.showPrompt = function() {
            $ionicPopup.prompt({
              title: 'ID Check',
              subTitle: 'What is your name?'
            }).then(function(res) {
              console.log('Your name is', res);
            });
          };
          $scope.showPasswordPrompt = function() {
            $ionicPopup.prompt({
              title: 'Password Check',
              subTitle: 'Enter your secret password',
              inputType: 'password',
              inputPlaceholder: 'Your password'
            }).then(function(res) {
              console.log('Your name is', res);
            });
          };
          $scope.showAlert = function() {
            $ionicPopup.alert({
              title: 'Don\'t eat that!',
              content: 'That\'s my sandwich'
            }).then(function(res) {
              console.log('Thank you for not eating my delicious ice cream cone');
            });
          };
      })
                
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
                $scope.place = snapshot.val();
//       $scope.place.name = snapshot.val().name;
//       $scope.place.description = snapshot.val().description;
//       $scope.place.lat = snapshot.val().lat;
//       $scope.place.lng = snapshot.val().lng;
//                 $scope.feed = snapshot.val().feed;
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

.controller('FriendEditCtrl', function($scope, $stateParams, Friends, $firebase, $location, $timeout, $ionicPopup, $q) {
  var placeUrl = 'https://farnborough.firebaseio.com/places/' + $stateParams.itemId;
    $scope.place = $firebase(new Firebase(placeUrl));
 
    $scope.confirmDelete = function() {
            $ionicPopup.confirm({
              title: 'Delete Item',
              content: 'Are you sure you want to delete this item?'
            }).then(function(res) {
              if(res) {
                console.log('You are sure');
                $scope.place.$remove();
                $location.path('/');
                
              } else {
                console.log('You are not sure');
                $location.path('/');
              }
            });
          };
                
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
});