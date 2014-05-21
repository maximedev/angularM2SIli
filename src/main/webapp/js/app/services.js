(function() {
	
'use strict';

angular.module('auth', ['ngResource']).
        factory('authService', function ($resource) {
            return $resource('rest/auth/:id', {}, {
                'GET': {method:'GET'}
            });
        });

})();