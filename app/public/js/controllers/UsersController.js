define(['/js/controllers/module.js'], function (controllers) {
    'use strict';

    controllers.controller('usersCtrl', function ($scope, User) {
        $scope.delete = function (id) {
            User.delete(id).then(function (response) {
                // this callback will be called asynchronously
                // when the response is available
                if (response.data.success) {
                    $scope.getAllUsers();
                }
            }, function () {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };

        $scope.getAllUsers = function () {
            User.get().then(function (response) {
                // this callback will be called asynchronously
                // when the response is available
                $scope.users = response.data.users;
            }, function () {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };
        $scope.getAllUsers();
    });
});