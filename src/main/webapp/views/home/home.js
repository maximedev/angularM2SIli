(function() {
	'use strict';
	/**
	 * Definition du module placement
	 */
	angular.module('application.home', [ 'ui.router' ])

	/**
	 * Definition de la route
	 */
	.config(['$stateProvider',
			function config($stateProvider) {
				$stateProvider.state('home', {
					url : "/home",
					views : {
						"" : {
							controller : 'homeCtrl',
							templateUrl : '/application/views/home/home.html'
						}
					}
				});
			}])

	/**
	 * La controller pour cette route.
	 */
	.controller('homeCtrl', ['$scope','$state',function homeController($scope,$state) {
		/**
		 * On ajoute des donnée fictive pour les maquettes
		 * 
		 */	
		$scope.calendriers  = [ {
						nom : 'Soutenance M2Sili',
						url : 'url'
					},
					{
						nom : 'Soutenance L3 Info',
						url : 'url'
					},
					 {
						nom : 'Soutenance M1 Info',
						url : 'url'
					} ];
			
		
		
	}]);
})();