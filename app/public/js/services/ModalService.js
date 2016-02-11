define(['/js/services/module.js'], function (services) {
    'use strict';

    services.service('LoginModal', function ($uibModal) {
        this.open = function () {
            $uibModal.open({
                templateUrl: './views/loginModal.html',
                controller: 'modalLoginController'
            });
        };
    }).service('WarningModal', function ($uibModal) {
        this.open = function (options) {
            $uibModal.open({
                templateUrl: './views/warningModal.html',
                controller: 'modalWarningController',
                size: 'sm'
            });
        };
    }).service('TimeOutModal', function ($uibModal) {
        this.open = function (options) {
            $uibModal.open({
                templateUrl: './views/timeOutModal.html',
                controller: 'modalTimeOutController'
            });
        };
    });
});