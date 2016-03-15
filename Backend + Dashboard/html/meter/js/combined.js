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
        appName = appName.split('&')[0];
        appName = decodeURIComponent(appName);

        $rootScope.$on('refreshSlider', function (event,data) {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        });



        var charts = this;
        charts.tempValues = [];
        charts.versions = [];
        charts.devices = [];
        charts.sliderValues = [];
        charts.scopeIndex = 0;
        charts.appName = appName;
        $scope.labels = [];
        $scope.data = [];
        $scope.slider = [];
        $http.get('./php/combined/getVersions.php?app=' + appName + '&type=' + type).success(function(data){
            charts.versions = data;

            for(var i =0; i< data.length; i++){
                charts.devices[i] = [];
                $http.get('./php/combined/getDevices.php?app=' + appName + '&type=' +type +'&version=' + data[i] + '&number=' + charts.scopeIndex).success(function(data){
                    var devices = data[Object.keys(data)];
                    var versionNumber = Object.keys(data)[0];
                    charts.devices[versionNumber] = devices;
                    $scope.labels[versionNumber] =[];
                    charts.sliderValues[versionNumber] = [];
                    $scope.slider[versionNumber] =[];
                    for(var k =0; k< devices.length; k++) {

                        $http.get('./php/combined/getDates.php?app=' + appName + '&type=' + type + '&version=' + charts.versions[versionNumber] + '&number=' + k +'&device=' + devices[k] + '&versionNumber=' + versionNumber).success(function (data) {
                            var object = data[Object.keys(data)];
                            var values = object['array'];
                            var labels = object['labels'];
                            var offset = object['offset'];
                            var valueIndex = Object.keys(data)[0];



                            var array = [];
                            var versionIndex;
                            for(var index=0; index<values.length; index++){
                                array[index] = values[index]['date'];
                                versionIndex = values[index]['versionNumber'];

                            }

                            $scope.labels[parseInt(versionIndex)][parseInt(valueIndex)] = array;
                            $scope.data[parseInt(versionIndex)] = [];
                            charts.sliderValues[parseInt(versionIndex)][parseInt(valueIndex)] = labels;
                            $scope.slider[parseInt(versionIndex)][parseInt(valueIndex)] = {
                                /*min: array[0],
                                max: array[array.length - 1],
                                options: {
                                    floor: array[0],
                                    ceil: array[array.length - 1],
                                    step: offset,
                                    onEnd: function(sliderId) {
                                        updateChartCombined($scope, valueIndex, versionIndex, type, $http, charts);
                                    }
                                }*/
                                min: 0,
                                max: labels.length - 1,
                                /* options: {
                                 floor: values[0],
                                 ceil: values[values.length - 1],

                                 }*/

                                options: {
                                    stepsArray: labels.slice(), // equals to ['A', 'B', ... 'Z']
                                    onEnd: function (sliderId) {
                                        updateChartCombined($scope, valueIndex, versionIndex, type, $http, charts);
                                    }
                                }

                            };

                            charts.tempValues[versionIndex] = [];
                            for (var j = 0; j < array.length; j++) {

                                charts.tempValues[versionIndex][j] = [];

                                $http.get('./php/combined/getValues.php?app=' + appName + '&type=' + type + '&device=' + charts.devices[versionIndex][valueIndex] + '&version=' + charts.versions[versionIndex] + '&number=' + versionIndex + '&number2=' + j + '&date=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
                                    var index1 = Object.keys(data)[0];
                                    var index2 = data[index1]['number2'];
                                    var index3 = data[index1]['number3'];

                                    charts.tempValues[index1][index3][index2] = data[index1]['avg'];
                                    if (index2 == $scope.labels[index1][index3].length - 1) {
                                        $scope.data[parseInt(index1)][index3] = [charts.tempValues[index1][index3]];

                                    }

                                });
                            }

                        });

                    }
                });

                charts.scopeIndex++;

                //$scope.series = ['Series A', 'Series B'];



            }
        });

    }]);

})();

function updateChartCombined($scope, sliderID, versionNumber, type, $http, charts){

    var min = $scope.slider[versionNumber][sliderID].min;
    var max = $scope.slider[versionNumber][sliderID].max;


    $http.get('./php/combined/getDates.php?app=' + charts.appName + '&type=' + type + '&version=' + charts.versions[versionNumber] + '&number=' + sliderID +'&device=' + charts.devices[versionNumber][sliderID] + '&versionNumber=' + versionNumber + '&min=' + charts.sliderValues[versionNumber][sliderID][min] + '&max=' + charts.sliderValues[versionNumber][sliderID][max]).success(function (data) {
        var object = data[Object.keys(data)];
        var values = object['array'];
        var offset = object['offset'];
        var valueIndex = Object.keys(data)[0];

        var array = [];
        var versionIndex;
        for(var index=0; index<values.length; index++){
            array[index] = values[index]['date'];
            versionIndex = values[index]['versionNumber'];
        }

        $scope.labels[parseInt(versionIndex)][parseInt(valueIndex)] = array;
       // $scope.data[parseInt(versionIndex)] = [];


        charts.tempValues[versionIndex] = [];
        for (var j = 0; j < array.length; j++) {

            charts.tempValues[versionIndex][j] = [];

            $http.get('./php/combined/getValues.php?app=' + charts.appName + '&type=' + type + '&device=' + charts.devices[versionIndex][valueIndex] + '&version=' + charts.versions[versionIndex] + '&number=' + versionIndex + '&number2=' + j + '&date=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];
                var index3 = data[index1]['number3'];

                charts.tempValues[index1][index3][index2] = data[index1]['avg'];
                if (index2 == $scope.labels[index1][index3].length - 1) {
                    $scope.data[parseInt(index1)][index3] = [charts.tempValues[index1][index3]];

                }

            });
        }

    });
}