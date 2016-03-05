/**
 * Created by stefvangils on 25/11/15.
 */
(function(){
    var app = angular.module('vercon', []);


    app.controller("VerConController", ['$http', function($http){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var controller = this;
        controller.versions = [];
        controller.connectionTypes = [];
        controller.objects = [];

        $http.get('./php/vercon/getVersions.php?app=' + appName + '&type=' + type).success(function(data) {
            controller.versions=data;

            //console.log(controller.versions);
            for(var i=0; i<controller.versions.length; i++){
                controller.connectionTypes[i] = [];
                controller.objects[i] = [];
                $http.get('./php/vercon/getConnectionTypes.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[i] + '&number=' + i).success(function(data) {
                    var connectionArray = data[Object.keys(data)];
                    var versionIndex = Object.keys(data)[0];
                    controller.connectionTypes[versionIndex] = connectionArray;

                    for(var j=0; j<connectionArray.length; j++){
                        controller.objects[versionIndex][j] = [];
                        $http.get('./php/vercon/getData.php?app=' + appName + '&type=' + type + '&version=' + controller.versions[versionIndex] +"&connectionType=" + connectionArray[j] + '&number=' + versionIndex +'&number2=' + j).success(function(data) {

                            var versionIndex = Object.keys(data)[0];
                            var dataArray = data[versionIndex];
                            var connectionIndex = dataArray['number2'];
                            dataArray = dataArray['array'];
                            controller.objects[versionIndex][connectionIndex] = dataArray;

                        });
                    }


                });





            }

        });
    }]);

})();