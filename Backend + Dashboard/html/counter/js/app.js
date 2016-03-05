

/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('CounterDetail', ['devices', 'versions', 'combined', 'combinedReverse']);

    app.controller("AppController", [function(){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        this.title = "Counter - " + type;

    }]);
    app.directive("devices", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/devices.html"
        };
    });
    app.directive("versions", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/versions.html"
        };
    });

    app.directive("combined", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/combined.html"
        };
    });

    app.directive("combinedReverse", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/combinedReverse.html"
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