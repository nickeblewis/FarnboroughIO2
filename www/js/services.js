angular.module('fg.services', [])

/**
 * A simple example service that returns some data.
 */

// .service('Authenticate', function ($firebase) {
//   var ref = new Firebase('https://farnborough.firebaseio.com/feed');
//     this.auth = new FirebaseSimpleLogin(ref, function(error, user) {
//       if (error) {
//         // an error ocurred during login
//         console.log(error);
//       } else if (user) {
//         // You are logged in
//         console.log('factory User ID: ' + user.id + ', Provider: ' + user.provider);
//         //isAuthorised = true;
//       } else {
//         // User has logged out
//         console.log('factory User has logged out');
//       }
//     });

//     //return $firebase(ref);  
// })
.constant('FIREBASE_URL', 'https://farnborough.firebaseio.com/')
.factory('Auth', function($firebase, $rootScope, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var auth = FirebaseSimpleLogin(ref, function(error, user) {
    if (error) {
        // an error ocurred during login
        console.log(error);
      } else if (user) {
        // You are logged in
        console.log('factory User ID: ' + user.id + ', Provider: ' + user.provider);
        $rootScope.signedIn = true;
        $rootScope.signedInAs = user;
        //isAuthorised = true;
      } else {
        // User has logged out
        console.log('factory User has logged out');
        $rootScope.signedIn = false;
      }
  });
  
  var Auth = {
    register: function (user) {
        return auth.createUser(user.email, user.password);
      },
      signedIn: function () {
        return $rootScope.signedIn;
      },
      signedInAs: function() {
        return $rootScope.signedInAs;
      },
      login: function (user) {
        return auth.login('password', user);
      },
      logout: function () {
        auth.logout();
        $rootScope.signedIn = false;
      }
  };
    
  return Auth;
})

.factory('Feed', function($rootScope, $firebase, Firebase, $ionicLoading) {
    
  var feed = {},
      item = {};
  
  var alreadyLoaded = false;
  
  return {
    all: function(ref, limit) {   
      if(!alreadyLoaded) {
       
      $ionicLoading.show({
        content: 'Loading',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 500
      });
      }
      
      var queryRef = new Firebase(ref).limit(limit);      
      feed = $firebase(queryRef);  
      
      feed.$on('loaded', function() {
        $ionicLoading.hide();
        alreadyLoaded = true;
      });

      return feed;
    },
    get: function(ref) {
      var queryRef = new Firebase(FIREBASE_URL + ref);      
      item = $firebase(queryRef);  
      
      return item;
    }
  }
})

// .factory('Friends', function() {
//   // Might use a resource here that returns a JSON array

//   // Some fake testing data
//   var friends = [
//     { id: 0, name: 'Scruff McGruff' },
//     { id: 1, name: 'G.I. Joe' },
//     { id: 2, name: 'Miss Frizzle' },
//     { id: 3, name: 'Ash Ketchum' }
//   ];

//   return {
//     all: function() {
//       return friends;
//     },
//     get: function(friendId) {
//       // Simple index lookup
//       return friends[friendId];
//     }
//   }
// })

.factory('LoaderService', function($rootScope, $ionicLoading) {

  // Trigger the loading indicator
  return {
        show : function() { //code from the ionic framework doc

            // Show the loading overlay and text
            $rootScope.loading = $ionicLoading.show({
              content: 'Loading',
              animation: 'fade-in',
              showBackdrop: true,
              maxWidth: 200,
              showDelay: 500
            });
        },
        hide : function(){
            $rootScope.$ionicLoading.hide();
        }
    }
});
