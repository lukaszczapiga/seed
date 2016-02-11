define(['/js/services/module.js'], function (services) {
    'use strict';

    services.factory('AuthenticationService', ['$http', 'Session', function ($http, Session) {
        var authService = {};

        authService.login = function (email, password) {
            return $http.post('./api/login', {email: email, password: password});
        };

        authService.logout = function () {
            return $http.get('./api/logout');
        };

        authService.reAuthenticate = function () {
            return $http.get('./api/profile');
        };

        authService.isAuthenticated = function () {
            return !!Session.userId;
        };

        authService.isAuthorised = function (authorisedRoles) {

            if (!angular.isArray(authorisedRoles)) {
                authorisedRoles = [authorisedRoles];
            }

            return (authService.isAuthenticated() && authorisedRoles.indexOf(Session.userRole) !== -1);
        };

        return authService;

    }]);
});