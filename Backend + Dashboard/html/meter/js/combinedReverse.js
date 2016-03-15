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



        var charts = this;
        charts.appName = appName;
        charts.tempValues = [];
        charts.versions = [];
        charts.devices = [];


        charts.scopeIndex = 0;
        $scope.labels = [];
        charts.sliderValues = [];
        $scope.data = [];
        $scope.slider = [];
        $http.get('./php/combinedReverse/getDevices.php?app=' + appName + '&type=' + type).success(function(data){
            charts.devices = data;

            for(var i =0; i< data.length; i++){
                charts.versions[i] = [];
                charts.tempValues[i] = [];
                $http.get('./php/combinedReverse/getVersions.php?app=' + appName + '&type=' +type +'&device=' + data[i] + '&number=' + charts.scopeIndex).success(function(data){
                    var versions = data[Object.keys(data)];
                    var deviceNumber = Object.keys(data)[0];
                    charts.versions[deviceNumber] = versions;
                    $scope.labels[deviceNumber] =[];
                    charts.sliderValues[deviceNumber] = [];
                    $scope.slider[deviceNumber] = [];
                    for(var k =0; k< versions.length; k++) {
                        charts.tempValues[deviceNumber][k] = [];
                        $http.get('./php/combinedReverse/getDates.php?app=' + appName + '&type=' + type + '&device=' + charts.devices[deviceNumber] + '&number=' + k +'&version=' + versions[k] + '&versionNumber=' + deviceNumber).success(function (data) {

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
                                        updateChartCombinedReverse($scope, valueIndex, versionIndex, type, $http, charts);
                                    }
                                }

                            };

                            charts.tempValues[versionIndex] = [];

                            for (var j = 0; j < array.length; j++) {
                                charts.tempValues[versionIndex][j] = [];

                                $http.get('./php/combinedReverse/getValues.php?app=' + appName + '&type=' + type + '&device=' + charts.devices[versionIndex] + '&version=' + charts.versions[versionIndex][valueIndex] + '&number=' + versionIndex + '&number2=' + j + '&date=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
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


function updateChartCombinedReverse($scope, sliderID, versionNumber, type, $http, charts){

    var min = $scope.slider[versionNumber][sliderID].min;
    var max = $scope.slider[versionNumber][sliderID].max;


    $http.get('./php/combined/getDates.php?app=' + charts.appName + '&type=' + type + '&version=' + charts.versions[versionNumber][sliderID] + '&number=' + sliderID +'&device=' + charts.devices[versionNumber] + '&versionNumber=' + versionNumber + '&min=' + charts.sliderValues[versionNumber][sliderID][min] + '&max=' + charts.sliderValues[versionNumber][sliderID][max]).success(function (data) {
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

            $http.get('./php/combined/getValues.php?app=' + charts.appName + '&type=' + type + '&device=' + charts.devices[versionIndex] + '&version=' + charts.versions[versionIndex][valueIndex] + '&number=' + versionIndex + '&number2=' + j + '&date=' + array[j] + '&offset=' + offset + '&number3=' + valueIndex).success(function (data) {
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