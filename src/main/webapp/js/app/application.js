(function() {
'use strict';

var app = angular.module('application', ['ui.router','application.login','application.calendar']);
	app.run(['$rootScope',function($rootScope) {}])

		/*
		 * Configuration de l'application Definition de routes avec
		 * ui-router
		 */
		.config(['$urlRouterProvider','$stateProvider',
		         function($urlRouterProvider, $stateProvider) {
			
			  $urlRouterProvider.otherwise("/login");
			
		}])

		/*
		 * Controller principal de l'application
		 */
		.controller(
				'AppController',['$state','$rootScope',
						function AppController($state,$rootScope) {
					 $rootScope.$state = $state;
					
					 //$state.go('accueil');
					 
				}])

})();