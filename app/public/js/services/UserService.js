define(['/js/services/module.js'], function (services) {
    'use strict';

    services.factory('User', ['$http', function ($http) {
        var user = {};

        user.get = function () {
            return $http.get('/api/users');
        };

        user.create = function (userData) {
            return $http.post('/api/users', userData);
        };

        user.delete = function (id) {
            return $http.delete('/api/users/' + id);
        };

        return user;
    }]);
});