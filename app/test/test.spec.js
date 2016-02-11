define(['app'], function(app) {

    describe('test controller', function() {
        var $scope, mainCtrl;
        beforeEach(module('app'));
        beforeEach(inject(function($rootScope, $controller){
            $scope = $rootScope.$new();
            mainCtrl = $controller('mainCtrl', {$scope: $scope});
        }));

        it('$scope.tagline', function(){
            expect($scope.tagline).toEqual('Articles!');
        });
    });
});