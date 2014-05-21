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
	.controller('loginCtrl', ['$scope','$state','$http',function loginController($scope,$state,$http) {
		
		
		$scope.verifier = function(){
			/*if($scope.password == "test" && $scope.login == "toto"){
				$state.go('home');
			}else{
				$scope.value =	"Mauvais login ou mot de passe" ;
			}*/
			
		//$scope.value = authService.query() ;

		//$scope.value = authService.get();
			
			$http.post('/auth/4587', 'test', {
				
			
			}).
			success(function(data, status, headers, config) {
				alert('toto');
			}).
			error(function(data, status, headers, config){
				alert('erreur');
			});
			
			
		};
		
	}]);
})();