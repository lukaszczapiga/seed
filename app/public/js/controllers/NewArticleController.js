define(['/js/controllers/module.js'], function (controllers) {
    'use strict';

    controllers.controller('newArticleCtrl', function ($scope, $state, Article) {
        $scope.title = '';
        $scope.content = '';
        $scope.tags = '';

        $scope.create = function () {
            var data = {
                title: $scope.title,
                content: $scope.content,
                tags: $scope.tags
            };

            Article.create(data).then(function (response) {
                // this callback will be called asynchronously
                // when the response is available
                if (response.data.success) {
                    $state.go('^', {}, {reload: true});
                } else {

                }
            }, function () {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };


    });
});
