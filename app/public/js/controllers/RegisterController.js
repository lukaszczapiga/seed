define(['/js/controllers/module.js'], function (controllers) {
    'use strict';

    controllers.controller('registerCtrl', ['$scope', '$rootScope', '$state', 'AUTH_EVENTS', 'Session', 'User',
        function ($scope, $rootScope, $state, AUTH_EVENTS, Session, User) {
            $scope.name = '';
            $scope.email = '';
            $scope.password = '';
            $scope.message = {};
            $scope.messageType = '';
            $scope.isLoggedIn = false;
            $scope.user = 'Mock admin';

            $scope.register = function () {
                var userData = {
                    name: $scope.name,
                    email: $scope.email,
                    password: $scope.password
                };

                User.create(userData).then(function (response) {

                    if (response.data.success) {
                        Session.create(response.data.id, response.data.user.id, response.data.user.role);
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $state.go('home');
                        $rootScope.currentUser = response.data.user;
                    } else {
                        $scope.message.text = response.data.message[0];
                        $scope.message.type = 'server';
                        $scope.registerForm.email.$error = {'server': true};
                        $scope.registerForm.email.$invalid = {'server': true};
                    }
                }, function () {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    Session.destroy();
                    $rootScope.currentUser = false;
                });
            };

        }]
    );
});