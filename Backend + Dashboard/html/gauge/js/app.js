

/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('GaugeDetail', ['mean', 'median', 'highest', 'lowest']);

    app.controller("AppController", [function(){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        this.title = "Gauge - " + type;

    }]);

    app.directive("mean", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/mean.html"
        };
    });
    app.directive("median", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/median.html"
        };
    });

    app.directive("highest", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/highest.html"
        };
    });

    app.directive("lowest", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/lowest.html"
        };
    });

    app.directive("tabs", function() {
        return {
            restrict: "E",
            templateUrl: "./tabs.html",
            controller: function() {
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