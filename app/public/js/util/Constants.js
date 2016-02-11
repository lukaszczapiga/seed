define(['/js/util/module.js'], function (utilities) {
    'use strict';

    utilities.constant('AUTH_EVENTS',
        {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorised: 'auth-not-authorised'
        }
    ).constant('USER_ROLES',
        {
            all: '*',
            admin: 'admin',
            editor: 'editor',
            guest: 'guest'
        }
    );
});