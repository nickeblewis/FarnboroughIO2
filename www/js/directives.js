angular.module('fg.directives', [])

.directive('searchbar', function () {
  return {
    template: '<div class="col-md-12 card search"><div class="status-bar"><input type="text" ng-model="search" class="form-control" placeholder="Search this feed"></div></div>',
    restrict: 'EA',
    replace: true
  };
})

.directive('statuspost', function () {
  return {
    template: '<div class="col-md-12 card search"><div class="status-bar"><input type="text" ng-model="status" class="form-control" placeholder="Post a status"></div><div class="button" ng-click="postStatus()">Post</div></div>',
    controller: 'PostStatusCtrl',
    restrict: 'EA',
    replace: true
  };
});