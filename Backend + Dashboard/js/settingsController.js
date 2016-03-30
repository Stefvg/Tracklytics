/**
 * Created by stefvangils on 30/03/16.
 */
(function(){
    var app = angular.module('settings', ['uiSwitch']);
    app.controller('SettingsController', ['$scope','$http', function ($scope, $http) {


        var settings = this;
        settings.enabled = 1;

        var app = location.search.split('app=')[1];
        app = decodeURIComponent(app);

        $http.get('../php/ShouldMonitor.php?app=' + app).success(function(data){
            settings.enabled = parseInt(data);
        });

        $scope.changeCallback = function() {
            var value = settings.enabled ? 1 : 0;
            $http.get('../php/ChangeShouldMonitor.php?app=' + app +'&value=' + value).success(function(data){
            });
        };

    }]);
})(window.angular);