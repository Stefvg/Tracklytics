/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('thesis', []);

    app.directive("buttons", function() {
        return {
            restrict: 'E',
            templateUrl: "/angular-extensions/buttons.html"
        };
    });

    app.controller("ButtonController", ['$http', function($http) {
        var button = this;
        this.apps = ["test"];

        $http.get('../php/getApps.php').success(function(data){

            button.apps = data;
            console.log(this.apps.length);
        });

    }]);




})();

function getURL($app){
    return "https://svg-apache.iminds-security.be/dashboard.html?app=" + $app;
}

