(function() {
	'use strict';

	angular.module('app').config(['$stateProvider', '$locationProvider', '$urlRouterProvider',
	 function appConfig($stateProvider, $locationProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/events');

		var getProfileRes = ['UserAccess', '$stateParams', '$q', 'currentUser', getProfileData];
		var getCurrentUserRes = ['UserAccess', '$window', '$rootScope', '$q', '$state', fetchCurrentUser];

		$stateProvider.state('wrapper', {
			templateUrl: 'app/layout/default.layout.tpl.html'
		})
		.state('login', {
			url: '/login',
			views: {
				'mainView': {
					templateUrl: 'app/core/login.tpl.html',
					controller: 'LoginCtrl as login'
				}
			}
		})
		.state('events', {
			parent: 'wrapper',
			url: '/events', // Main display for active events
			views: {
				'mainView': {
					templateUrl: 'app/events/events.list.tpl.html',
					controller: 'EventsListCtrl as events'
				}
			}
		})
		.state('events.new', {
			parent: 'wrapper',
			url: '/events/new', // Main display for active events
			views: {
				'mainView': {
					templateUrl: 'app/events/events.new.tpl.html',
					controller: 'EventsNewCtrl as event'
				}
			}
		})
		.state('profile', {
			parent: 'wrapper',
			url: '/profile',
			views: {
				'mainView': {
					templateUrl: 'app/profile/profile.tpl.html',
					controller: 'ProfileCtrl as profile'
				}
			},
			resolve: {
				currentUser: getCurrentUserRes,
				profileData: getProfileRes
			}
		})
		.state('profile-other', {
			url: '/profile/:userId',
			views: {
				'mainView': {
					templateUrl: 'app/profile/profile.tpl.html',
					controller: 'ProfileCtrl as profile'
				}
			},
			resolve: {
				currentUser: getCurrentUserRes,
				profileData: getProfileRes
			}
		});

		function fetchCurrentUser(UserAccess, $window, $rootScope, $q, $state) {
			console.log('entering fetchCurrentUser');
			if (!!$rootScope.currentUser) {
				return $rootScope.currentUser;
			}
			var defer = $q.defer();
			if (!!$window.gapi.auth2 && $window.gapi.auth2.getAuthInstance().isSignedIn.get() === true) {
				console.log('fetching current user');
				UserAccess.createUser().then(function(data) {
					if (!!data) {
						console.log('setting current user');
						$rootScope.currentUser = data;
						$rootScope.isLoggedIn = true;
						defer.resolve(data);
					}
					else {
						console.error('error fetching current user');
						defer.reject();
						$state.go('events');
					}
				});
			}
			else {
				defer.reject();
				$state.go('login');
			}

			return defer.promise;
		}

		function getProfileData(UserAccess, $stateParams, $q, currentUser) {
			if ($stateParams.userId === undefined) {
				console.log('getProfileData returning current user');
				return currentUser;
			}
			console.log('getProfileData fetching userId '+ $stateParams.userId);
			return UserAccess.getUser($stateParams.userId);
		}

		return $locationProvider.html5Mode(false);
	}]);
})();
