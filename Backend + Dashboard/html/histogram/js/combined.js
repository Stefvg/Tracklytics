/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('combined', ['chart.js']);


    /* app.directive("counts", function() {
     return {
     restrict: 'E',
     templateUrl: "/angular-extensions/counts.html"
     };
     });*/

    app.controller('CombinedController', ['$rootScope', '$timeout', '$scope', '$http', function ($rootScope, $timeout, $scope, $http) {
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        $rootScope.$on('refreshSlider', function (event,data) {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        });

        var hist = this;
        hist.tempValues = [];
        hist.versions = [];
        hist.devices = [];

        hist.scopeIndex = 0;
        $scope.labels = [];
        $scope.data = [];
        $scope.slider = [];
        $http.get('./php/combined/getVersions.php?app=' + appName + '&type=' + type).success(function(data){
            hist.versions = data;

            for(var i =0; i< data.length; i++){
                hist.devices[i] = [];
                $http.get('./php/combined/getDevices.php?app=' + appName + '&type=' +type +'&version=' + data[i] + '&number=' + hist.scopeIndex).success(function(data){
                    var devices = data[Object.keys(data)];
                    var versionNumber = Object.keys(data)[0];
                    hist.devices[versionNumber] = devices;
                    $scope.labels[versionNumber] =[];
                    $scope.slider[versionNumber] =[];
                    for(var k =0; k< devices.length; k++) {

                        $http.get('./php/combined/getValues.php?app=' + appName + '&type=' + type + '&version=' + hist.versions[versionNumber] + '&number=' + k +'&device=' + devices[k] + '&versionNumber=' + versionNumber).success(function (data) {
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
                                        updateChartCombined($scope, valueIndex, versionIndex, type, $http, hist);
                                    }
                                }

                            };

                            hist.tempValues[versionIndex] = [];
                            for (var j = 0; j < array.length; j++) {

                                hist.tempValues[versionIndex][j] = [];

                                $http.get('./php/combined/getNumberOfValues.php?app=' + appName + '&type=' + type + '&device=' + hist.devices[versionIndex][valueIndex] + '&version=' + hist.versions[versionIndex] + '&number=' + versionIndex + '&number2=' + j + '&value=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
                                    var index1 = Object.keys(data)[0];
                                    var index2 = data[index1]['number2'];
                                    var index3 = data[index1]['number3'];

                                    hist.tempValues[index1][index3][index2] = data[index1]['count'];
                                    if (index2 == $scope.labels[index1][index3].length - 1) {

                                        $scope.data[parseInt(index1)][index3] = [hist.tempValues[index1][index3]];

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

function updateChartCombined($scope, sliderID, versionNumber, type, $http, hist){
    var appName = location.search.split('app=')[1];
    appName = decodeURIComponent(appName);
    var min = $scope.slider[versionNumber][sliderID].min;
    var max = $scope.slider[versionNumber][sliderID].max;
    $http.get('./php/combined/getValues.php?app=' + appName + '&type=' + type + '&version=' + hist.versions[versionNumber] + '&number=' + sliderID +'&device=' + hist.devices[versionNumber][sliderID] + '&versionNumber=' + versionNumber + '&min=' + min + '&max=' + max).success(function (data) {
        var object = data[Object.keys(data)];
        var values = object['array'];
        var offset = object['offset'];
        var valueIndex = Object.keys(data)[0];


        console.log(object);
        var array = [];
        var versionIndex;
        for(var index=0; index<values.length; index++){
            array[index] = values[index]['value'];
            versionIndex = values[index]['versionNumber'];
            console.log("value: " + values[index]['value']);
            console.log("versionIndex: " + values[index]['versionNumber']);
        }

        $scope.labels[parseInt(versionIndex)][parseInt(valueIndex)] = array;
        $scope.data[parseInt(versionIndex)] = [];


        hist.tempValues[versionIndex] = [];
        for (var j = 0; j < array.length; j++) {

            hist.tempValues[versionIndex][j] = [];

            $http.get('./php/combined/getNumberOfValues.php?app=' + appName + '&type=' + type + '&device=' + hist.devices[versionIndex][valueIndex] + '&version=' + hist.versions[versionIndex] + '&number=' + versionIndex + '&number2=' + j + '&value=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];
                var index3 = data[index1]['number3'];

                hist.tempValues[index1][index3][index2] = data[index1]['count'];
                if (index2 == $scope.labels[index1][index3].length - 1) {

                    $scope.data[parseInt(index1)][index3] = [hist.tempValues[index1][index3]];

                }

            });
        }

    });
}