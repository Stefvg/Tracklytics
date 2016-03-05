

/**
 * Created by stefvangils on 14/11/15.
 */
(function(){
    var app = angular.module('TimerDetail', ['connection', 'device', 'version', 'devcon', 'vercon', 'verdev', 'combined']);


    app.controller("AppController", [function(){
        var type = location.search.split('type=')[1];
        type = decodeURIComponent(type);
        this.title = "Timer - " + type;

    }]);

    app.directive("connection", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/connection.html"
        };
    });
    app.directive("device", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/device.html"
        };
    });

    app.directive("version", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/version.html"
        };
    });

    app.directive("devcon", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/devcon.html"
        };
    });

    app.directive("verdev", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/verdev.html"
        };
    });

    app.directive("vercon", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/vercon.html"
        };
    });

    app.directive("combined", function() {
        return {
            restrict: 'E',
            templateUrl: "./extensions/combined.html"
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