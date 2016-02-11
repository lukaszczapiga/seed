define(['/js/controllers/module.js'], function (controllers) {
    'use strict';
    controllers.controller('mainCtrl', function ($scope, Article) {

        $scope.currentPage = 1;
        $scope.pageSize = 4;

        $scope.articles = [];

        $scope.tagline = 'Articles!';

        var setPage = function(page, limit){
            Article.getPage(page, limit).then(function(response){
                if (response.data.success) {
                    $scope.articles = response.data.articles;
                    $scope.currentPage = response.data.page;
                    $scope.pageSize = parseInt(response.data.limit);
                    $scope.noPages = response.data.pages;
                    $scope.totalItems = response.data.total;
                } else {

                }
            }, function() {

            });
        };
        $scope.pageChanged = function (){
            setPage($scope.currentPage,$scope.pageSize);
        };
        $scope.$watch('pageSize',function(newValue, oldValue){
            if ( newValue !== oldValue ) {
                setPage($scope.currentPage, newValue);
            }
        });
        setPage($scope.currentPage,$scope.pageSize);
    });
});