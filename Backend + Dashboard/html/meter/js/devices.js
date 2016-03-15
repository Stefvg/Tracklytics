/**
 * Created by stefvangils on 24/11/15.
 */


/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('devices', ['chart.js', 'rzModule']);


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

        var charts = this;
        charts.type = type;
        charts.appName = appName;

        charts.devices = [];

        $scope.labels = [];
        $scope.data = [];
        charts.sliderValues = [];


        $scope.slider =[];
        $http.get('./php/devices/getDevices.php?app=' + appName + '&type=' + type).success(function(data){
            charts.devices = data;
            for(var i =0; i< data.length; i++){
                $scope.data[i] = [];
                $scope.data[i][0] = [];
                $scope.labels[i] = [];
                $http.get('./php/devices/getDates.php?app=' + appName + '&type=' +type +'&device=' + data[i] +'&number=' + i).success(function(data){
                    var object = data[Object.keys(data)];
                    var values = object['array'];
                    var labels = object['labels'];
                    var valueIndex = Object.keys(data)[0];


                    $scope.labels[valueIndex] = values;
                    charts.sliderValues[valueIndex] = labels;

                    $scope.slider[valueIndex] = {
                        min: 0,
                        max: labels.length - 1,
                        /* options: {
                         floor: values[0],
                         ceil: values[values.length - 1],

                         }*/

                        options: {
                            stepsArray: labels.slice(), // equals to ['A', 'B', ... 'Z']
                            onEnd: function (sliderId) {
                                updateMeterChart($scope, valueIndex, charts.type, $http,charts);
                            }
                        }

                    };

                    for(var j=0; j<values.length; j++){

                        $http.get('./php/devices/getValues.php?app=' + appName + '&type=' +type + '&device=' + charts.devices[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&date=' + values[j]).success(function(data){

                            var index1 = Object.keys(data)[0];
                            var index2 = data[index1]['number2'];

                            $scope.data[index1][0][index2] = data[index1]['avg'];

                        });
                    }

                });

                //$scope.series = ['Series A', 'Series B'];



            }
        });

    }]);

})();


function updateMeterChart($scope, sliderID, type, $http, charts) {

    var min = $scope.slider[sliderID].min;
    var max = $scope.slider[sliderID].max;



    $http.get('./php/devices/getDates.php?app=' + charts.appName + '&type=' +charts.type +'&device=' + charts.devices[sliderID] +'&number=' + sliderID + '&min='+ charts.sliderValues[sliderID][min] +'&max=' + charts.sliderValues[sliderID][max]).success(function(data){
        var object = data[Object.keys(data)];
        var values = object['array'];
        var offset = object['offset'];
        var valueIndex = Object.keys(data)[0];
        $scope.labels[valueIndex] = values;


        for(var j=0; j<values.length; j++){
            $http.get('./php/devices/getValues.php?app=' + charts.appName + '&type=' + charts.type + '&device=' + charts.devices[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&date=' + values[j] + '&offset=' + offset).success(function(data){
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];

                $scope.data[index1][0][index2] = data[index1]['avg'];

            });
        }

    });

    //$scope.series = ['Series A', 'Series B'];



}