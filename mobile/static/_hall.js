var adminApp = angular.module('adminApp', ['ngAnimate']);

adminApp.config(function($interpolateProvider) {
    common.initAngular($interpolateProvider);
});


adminApp.controller('adminController', function () {
	$scope.slots = [];
});