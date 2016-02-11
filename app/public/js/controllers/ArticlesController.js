define(['/js/controllers/module.js'], function (controllers) {
    'use strict';
    controllers.controller('articlesCtrl', function ($scope, Article) {

        $scope.articles = [];

        $scope.delete = function(id) {
            Article.delete(id).then(function (response) {
                // this callback will be called asynchronously
                // when the response is available
                if (response.data.success) {
                    $scope.getAllArticles();
                }
            }, function () {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });
        };

        $scope.getAllArticles = function () {
            Article.getAll().then(function(response){
                if (response.data.success) {
                    $scope.articles = response.data.articles;
                } else {

                }
            }, function() {

            });
        };
        $scope.getAllArticles();
    });
});