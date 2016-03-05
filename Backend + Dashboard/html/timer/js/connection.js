/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('connection', []);


    app.controller("ConnectionController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.connectionTypes = [];
        controller.objects = [];

        $http.get('./php/connection/getConnectionTypes.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.connectionTypes=data;

            //console.log(controller.devices);
            for(var i=0; i<controller.connectionTypes.length; i++){
                controller.objects[i] = [];
                $http.get('./php/connection/getData.php?app=' + appName + '&type=' + type + '&connectionType=' + controller.connectionTypes[i] + '&number=' + i).success(function(data) {
                    console.log(data);
                    var value = data[Object.keys(data)];
                    var valueIndex = Object.keys(data)[0];
                    controller.objects[valueIndex] = value;
                });
            }

        });
    }]);

})();