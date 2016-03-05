/**
 * Created by stefvangils on 25/11/15.
 */
/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('mean', []);


    app.controller("MeanController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.combinedValues = [];
        controller.versions = [];
        controller.objects = [];

        $http.get('./php/mean/getCombinedValue.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.combinedValues = data;
        });


        $http.get('./php/getVersions.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.versions=data;

            //console.log(controller.versions);
            for(var i=0; i<controller.versions.length; i++){
                controller.objects[i] = [];
                $http.get('./php/mean/getData.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[i] + '&number=' + i).success(function(data) {
                    var value = data[Object.keys(data)];
                    var valueIndex = Object.keys(data)[0];
                    controller.objects[valueIndex] = value;
                });
            }

        });
    }]);

})();