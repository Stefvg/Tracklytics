/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('gauge', []);
    app.controller('GaugeController', ['$http', function ($http) {
        var gauge = this;
        gauge.labels = [];
        gauge.objects = [];
        var app = location.search.split('app=')[1];
        gauge.app = decodeURIComponent(app);

        $http.get('../php/getGaugeTypes.php?app=' + gauge.app).success(function(data){
            gauge.labels = data;
            for(var i=0; i<data.length; i++){
                $http.get('../php/getGaugeData.php?app=' + gauge.app + '&type=' + data[i] +"&number=" +i).success(function(data){
                    gauge.objects[Object.keys(data)[0]] = data[Object.keys(data)];
                });
            }

        });


    }]);
})();