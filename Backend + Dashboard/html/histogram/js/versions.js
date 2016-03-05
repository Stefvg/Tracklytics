/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('versions', ['chart.js', 'rzModule']);


    /* app.directive("counts", function() {
     return {
     restrict: 'E',
     templateUrl: "/angular-extensions/counts.html"
     };
     });*/




    app.controller('VersionController', ['$rootScope', '$timeout', '$scope', '$http', function ($rootScope, $timeout, $scope, $http) {
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        var appName = location.search.split('app=')[1];
        appName = decodeURIComponent(appName);

        $rootScope.$on('refreshSlider', function (event,data) {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        });

        var versionController = this;
        versionController.tempValues = [];
        versionController.versions = [];

        $scope.labels = [];
        $scope.data = [];
        $scope.slider =[];

        $http.get('./php/versions/getVersions.php?app=' + appName + '&type=' + type).success(function(data){
            versionController.versions = data;

            for(var i =0; i< data.length; i++){
                $scope.labels[i] = [];
                versionController.tempValues[i] = [];
                $http.get('./php/versions/getValues.php?app=' + appName + '&type=' +type +'&version=' + data[i] +'&number=' + i).success(function(data){
                    var object = data[Object.keys(data)];
                    var values = object['array'];
                    var offset = object['offset'];
                    var valueIndex = Object.keys(data)[0];


                    var version = versionController.versions[valueIndex];
                    $scope.labels[valueIndex] = values;

                    $scope.slider[valueIndex] = {
                        min: values[0],
                        max: values[values.length - 1],
                        options: {
                            floor: values[0],
                            ceil: values[values.length - 1],
                            step: offset,
                            onEnd: function(sliderId) {
                                console.log("sliderid: " +sliderId);
                                console.log("version: " +version);
                                updateChartVersions($scope, valueIndex, versionController, $http, version, type);
                            }
                        }

                    };
                    for(var j=0; j<values.length; j++){

                        $http.get('./php/versions/getNumberOfValues.php?app=' + appName + '&type=' +type + '&version=' + versionController.versions[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&value=' + values[j] +'&offset=' + offset).success(function(data){
                            var index1 = Object.keys(data)[0];
                            var index2 = data[index1]['number2'];
                            versionController.tempValues[index1][index2] = data[index1]['count'];
                            if(index2==$scope.labels[index1].length-1){

                                $scope.data[index1] = [versionController.tempValues[index1]];
                            }

                        });
                    }

                });

                //$scope.series = ['Series A', 'Series B'];



            }
        });

    }]);

})();


function updateChartVersions($scope, sliderID, versionController, $http, version, type) {
    var min = $scope.slider[sliderID].min;
    var max = $scope.slider[sliderID].max;
    var appName = location.search.split('app=')[1];
    appName = decodeURIComponent(appName);

    console.log("version2" +version);
    $http.get('./php/versions/getValues.php?app=' + appName + '&type=' +type +'&version=' + version +'&number=' + sliderID + '&min='+ min +'&max=' + max).success(function(data){
        var object = data[Object.keys(data)];
        var values = object['array'];
        var offset = object['offset'];
        var valueIndex = Object.keys(data)[0];

        console.log(values);
        $scope.labels[valueIndex] = values;

        for(var j=0; j<values.length; j++){

            $http.get('./php/versions/getNumberOfValues.php?app=' + appName + '&type=' +type + '&version=' + versionController.versions[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&value=' + values[j] + '&offset=' + offset).success(function(data){
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];
                versionController.tempValues[index1][index2] = data[index1]['count'];
                if(index2==$scope.labels[index1].length-1){

                    $scope.data[index1] = [versionController.tempValues[index1]];
                }

            });
        }

    });


}