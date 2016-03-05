/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('combined', []);


    app.controller("CombinedController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.versions = [];
        controller.devices = [];
        controller.connectionTypes = [];
        controller.objects = [];

        $http.get('./php/combined/getVersions.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.versions=data;

            //console.log(controller.versions);
            for(var i=0; i<controller.versions.length; i++){
                controller.devices[i] = [];
                controller.objects[i] = [];
                controller.connectionTypes[i] = [];
                $http.get('./php/combined/getDevices.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[i] + '&number=' + i).success(function(data) {
                    var deviceArray = data[Object.keys(data)];
                    var versionIndex = Object.keys(data)[0];
                    controller.devices[versionIndex] = deviceArray;

                    for(var j=0; j<deviceArray.length; j++){
                        controller.connectionTypes[versionIndex][j] = [];
                        controller.objects[versionIndex][j] = [];
                        $http.get('./php/combined/getConnectionTypes.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[versionIndex] +"&device=" + deviceArray[j] + '&number=' + versionIndex +'&number2=' + j).success(function(data) {
                            var versionIndex = Object.keys(data)[0];
                            var dataArray = data[versionIndex];
                            var deviceIndex = dataArray['number2'];
                            dataArray = dataArray['array'];
                            controller.connectionTypes[versionIndex][deviceIndex] = dataArray;

                            for(var k=0; k<dataArray.length; k++){
                                controller.objects[versionIndex][deviceIndex][k] = [];
                                $http.get('./php/combined/getData.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[versionIndex] +"&device=" + deviceArray[deviceIndex] + '&connectionType=' + dataArray[k] + '&number=' + versionIndex +'&number2=' + deviceIndex + '&number3=' +k).success(function(data) {

                                    var versionIndex = Object.keys(data)[0];
                                    var dataArray = data[versionIndex];
                                    var deviceIndex = dataArray['number2'];
                                    var connectionIndex = dataArray['number3'];
                                    dataArray = dataArray['array'];
                                    controller.objects[versionIndex][deviceIndex][connectionIndex] = dataArray;
                                    console.log(controller.objects);
                                });

                            }


                        });

                        /*$http.get('./php/combined/getData.php?type=' + type + '&version=' + controller.versions[versionIndex] +"&device=" + deviceArray[j] + '&number=' + versionIndex +'&number2=' + j).success(function(data) {

                            var versionIndex = Object.keys(data)[0];
                            var dataArray = data[versionIndex];
                            var deviceIndex = dataArray['number2'];
                            dataArray = dataArray['array'];
                            controller.objects[versionIndex][deviceIndex] = dataArray;

                        });*/
                    }


                });





            }

        });
    }]);

})();