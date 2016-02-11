define(['/js/controllers/module.js'], function (controllers) {
    'use strict';

    controllers.controller('modalLoginController', function ($scope, $rootScope, $uibModalInstance) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $rootScope.$on('auth-login-success', function (event, next) {
            $scope.cancel();
        });
    });

    controllers.controller('modalWarningController', function ($scope, $rootScope, $uibModalInstance, $state, Idle, Keepalive) {


        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.resumeSession = function () {
            $scope.cancel();
        };

        $rootScope.$on('auth-logout-success', function (event, next) {
            $scope.cancel();
            $state.go('home');
        });
    });

    controllers.controller('modalTimeOutController', function ($scope, $rootScope, $uibModalInstance) {

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    });
});