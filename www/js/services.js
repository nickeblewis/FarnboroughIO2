angular.module('fg.services', [])

/**
 * A simple example service that returns some data.
 */

.factory('Authenticate', function () {
  
})

.factory('Feed', function($rootScope, $firebase, Firebase, $ionicLoading) {
    
  var feed = {};
  var alreadyLoaded = false;
  
  return {
    all: function(ref, limit) {   
      $ionicLoading.show({

        // The text to display in the loading indicator
        content: 'Loading',

        // The animation to use
        animation: 'fade-in',

        // Will a dark overlay or backdrop cover the entire view
        showBackdrop: true,

        // The maximum width of the loading indicator
        // Text will be wrapped if longer than maxWidth
        maxWidth: 200,

        // The delay in showing the indicator
        showDelay: 500
      });
      
      var queryRef = new Firebase(ref).limit(limit);      
      feed = $firebase(queryRef);  
      
      //feed.on('child_added', function() {
      //  console.log('child_added');
      //});
      
      feed.$on('loaded', function() {
        $ionicLoading.hide();
        alreadyLoaded = true;
      });

      return feed;
    },
    get: function(itemId) {
      // TODO: Add later on 
    }
  }
})

.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('LoaderService', function($rootScope, $ionicLoading) {

  // Trigger the loading indicator
  return {
        show : function() { //code from the ionic framework doc

            // Show the loading overlay and text
            $rootScope.loading = $ionicLoading.show({

              // The text to display in the loading indicator
              content: 'Loading',

              // The animation to use
              animation: 'fade-in',

              // Will a dark overlay or backdrop cover the entire view
              showBackdrop: true,

              // The maximum width of the loading indicator
              // Text will be wrapped if longer than maxWidth
              maxWidth: 200,

              // The delay in showing the indicator
              showDelay: 500
            });
        },
        hide : function(){
            $rootScope.$ionicLoading.hide();
        }
    }
});
