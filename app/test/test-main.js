var tests = [];
for (var file in window.__karma__.files) {
    if (window.__karma__.files.hasOwnProperty(file)) {
        if (/\.spec\.js$/.test(file)) {
            tests.push(file);
        }
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/public/js/',

    paths: {
        'jquery': 'libs/jquery/dist/jquery',
        'angular': 'libs/angular/angular',
        'angular-bootstrap': 'libs/angular-bootstrap/ui-bootstrap-tpls',
        'angular-cookies': 'libs/angular-cookies/angular-cookies',
        'angular-messages': 'libs/angular-messages/angular-messages',
        'angular-ui-route': 'libs/angular-ui-router/release/angular-ui-router',
        'ng-idle': 'libs/ng-idle/angular-idle'
    },

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

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});