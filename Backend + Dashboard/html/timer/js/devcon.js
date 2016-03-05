/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('devcon', []);


    app.controller("DevConController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.devices = [];
        controller.connectionTypes = [];
        controller.objects = [];

        $http.get('./php/devcon/getDevices.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.devices=data;

            //console.log(controller.versions);
            for(var i=0; i<controller.devices.length; i++){
                controller.connectionTypes[i] = [];
                controller.objects[i] = [];
                $http.get('./php/devcon/getConnectionTypes.php?app=' + appName + '&type=' + type + '&device=' + controller.devices[i] + '&number=' + i).success(function(data) {
                    var connectionArray = data[Object.keys(data)];
                    var deviceIndex = Object.keys(data)[0];
                    controller.connectionTypes[deviceIndex] = connectionArray;

                    for(var j=0; j<connectionArray.length; j++){
                        controller.objects[deviceIndex][j] = [];
                        $http.get('./php/devcon/getData.php?app=' + appName + '&type=' + type + '&device=' + controller.devices[deviceIndex] +"&connectionType=" + connectionArray[j] + '&number=' + deviceIndex +'&number2=' + j).success(function(data) {

                            var deviceIndex = Object.keys(data)[0];
                            var dataArray = data[deviceIndex];
                            var connectionIndex = dataArray['number2'];
                            dataArray = dataArray['array'];



                            controller.objects[deviceIndex][connectionIndex] = dataArray;
                            console.log(connectionIndex);

                        });
                    }


                });





            }

        });
    }]);

})();