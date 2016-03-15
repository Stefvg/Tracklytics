/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('data', []);


    app.controller("DataController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.combinedValues = [];
        controller.versions = [];
        controller.objects = [];

        $http.get('./php/data/getCombinedValue.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.combinedValues = data;
        });


        $http.get('./php/data/getVersions.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.versions=data;
            for(var i=0; i<controller.versions.length; i++){
                controller.objects[i] = [];
                $http.get('./php/data/getData.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[i] + '&number=' + i).success(function(data) {
                    var value = data[Object.keys(data)];
                    var valueIndex = Object.keys(data)[0];
                    controller.objects[valueIndex] = value;

                });
            }

        });
    }]);

})();