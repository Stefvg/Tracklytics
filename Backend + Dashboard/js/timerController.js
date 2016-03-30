/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('timer', []);
    app.controller('TimerController', ['$http', function ($http) {
        var timer = this;
        timer.timers = [];
        timer.objects = [];
        var app = location.search.split('app=')[1];
        timer.app = decodeURIComponent(app);

        var test = new Array();
        $http.get('../php/getTimerTypes.php?app=' + timer.app).success(function(data){
            timer.timers = data;
            for(var i=0; i<data.length; i++){
                $http.get('../php/getTimerData.php?app=' + timer.app + '&type=' + data[i] +"&number=" +i).success(function(data){
                    timer.objects[Object.keys(data)[0]] = data[Object.keys(data)];
                });
            }

        });


    }]);
})();