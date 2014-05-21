(function() {
	'use strict';
	/**
	 * Definition du module placement
	 */
	angular.module('application.login', [ 'ui.router' ])

	/**
	 * Definition de la route
	 */
	.config(['$stateProvider',
			function config($stateProvider) {
				$stateProvider.state('login', {
					url : "/login",
					views : {
						"" : {
							controller : 'loginCtrl',
							templateUrl : '/application/views/login/login.html'
						}
					}
				});
			}])

	/**
	 * La controller pour cette route.
	 */
	.controller('loginCtrl', ['$scope','$state',function loginController($scope,$state) {
		
		$scope.verifier = function(){
			if($scope.password == "test" && $scope.login == "toto"){
				$state.go('calendar');
			}else{
				$scope.value =	"Mauvais login ou mot de passe" ;
			}
		};
		
	}]);
})();