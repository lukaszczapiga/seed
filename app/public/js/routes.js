define(['app'], function (app) {
    'use strict';

    return app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'USER_ROLES', 'IdleProvider', 'KeepaliveProvider',
            function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, USER_ROLES, IdleProvider, KeepaliveProvider) {

                // For any unmatched url, redirect to /state1
                $urlRouterProvider.otherwise('/home');

                // Now set up the states
                $stateProvider
                    .state('home', {
                        url: '/home',
                        templateUrl: 'views/home.html',
                        controller: 'mainCtrl'
                    })
                    .state('register', {
                        url: '/register',
                        templateUrl: 'views/register.html',
                        controller: 'registerCtrl'
                        //authorisedRoles: [USER_ROLES.all]
                    })
                    .state('article', {
                        url: '/article/:articleId',
                        templateUrl: 'views/article.html',
                        controller: 'articleCtrl'
                    })
                    .state('profile', {
                        url: '/profile',
                        templateUrl: 'views/profile.html',
                        controller: 'profileCtrl',
                        //authorisedRoles: [USER_ROLES.editor, USER_ROLES.admin],
                        resolve: {
                            auth: function resolveAuthentication(AuthResolver) {
                                return AuthResolver.resolve([USER_ROLES.editor, USER_ROLES.admin]);
                            }
                        }
                    })
                    .state('admin', {
                        url: '/admin',
                        templateUrl: 'views/admin.html',
                        controller: 'adminCtrl',
                        //authorisedRoles: [USER_ROLES.admin],
                        resolve: {
                            auth: function resolveAuthentication(AuthResolver) {
                                return AuthResolver.resolve([USER_ROLES.admin]);
                            }
                        }
                    }).state('admin.articles',{
                        url:'/articles',
                        templateUrl: 'views/articles.html',
                        controller: 'articlesCtrl'
                    }).state('admin.articles.new-article',{
                        url:'/new-article',
                        templateUrl: 'views/newArticle.html',
                        controller: 'newArticleCtrl'
                    }).state('admin.users',{
                        url:'/users',
                        templateUrl: 'views/users.html',
                        controller: 'usersCtrl'
                    });

                $locationProvider.html5Mode(true);

                $httpProvider.interceptors.push([
                    '$injector',
                    function ($injector) {
                        return $injector.get('AuthInterceptor');
                    }]);

                // configure Idle settings
                /*IdleProvider.idle(780); // 13 min in seconds*/
                /*IdleProvider.timeout(120); // 2 min in seconds*/
                /*KeepaliveProvider.interval(600); // 10 min in seconds*/

                IdleProvider.idle(13*60); // 13 min in seconds
                IdleProvider.timeout(60); // 1 min in seconds
                KeepaliveProvider.interval(5*60); // 13.2 min in seconds
                KeepaliveProvider.http("/api/keep-alive");
            }]
    );
});