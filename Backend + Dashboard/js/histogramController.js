/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('histogram', ['chart.js', 'rzModule']);
    app.controller('HistogramController', ['$rootScope', '$scope', '$http','$timeout', function ($rootScope, $scope, $http, $timeout) {
        var hist = this;
        hist.types = [];
        $scope.labels = [];
        $scope.data = [];
        hist.tempValues = [];
        var app = location.search.split('app=')[1];
        hist.app = decodeURIComponent(app);

        $rootScope.$on('refreshSlider', function (event,data) {
            $timeout(function () {
                $scope.$broadcast('rzSliderForceRender');
            });
        });



        $scope.slider =[];

        $http.get('../php/getHistogramTypes.php?app=' + hist.app).success(function(data){
            hist.types = data;
            for(var i =0; i< data.length; i++){



                $http.get('../php/getHistogramValues.php?app=' + hist.app + '&type=' + data[i] +'&number=' + i).success(function(data){
                    var object = data[Object.keys(data)];
                    var values = object['array'];
                    var valueIndex = Object.keys(data)[0];


                    $scope.labels[valueIndex] = values;

                    var offset = object['offset'];
                    $scope.slider[valueIndex] = {
                        min: values[0],
                        max: values[values.length - 1],
                        options: {
                            floor: values[0],
                            ceil: values[values.length - 1],
                            onEnd: function(sliderId) {
                                updateChart($scope, valueIndex, hist, $http);
                            }
                        }

                    };

                    for(var j=0; j<values.length; j++){
                        $http.get('../php/getHistogramNumberOfValues.php?app=' + hist.app + '&type=' + hist.types[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&value=' + values[j] + '&offset=' + offset).success(function(data){
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
        });


    }]);
})();


function updateChart($scope, sliderID, hist, $http) {
        var min = $scope.slider[sliderID].min;
        var max = $scope.slider[sliderID].max;

        $http.get('../php/getHistogramValues.php?app=' + hist.app + '&type=' + hist.types[sliderID] +'&number=' + sliderID +'&min='+ min +'&max=' + max).success(function(data){
            var object = data[Object.keys(data)];
            var values = object['array'];
            var valueIndex = Object.keys(data)[0];


            $scope.labels[valueIndex] = values;

            var offset = object['offset'];

                for(var j=0; j<values.length; j++){
                    $http.get('../php/getHistogramNumberOfValues.php?app=' + hist.app + '&type=' + hist.types[valueIndex] +'&number=' + valueIndex + '&number2=' +j +'&value=' + values[j] +'&offset=' + offset).success(function(data){
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