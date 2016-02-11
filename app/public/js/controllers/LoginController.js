define(['/js/controllers/module.js'], function (controllers) {
    'use strict';
    controllers.controller('loginCtrl', ['$scope', '$rootScope', 'AUTH_EVENTS', 'Session', 'AuthenticationService',
        function ($scope, $rootScope, AUTH_EVENTS, Session, AuthenticationService) {
            $scope.email = '';
            $scope.password = '';
            $scope.isLoggedIn = false;
            $scope.user = 'Mock admin';
            $scope.message = {};
            $scope.messageType = '';

            $scope.login = function () {
                AuthenticationService.login($scope.email, $scope.password).then(function (response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    if (response.data.success) {
                        Session.create(response.data.id, response.data.user.id, response.data.user.role);
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                        $rootScope.currentUser = response.data.user;
                    } else {
                        $scope.message.text = response.data.message.content[0];
                        $scope.message.type = response.data.message.type;
                        if ($scope.message.type === 'loginMessageEmail') {
                            $scope.loginForm.email.$error = {'loginMessageEmail': true};
                            $scope.loginForm.email.$invalid = {'loginMessageEmail': true};
                        }

                        if ($scope.message.type === 'loginMessagePassword') {
                            $scope.loginForm.password.$error = {'loginMessagePassword': true};
                            $scope.loginForm.password.$invalid = {'loginMessagePassword': true};
                        }

                    }
                }, function () {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                    Session.destroy();
                    $rootScope.currentUser = false;
                });
            };

            $scope.logout = function () {
                AuthenticationService.logout().then(function (response) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
                    Session.destroy();
                    $rootScope.currentUser = false;
                }, function (response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    //TODO implement an error for logout server failure
                });
            };
        }
    ]);
});
