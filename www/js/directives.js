angular.module('fg.directives', [])

// Cached templates for directives
.run(['$templateCache',
  function ($templateCache) {
    $templateCache.put(
      'searchbar.html',
      '<div class="list list-inset">' +
        '<label class="item item-input">' +
        '<i class="icon ion-search placeholder-icon"></i>' +
        '<input type="text" ng-model="search" placeholder="Search this feed">' +
      '</div>'
    );
  }
])

.run(['$templateCache',
  function ($templateCache) {
    $templateCache.put(
      'statusbar.html',      
      '<div class="list">' +
  '<div class="item item-input-inset">' +
    '<label class="item-input-wrapper">' +
      '<input type="text" ng-model="status" placeholder="Status post">' +
    '</label>' +
    '<button class="button button-small" ng-click="postStatus()">' +
      'Post' +
    '</button>' +
  '</div>' +
'</div>'
    );
  }
])

.run(['$templateCache',
  function ($templateCache) {
    $templateCache.put(
      'feedlist.html',
      '<div>' +
        '<div class="list list-inset">' +
          '<label class="item item-input">' +
          '<i class="icon ion-search placeholder-icon"></i>' +
          '<input type="text" ng-model="search" placeholder="Search this feed">' +
        '</div>' +
      '<div class="list card" ng-repeat="(name,item) in items | orderByPriority | filter:search | orderBy:\'updated\':reverse=true">' +
        '<div class="item item-avatar">' +
          '<img src="http://placehold.it/40x40" ng-href="#/tab/friend/{{item.$id}}">' +
          '<h2>{{item.name}}</h2>' +
          '<h2>{{item.message}}</h2>' +
          '<p>{{item.description}}</p>' +        
          '<ul class="feed-list" ng-show="item.feed.length > 0">' +
            '<li ng-repeat="item in item.feed" ng-if="item != null"><i class="glyphicon glyphicon-user"></i><i class="ion-chatboxes"></i> {{item}}</li>' +
          '</ul>' +
          '<br>' +
          '<p>Updated {{timeAgo(item.updated)}}</p>' +
          '</div>' +
          '<div class="button-bar">' +      
            '<a href="#/tab/friend/{{item.$id}}" class="button button-small button-calm">View</a>' +
            '<a href="#/tab/edit/{{item.$id}}" class="button button-small button-assertive">Edit</a> ' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }
])
        
// Directive controllers
.controller('PostStatusCtrl', function($scope) {
                   
  $scope.postStatus = function() {
  var messageListRef = new Firebase('https://farnborough.firebaseio.com/feed');
  var newMessageRef = messageListRef.push();          
  
    newMessageRef.set({
      'message': $scope.status,
      'updated': (new Date()).getTime()
    });
    
    $scope.status = "";
    
  };      
})

.controller('FeedListCtrl', function($scope, Feed, $ionicLoading, LoaderService, Authenticate) {
    
  //$scope.alreadyLoaded = null;    
  // or we can retrieve data from the mock service if we need to - $scope.places = Items.all();
  //if(!alreadyLoaded) {
  //  $scope.loading = $ionicLoading.show({
  //        content: 'Loading places...',
  //        showBackdrop: false
  //      });
  //}
  
  // Show loader from service
    //LoaderService.show();

        // add action here...

       
  $scope.items = Feed.all($scope.ref, $scope.limit);
  
  // TODO - Should I do something more specific with this onload event?
  $scope.items.$on('loaded', function() {
    //$scope.loading.hide();
    // alreadyLoaded = true;
    //console.log($scope.items);
    //LoaderService.hide();  
  });
         // Hide overlay when done
              
  $scope.timeAgo = function(ms) {
    return moment(ms).fromNow();
  };  
})

// The Directives
.directive('searchbar', function () {
  return {
    templateUrl: 'searchbar.html',
    restrict: 'EA',
    replace: true
  };
})

.directive('statuspost', function () {
  return {
    templateUrl: 'statusbar.html',
    controller: 'PostStatusCtrl',
    restrict: 'EA',
    replace: true
  };
})

.directive('feedlist', function() {
  return {
    templateUrl: 'feedlist.html',
    restrict: 'EA',
    scope: {
      ref: '=',
      limit: '=',
      orderby: '='
     },
    replace: true,
    controller: 'FeedListCtrl'
  };  
});