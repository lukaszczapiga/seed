/**
 * bootstraps angular onto the window.document node
 */
define([
    'require',
    'angular',
    'app',
    'routes'
], function (require, angular, app) {
    'use strict';

    app.run(function ($rootScope, $state, AUTH_EVENTS, USER_ROLES, Session, AuthenticationService, Idle, WarningModal, TimeOutModal) {


        AuthenticationService.reAuthenticate().then(function (response) {
            if(response.data.success)
            {
                Session.create(response.data.id, response.data.user.id, response.data.user.role);
                $rootScope.currentUser = response.data.user;
                Idle.watch();
            } else {
                Session.destroy();
                $rootScope.currentUser = false;
                //$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }, function () {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            Session.destroy();
            $rootScope.currentUser = false;
        });

        //if (angular.isDefined($rootScope.currentUser) && $rootScope.currentUser)



        $rootScope.$on('IdleStart', function() {
            WarningModal.open();
        });


        $rootScope.$on('IdleTimeout', function() {
            // the user has timed out (meaning idleDuration + timeout has passed without any activity)
            // this is where you'd log them
            AuthenticationService.logout().then(function (response) {
                // this callback will be called asynchronously
                // when the response is available
                $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                Session.destroy();
                $rootScope.currentUser = false;
                TimeOutModal.open();
            }, function (response) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                //TODO implement an error for logout server failure
            });
        });


        $rootScope.$on('auth-not-authenticated', function (event, next) {
            $rootScope.currentUser = false;
            alert("not authenticated");
        });

        $rootScope.$on('auth-not-authorised', function (event, next) {
            alert("not authorised");
        });

        $rootScope.$on('auth-logout-success', function (event, next) {
            Idle.unwatch();
            $state.go('home');
        });

        $rootScope.$on('auth-login-success', function (event, next) {
            Idle.watch();
        });

    });

    require(['domReady!'], function (document) {
        angular.bootstrap(document, ['app']);
    });
});