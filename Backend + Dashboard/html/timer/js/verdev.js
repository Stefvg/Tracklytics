/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('verdev', []);


    app.controller("VerDevController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.versions = [];
        controller.devices = [];
        controller.objects = [];

        $http.get('./php/verdev/getVersions.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.versions=data;

            //console.log(controller.versions);
            for(var i=0; i<controller.versions.length; i++){
                controller.devices[i] = [];
                controller.objects[i] = [];
                $http.get('./php/verdev/getDevices.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[i] + '&number=' + i).success(function(data) {
                    var deviceArray = data[Object.keys(data)];
                    var versionIndex = Object.keys(data)[0];
                    controller.devices[versionIndex] = deviceArray;

                    for(var j=0; j<deviceArray.length; j++){
                        controller.objects[versionIndex][j] = [];
                        $http.get('./php/verdev/getData.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[versionIndex] +"&device=" + deviceArray[j] + '&number=' + versionIndex +'&number2=' + j).success(function(data) {

                            var versionIndex = Object.keys(data)[0];
                            var dataArray = data[versionIndex];
                            var deviceIndex = dataArray['number2'];
                            dataArray = dataArray['array'];
                            controller.objects[versionIndex][deviceIndex] = dataArray;

                        });
                    }


                });





            }

        });
    }]);

})();