/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('device', []);


    app.controller("DeviceController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.devices = [];
        controller.objects = [];

        $http.get('./php/device/getDevices.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.devices=data;

            //console.log(controller.versions);
            for(var i=0; i<controller.devices.length; i++){
                controller.objects[i] = [];
                $http.get('./php/device/getData.php?app=' + appName + '&type=' + type + '&device=' + controller.devices[i] + '&number=' + i).success(function(data) {
                    var value = data[Object.keys(data)];
                    var valueIndex = Object.keys(data)[0];
                    controller.objects[valueIndex] = value;
                });
            }

        });
    }]);

})();