/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('counter', ['chart.js']);
    app.controller('ChartController', ['$scope', '$http', function ($scope, $http) {



        var charts = this;
        charts.types = [];
        $scope.labels = [];
        $scope.data = [];
        var app = location.search.split('app=')[1];
        charts.app = decodeURIComponent(app);




        $http.get('../php/getCountTypes.php?app=' + app).success(function(data){
            charts.types = data;
            for(var i =0; i< data.length; i++){

                $http.get('../php/getCountNames.php?app=' + charts.app + '&type=' + data[i] +'&number=' + i).success(function(data){
                    $scope.labels[data['number']] = data['array'];
                });

                //$scope.series = ['Series A', 'Series B'];


                $http.get('../php/getCountValues.php?app=' + charts.app + '&type=' + data[i] +'&number=' + i).success(function(data){
                    $scope.data[data['number']] = [data['array']];
                });
            }
        });


    }]);
})(window.angular);