'use strict';
require.config({
    // alias libraries paths
    baseUrl: '/js',
    paths: {
        'domReady': 'libs/requirejs-domready/domReady',
        'jquery': 'libs/jquery/dist/jquery',
        'angular': 'libs/angular/angular',
        'angular-bootstrap': 'libs/angular-bootstrap/ui-bootstrap-tpls',
        'angular-cookies': 'libs/angular-cookies/angular-cookies',
        'angular-messages': 'libs/angular-messages/angular-messages',
        'angular-ui-route': 'libs/angular-ui-router/release/angular-ui-router',
        'ng-idle': 'libs/ng-idle/angular-idle'
    },

    // angular does not support AMD out of the box, put it in a shim
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-route': {
            deps: ['angular']
        },
        'angular-messages': {
            deps: ['angular']
        },
        'angular-cookies': {
            deps: ['angular']
        },
        'ng-idle': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps:['angular']
        }
    },

    // kick start application
    deps: [
        'bootstrap'
    ]
});
