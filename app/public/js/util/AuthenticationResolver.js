define(['/js/util/module.js'], function (utilities) {
    'use strict';

    utilities.factory('AuthResolver', function ($q, $rootScope, $state, AUTH_EVENTS, USER_ROLES, AuthenticationService) {
        return {
            resolve: function (authorisedRoles) {
                var deferred = $q.defer();
                var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
                    if (angular.isDefined(currentUser)) {
                        if (currentUser) {
                            if(authorisedRoles.indexOf(USER_ROLES.all) === -1) {
                                if (!AuthenticationService.isAuthorised(authorisedRoles)) {
                                    if (AuthenticationService.isAuthenticated()) {
                                        // user is not allowed
                                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorised);
                                        deferred.reject();
                                        $state.go('home');
                                    } else {
                                        // user is not logged in
                                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                                        deferred.reject();
                                    }
                                } else {
                                    deferred.resolve(currentUser);
                                }
                            } else {
                                deferred.resolve(currentUser);
                            }
                        } else {
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                            deferred.reject();
                            $state.go('home');
                        }
                        unwatch();
                    }
                });
                return deferred.promise;
            }
        };
    });
});