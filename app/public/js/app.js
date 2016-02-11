define([
    'angular',
    'angular-ui-route',
    'ng-idle',
    'angular-bootstrap',
    'angular-messages',
    './controllers/index',
    './services/index',
    './util/index'
], function (angular) {
    'use strict';

    return angular.module('app', [
        'app.controllers',
        'app.services',
        'app.utilities',
        'ui.router',
        'ngIdle',
        'ui.bootstrap',
        'ngMessages'
    ]);
});