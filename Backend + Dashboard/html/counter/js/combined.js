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

    app.controller('CombinedController', ['$scope', '$http', function ($scope, $http) {
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        var hist = this;
        hist.tempValues = [];
        hist.versions = [];
        hist.devices = [];

        hist.scopeIndex = 0;
        $scope.labels = [];
        $scope.data = [];
        $http.get('./php/combined/getVersions.php?app=' + appName + '&type=' + type).success(function(data){
            hist.versions = data;

            for(var i =0; i< data.length; i++){
                hist.devices[i] = [];
                $http.get('./php/combined/getDevices.php?app=' + appName + '&type=' +type +'&version=' + data[i] + '&number=' + hist.scopeIndex).success(function(data){
                    var devices = data[Object.keys(data)];
                    var versionNumber = Object.keys(data)[0];
                    hist.devices[versionNumber] = devices;
                    $scope.labels[versionNumber] =[];
                    for(var k =0; k< devices.length; k++) {

                        $http.get('./php/combined/getNames.php?app=' + appName + '&type=' + type + '&version=' + hist.versions[versionNumber] + '&number=' + k +'&device=' + devices[k] + '&versionNumber=' + versionNumber).success(function (data) {
                            var names = data[Object.keys(data)];
                            var nameIndex = Object.keys(data)[0];


                            var array = [];
                            var versionIndex;
                            for(var index=0; index<names.length; index++){
                                array[index] = names[index]['name'];
                                versionIndex = names[index]['versionNumber'];
                            }

                            $scope.labels[parseInt(versionIndex)][parseInt(nameIndex)] = array;
                            $scope.data[parseInt(versionIndex)] = [];
                            hist.tempValues[versionIndex] = [];
                            for (var j = 0; j < array.length; j++) {

                                hist.tempValues[versionIndex][j] = [];

                                $http.get('./php/combined/getNumberOfValues.php?app=' + appName + '&type=' + type + '&device=' + hist.devices[versionIndex][nameIndex] + '&version=' + hist.versions[versionIndex] + '&number=' + versionIndex + '&number2=' + j + '&name=' + array[j] + '&number3=' + nameIndex).success(function (data) {
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