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

        versionController.type = type;
        versionController.appName = appName;

        versionController.versions = [];

        versionController.sliderValues = [];
        $scope.labels = [];
        $scope.data = [];
        $scope.slider =[];

        $http.get('./php/versions/getVersions.php?app=' + appName + '&type=' + type).success(function(data){
            versionController.versions = data;

            for(var i =0; i< data.length; i++){
                $scope.data[i] = [];
                $scope.data[i][0] = [];
                $scope.labels[i] = [];
                $http.get('./php/versions/getDates.php?app=' + appName + '&type=' +type +'&version=' + data[i] +'&number=' + i).success(function(data){
                    var object = data[Object.keys(data)];
                    var values = object['array'];
                    var labels = object['labels'];
                    var offset = object['offset'];
                    var valueIndex = Object.keys(data)[0];


                    var version = versionController.versions[valueIndex];
                    $scope.labels[valueIndex] = values;
                    versionController.sliderValues[valueIndex] = labels;

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
                                updateChartVersions($scope, valueIndex, versionController, $http, version, versionController.type);
                }
                        }

                    };
                    for(var j=0; j<values.length; j++){

                        $http.get('./php/versions/getValues.php?app=' + appName + '&type=' +type + '&version=' + versionController.versions[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&date=' + values[j]).success(function(data){
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


function updateChartVersions($scope, sliderID, versionController, $http, version, type) {
    var min = $scope.slider[sliderID].min;
    var max = $scope.slider[sliderID].max;

    $http.get('./php/versions/getValues.php?app=' + versionController.appName + '&type=' + versionController.type +'&version=' + version +'&number=' + sliderID + '&min='+ versionController.sliderValues[sliderID][min] +'&max=' + versionController.sliderValues[sliderID][max]).success(function(data){
        var object = data[Object.keys(data)];
        var values = object['array'];
        var valueIndex = Object.keys(data)[0];

        $scope.labels[valueIndex] = values;

        for(var j=0; j<values.length; j++){

            $http.get('./php/versions/getNumberOfValues.php?app=' + versionController.appName + '&type=' + versionController.type + '&version=' + versionController.versions[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&value=' + values[j]).success(function(data){
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];

                $scope.data[index1][0][index2] = data[index1]['avg'];

            });
        }

    });


}