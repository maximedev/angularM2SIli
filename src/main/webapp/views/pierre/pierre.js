(function() {
	'use strict';
	/**
	 * Definition du module placement
	 */
	angular.module('application.pierre', [ 'ui.router' ])

	/**
	 * Definition de la route
	 */
	.config(['$stateProvider',
			function config($stateProvider) {
				$stateProvider.state('pierre', {
					url : "/pierre",
					views : {
						"" : {
							controller : 'pierreCtrl',
							templateUrl : '/application/views/pierre/pierre.html'
						}
					}
				});
			}])

	/**
	 * La controller pour cette route.
	 */
	.controller('pierreCtrl', ['$scope','$state',function pierreController($scope,$state) {
		
		
	}]);
})();