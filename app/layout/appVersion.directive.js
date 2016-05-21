(function() {
	'use strict';

	angular.module('app.layout').directive('appVersion', appVersion);

	function appVersion() {
		return {
			restrict: 'E',
			template: '<span>Snaga Team v{{ "%VERSION%" | interpolate  }}</span>'
		};


	}
})();
