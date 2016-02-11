define(['/js/controllers/module.js'], function (controllers) {
    'use strict';
    controllers.controller('articleCtrl', function ($scope, $rootScope, Article, $stateParams, AUTH_EVENTS) {
        $scope.id = $stateParams.articleId;
        $scope.article = {};
        $scope.comments = [];

        $scope.create = function (){
            var commentData = {
                id: $scope.id,
                commentBody: $scope.commentBody
            };
            Article.comment(commentData).then(function(response) {
                if(response.data.success){
                    $scope.comment = response.data.comment;
                } else {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorised);
                }
            }, function (err) {
               console.log(err);
            });
        };

        Article.getOne($scope.id).then(function(response) {
            if(response.data.success){
                $scope.article = response.data.article;
                $scope.comments = response.data.comments;
            }
        }, function (err) {
            console.log(err);
        });
    });
});
