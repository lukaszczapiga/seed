define(['/js/services/module.js'], function (services) {
    'use strict';

    services.factory('Article', ['$http', function($http) {
        var article = {};

        article.getAll = function() {
            return $http.get('/api/articles');
        };

        article.getPage = function(page, limit) {
            return $http.get('/api/articles/page/'+ page + '/' + limit);
        };

        article.getOne = function(id) {
            return $http.get('/api/articles/' + id);
        };

        article.create = function(articleData) {
            return $http.post('/api/articles', articleData);
        };

        article.delete =function(id) {
            return $http.delete('/api/articles/' + id);
        };

        article.comment = function(commentData) {
            return $http.post('/api/articles/comment', commentData);
        };

        article.update = function(id, articleData) {
            return $http.put('/api/articles/' + id ,articleData);
        };

        return article;
    }]);
});