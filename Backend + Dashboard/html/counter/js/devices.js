/**
 * Created by stefvangils on 24/11/15.
 */


/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('devices', ['chart.js']);


    /* app.directive("counts", function() {
     return {
     restrict: 'E',
     templateUrl: "/angular-extensions/counts.html"
     };
     });*/

    app.controller('DeviceController', ['$scope', '$http', function ($scope, $http) {
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var hist = this;
        hist.tempValues = [];
        hist.devices = [];

        $scope.labels = [];
        $scope.data = [];
        $http.get('./php/devices/getDevices.php?app=' + appName + '&type=' + type).success(function(data){
            hist.devices = data;
            for(var i =0; i< data.length; i++){
                $scope.labels[i] = [];
                hist.tempValues[i] = [];
                $http.get('./php/devices/getNames.php?app=' + appName + '&type=' +type +'&device=' + data[i] +'&number=' + i).success(function(data){
                    var names = data[Object.keys(data)];
                    var nameIndex = Object.keys(data)[0];

                    $scope.labels[nameIndex] = names;

                    for(var j=0; j<names.length; j++){

                        $http.get('./php/devices/getNumberOfValues.php?app=' + appName + '&type=' +type + '&device=' + hist.devices[nameIndex] +'&number=' + nameIndex + '&number2=' +j +'&name=' + names[j]).success(function(data){
                            var index1 = Object.keys(data)[0];
                            var index2 = data[index1]['number2'];
                            hist.tempValues[index1][index2] = data[index1]['count'];
                            if(index2==$scope.labels[index1].length-1){
                                $scope.data[index1] = [hist.tempValues[index1]];


                            }

                        });
                    }

                });

                //$scope.series = ['Series A', 'Series B'];



            }
        });

    }]);

})();