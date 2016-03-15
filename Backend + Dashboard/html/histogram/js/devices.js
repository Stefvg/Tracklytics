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

        var hist = this;
        hist.tempValues = [];
        hist.devices = [];

        $scope.labels = [];
        $scope.data = [];
        var $chart;
        $scope.$on("create", function (event, chart) {
            if (typeof $chart !== "undefined") {
                $chart.destroy();
            }

            $chart = chart;
        });
        $scope.slider =[];
        $http.get('./php/devices/getDevices.php?app=' + appName + '&type=' + type).success(function(data){
            hist.devices = data;
            for(var i =0; i< data.length; i++){
                $scope.labels[i] = [];
                hist.tempValues[i] = [];
                $http.get('./php/devices/getValues.php?app=' + appName + '&type=' +type +'&device=' + data[i] +'&number=' + i).success(function(data){
                    var object = data[Object.keys(data)];
                    console.log(object);
                    var values = object['array'];
                    var offset = object['offset'];
                    var valueIndex = Object.keys(data)[0];


                    $scope.labels[valueIndex] = values;

                    $scope.slider[valueIndex] = {
                        min: values[0],
                        max: values[values.length - 1],
                        options: {
                            floor: values[0],
                            ceil: values[values.length - 1],
                            step: offset,
                            onEnd: function(sliderId) {
                                updateChart($scope, valueIndex, type, $http, hist);
                            }
                        }

                    };
                    for(var j=0; j<values.length; j++){

                        $http.get('./php/devices/getNumberOfValues.php?app=' + appName + '&type=' +type + '&device=' + hist.devices[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&value=' + values[j] + '&offset=' + offset).success(function(data){
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


function updateChart($scope, sliderID, type, $http, hist) {
    var appName = location.search.split('app=')[1];
    appName = decodeURIComponent(appName);
    var min = $scope.slider[sliderID].min;
    var max = $scope.slider[sliderID].max;
    $http.get('./php/devices/getValues.php?app=' + appName + '&type=' +type +'&device=' + hist.devices[sliderID] +'&number=' + sliderID + '&min='+ min +'&max=' + max).success(function(data){
        var object = data[Object.keys(data)];
        var values = object['array'];
        var offset = object['offset'];
        var valueIndex = Object.keys(data)[0];
        $scope.labels[valueIndex] = values;

        console.log(values);
        for(var j=0; j<values.length; j++){
            $http.get('./php/devices/getNumberOfValues.php?app=' + appName + '&type=' +type + '&device=' + hist.devices[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&value=' + values[j] + '&offset=' + offset).success(function(data){
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];
                hist.tempValues[index2] = data[index1]['count'];
                if(index2==$scope.labels[index1].length-1){
                    $scope.data[index1] = [hist.tempValues];

                }

            });
        }

    });

    //$scope.series = ['Series A', 'Series B'];



}