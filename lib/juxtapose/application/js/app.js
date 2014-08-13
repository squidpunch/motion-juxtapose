angular.module('juxtapose', [
               'juxtapose.controllers',
               'juxtapose.services'
])
angular.module('juxtapose.controllers', [])
angular.module('juxtapose.services', [])

angular.module('juxtapose.services').factory('Project', [
  function(){
    return {
      query: function(){
        return Juxtapose.project;
      }
    }
  }
])

angular.module('juxtapose.controllers').controller('ProjectsCtrl', ['$scope', '$http', 'Project',
   function($scope, $http, Project){
     $scope.project = Project.query()

     $scope.accept = function(spec){
       $http({
         url: "/accept",
         method: "POST",
         data: {"filename": spec.current.img}
       }).success(function(response){
         response.image.path += "?refresh=true"
         spec.accepted = response.image
         spec.current = null
         spec.diff = null
       })
     }

     $scope.deviceName = function(spec){
       return spec.directory.match(/([^\/]*)\/[^\/]+\/[^\/]+\/[^\/]+$/)[1]
     }

     $scope.deviceNameMatcher = function(spec){
       return _.findWhere($scope.devices, {name: $scope.deviceName(spec), selected: true})
     }

     var devices = _.uniq(_.map($scope.project.specs, $scope.deviceName))
     $scope.devices = _.map(devices, function(device){
       return { name: device }
     });

     $scope.iOSVersion = function(spec){
       version = spec.directory.match(/([^\/]*)\/[^\/]+\/[^\/]+$/)[1] 
       iosVersion = version.match(/[\d\.]+/)
       if(iosVersion){
         return iosVersion[0];
       } else {
         return version;
       }
     }

     var versions = _.uniq(_.map($scope.project.specs, $scope.iOSVersion))
     $scope.versions = _.map(versions, function(version){
       return { name: version }
     });

     $scope.versionMatcher = function(spec){
       return _.findWhere($scope.versions, {name: $scope.iOSVersion(spec), selected: true})
     }

     $scope.specName = function(spec){
       var name = spec.directory.match(/([^\/]*\/[^\/]+)$/)[1].replace(/-/g, ' ').replace(/\//g, ' | ');;
       return name[0].toUpperCase() + name.slice(1)
     }

     $scope.specNameMatcher = function(spec){
       if(!$scope.search) {
         return true;
       }
       return $scope.specName(spec).toLowerCase().indexOf($scope.search.toLowerCase()) >= 0
     }

     $scope.onlyFailingMatcher = function(spec){
       if(!$scope.onlyFailing){
         return true
       }
       return spec.current
     }
   }
])
