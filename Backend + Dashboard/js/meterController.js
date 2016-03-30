/**
 * Created by stefvangils on 14/11/15.
 */
(function () {
    var app = angular.module('meter', ['chart.js', 'rzModule']);
    app.controller('MeterController', ['$rootScope','$scope', '$http','$timeout', function ($rootScope, $scope, $http, $timeout) {


        var charts = this;
        charts.types = ["test"];
        $scope.labels = [];
        $scope.data = [];
        var app = location.search.split('app=')[1];
        charts.app = decodeURIComponent(app);

        charts.sliderValues = [];

        $rootScope.$on('refreshSlider', function (event,data) {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');

            });
        });

        $scope.slider = [];
        $http.get('../php/getMeterTypes.php?app=' + charts.app).success(function (data) {
            charts.types = data;
            for (var i = 0; i < data.length; i++) {
                $scope.data[i] = [];
                $scope.data[i][0] = [];


                $http.get('../php/getMeterDates.php?app=' + charts.app + '&type=' + data[i] + '&number=' + i).success(function (data) {
                    var object = data[Object.keys(data)];
                    var values = object['array'];
                    var labels = object['labels'];
                    var valueIndex = Object.keys(data)[0];

                    $scope.labels[valueIndex] = values;
                    charts.sliderValues[valueIndex] = labels;
                    var offset = object['offset'];
                    $scope.slider[valueIndex] = {
                        min: 0,
                        max: labels.length - 1,


                        options: {
                            stepsArray: labels.slice(), // equals to ['A', 'B', ... 'Z']
                            onEnd: function (sliderId) {
                                updateMeterChart($scope, valueIndex, charts, $http);
                            }
                        }

                    };


                    for (var j = 0; j < values.length; j++) {

                        $http.get('../php/getMeterValues.php?app=' + charts.app + '&type=' + charts.types[valueIndex] + '&number=' + valueIndex + '&number2=' + j + '&date=' + values[j] + '&offset=' + offset).success(function (data) {

                            var index1 = Object.keys(data)[0];
                            var index2 = data[index1]['number2'];

                            //console.log(data[index1]['avg']);
                            $scope.data[index1][0][index2] = data[index1]['avg'];


                        });
                    }

                });

                //$scope.series = ['Series A', 'Series B'];


            }
        });


    }]);
})(window.angular);

function updateMeterChart($scope, sliderID, chart, $http) {
    var min = $scope.slider[sliderID].min;
    var max = $scope.slider[sliderID].max;


    $scope.labels[sliderID] = [];
    $scope.data[sliderID][0] = [];
    $http.get('../php/getMeterDates.php?app=' + chart.app + '&type=' + chart.types[sliderID] +'&number=' + sliderID +'&min='+ chart.sliderValues[sliderID][min] +'&max=' + chart.sliderValues[sliderID][max]).success(function(data) {
        var object = data[Object.keys(data)];
        var values = object['array'];
        var labels = object['labels'];
        var valueIndex = Object.keys(data)[0];

        $scope.labels[valueIndex] = values;



        for(var j=0; j<values.length; j++){
            $http.get('../php/getMeterValues.php?app=' + chart.app + '&type=' + chart.types[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&date=' + values[j]).success(function(data){
                var index1 = Object.keys(data)[0];
                var index2 = data[index1]['number2'];

                $scope.data[index1][0][index2] = data[index1]['avg'];


            });
        }

    });

}