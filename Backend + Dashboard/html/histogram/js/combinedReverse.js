/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('combinedReverse', ['chart.js']);


    /* app.directive("counts", function() {
     return {
     restrict: 'E',
     templateUrl: "/angular-extensions/counts.html"
     };
     });*/

    app.controller('CombinedReverseController', ['$rootScope', '$timeout', '$scope', '$http', function ($rootScope, $timeout, $scope, $http) {
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);
        
        $rootScope.$on('refreshSlider', function (event,data) {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        });

        var $chart;
        $scope.$on("create", function (event, chart) {
            if (typeof $chart !== "undefined") {
                $chart.destroy();
            }

            $chart = chart;
        });

        var hist = this;
        hist.tempValues = [];
        hist.versions = [];
        hist.devices = [];

        hist.scopeIndex = 0;
        $scope.labels = [];
        $scope.data = [];
        $scope.slider = [];
        $http.get('./php/combinedReverse/getDevices.php?app=' + appName + '&type=' + type).success(function(data){
            hist.devices = data;

            for(var i =0; i< data.length; i++){
                hist.versions[i] = [];
                hist.tempValues[i] = [];
                $http.get('./php/combinedReverse/getVersions.php?app=' + appName + '&type=' +type +'&device=' + data[i] + '&number=' + hist.scopeIndex).success(function(data){
                    var versions = data[Object.keys(data)];
                    var deviceNumber = Object.keys(data)[0];
                    hist.versions[deviceNumber] = versions;
                    $scope.labels[deviceNumber] =[];
                    $scope.slider[deviceNumber] = [];
                    for(var k =0; k< versions.length; k++) {
                        hist.tempValues[deviceNumber][k] = [];
                        $http.get('./php/combinedReverse/getValues.php?app=' + appName + '&type=' + type + '&device=' + hist.devices[deviceNumber] + '&number=' + k +'&version=' + versions[k] + '&versionNumber=' + deviceNumber).success(function (data) {

                            var object = data[Object.keys(data)];
                            var values = object['array'];
                            var offset = object['offset'];
                            var valueIndex = Object.keys(data)[0];


                            var array = [];
                            var versionIndex;
                            for(var index=0; index<values.length; index++){
                                array[index] = values[index]['value'];
                                versionIndex = values[index]['versionNumber'];

                            }

                            $scope.labels[parseInt(versionIndex)][parseInt(valueIndex)] = array;
                            $scope.data[parseInt(versionIndex)] = [];
                            $scope.slider[parseInt(versionIndex)][parseInt(valueIndex)] = {
                                min: array[0],
                                max: array[array.length - 1],
                                options: {
                                    floor: array[0],
                                    ceil: array[array.length - 1],
                                    step: offset,
                                    onEnd: function(sliderId) {
                                        updateChartCombinedReverse($scope, valueIndex, versionIndex, type, $http, hist);
                                    }
                                }

                            };

                            for (var j = 0; j < array.length; j++) {


                                $http.get('./php/combinedReverse/getNumberOfValues.php?app=' + appName + '&type=' + type + '&device=' + hist.devices[versionIndex] + '&version=' + hist.versions[versionIndex][valueIndex] + '&number=' + versionIndex + '&number2=' + j + '&value=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
                                    var index1 = Object.keys(data)[0];
                                    var index2 = data[index1]['number2'];
                                    var index3 = data[index1]['number3'];

                                    //console.log("index1: " +index1);
                                    //console.log("index2: " +index2);
                                    //console.log("index3: " + index3);
                                   /* console.log(hist.tempValues);*/
                                    hist.tempValues[index1][index3][index2] = data[index1]['count'];
                                    if (index2 == $scope.labels[index1][index3].length - 1) {

                                        $scope.data[parseInt(index1)][index3] = [hist.tempValues[index1][index3]];
                                        //console.log("labels: " +$scope.labels);
                                        //console.log($scope.data);
                                        console.log("devices= " + hist.devices);
                                        console.log("versions= " + hist.versions);
                                    }

                                });
                            }

                        });

                    }
                });

                hist.scopeIndex++;

                //$scope.series = ['Series A', 'Series B'];



            }
        });

    }]);

})();


function updateChartCombinedReverse($scope, sliderID, deviceNumber, type, $http, hist){
    var min = $scope.slider[deviceNumber][sliderID].min;
    var max = $scope.slider[deviceNumber][sliderID].max;
    var appName = location.search.split('app=')[1];
    appName = decodeURIComponent(appName);

    $http.get('./php/combinedReverse/getValues.php?app=' + appName + '&type=' + type + '&device=' + hist.devices[deviceNumber] + '&number=' + sliderID +'&version=' + hist.versions[deviceNumber][sliderID] + '&versionNumber=' + deviceNumber +'&min=' + min + '&max=' +max).success(function (data) {

        var object = data[Object.keys(data)];
        var values = object['array'];
        var offset = object['offset'];
        var valueIndex = Object.keys(data)[0];


        var array = [];
        var versionIndex;
        for(var index=0; index<values.length; index++){
            array[index] = values[index]['value'];
            versionIndex = values[index]['versionNumber'];

        }

        $scope.labels[parseInt(versionIndex)][parseInt(valueIndex)] = array;
        $scope.data[parseInt(versionIndex)] = [];

        for (var j = 0; j < array.length; j++) {


            $http.get('./php/combinedReverse/getNumberOfValues.php?app=' + appName + '&type=' + type + '&device=' + hist.devices[versionIndex] + '&version=' + hist.versions[versionIndex][valueIndex] + '&number=' + versionIndex + '&number2=' + j + '&value=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];
                var index3 = data[index1]['number3'];

                //console.log("index1: " +index1);
                //console.log("index2: " +index2);
                //console.log("index3: " + index3);
                /* console.log(hist.tempValues);*/
                hist.tempValues[index1][index3][index2] = data[index1]['count'];
                if (index2 == $scope.labels[index1][index3].length - 1) {

                    $scope.data[parseInt(index1)][index3] = [hist.tempValues[index1][index3]];
                    //console.log("labels: " +$scope.labels);
                    //console.log($scope.data);
                    console.log("devices= " + hist.devices);
                    console.log("versions= " + hist.versions);
                }

            });
        }

    });
}