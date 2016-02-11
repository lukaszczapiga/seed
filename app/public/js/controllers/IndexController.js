define(['/js/controllers/module.js'], function (controllers) {
    'use strict';

    controllers.controller('indexCtrl', function ($rootScope, $scope, $location, USER_ROLES, AuthenticationService, LoginModal) {
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorised = AuthenticationService.isAuthorised;


        $scope.loginModal = function () {
            LoginModal.open();
        };

        $scope.isActive = function (viewLocation) {
            return $location.path().indexOf(viewLocation) == 0;
        };

    });
});