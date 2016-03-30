/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('thesis', ['counter', 'timer', 'gauge', 'histogram', 'meter', 'settings']);



    app.controller("MainController", ['$rootScope', function($rootScope) {
        this.refreshSlider = (function (){
            $rootScope.$broadcast('refreshSlider', [1,2,3,4,5]);
            $rootScope.$emit('refreshSlider', [1,2,3,4,5]);
        });
    }]);
    app.directive("counts", function() {
        return {
            restrict: 'E',
            templateUrl: "/angular-extensions/counts.html"
        };
    });

    app.directive("timers", function() {
        return {
            restrict: 'E',
            templateUrl: "/angular-extensions/timers.html"
        };
    });

    app.directive("meters", function() {
        return {
            restrict:"E",
            templateUrl: "/angular-extensions/meters.html"
        };
    });

    app.directive("gauges", function() {
        return {
            restrict:"E",
            templateUrl: "/angular-extensions/gauges.html"
        };
    });

    app.directive("histogram", function() {
        return {
            restrict:"E",
            templateUrl: "/angular-extensions/histogram.html"
        };
    });
    app.directive("settings", function() {
        return {
            restrict:"E",
            templateUrl: "/angular-extensions/settings.html"
        };
    });

    app.directive("tabs", function() {
        return {
            restrict: "E",
            templateUrl: "tabs.html",
            controller: function($scope) {
                this.tab = 1;

                this.isSet = function(checkTab) {
                    return this.tab === checkTab;
                };

                this.setTab = function(activeTab) {
                    this.tab = activeTab;
                };
            },
            controllerAs: "tab"
        };
    });

})();


/*        var chart = this;
 $http.get('../php/getCountTypes.php').success(data){
 chart.types = data;
 console.log(data);
 }
        */