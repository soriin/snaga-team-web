$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    var app = angular.module('app.core', ['ngSanitize', 'ngResource', 'ui.router', 'ngCookies', 'ng-polymer-elements']);
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    var app = angular.module('app.events', ['app.core']);
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    var app = angular.module('app.layout', ['app.core']);
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    var app = angular.module('app.profile', ['app.core']);
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    var app = angular.module('app', ['app.core', 'app.events', 'app.layout', 'app.profile']);
    app.constant('VERSION', '0.1.0');
    app.config(['$resourceProvider', function($resourceProvider) {
      $resourceProvider.defaults.stripTrailingSlashes = false;
    }]);
    app.config(["$httpProvider", function($httpProvider) {
      $httpProvider.interceptors.push('authHttpRequestInterceptor');
    }]);
    app.run(function($rootScope) {
      $rootScope.$on('$stateChangeStart', function(e, to) {
        console.log("routing to:");
        console.log(to);
      });
    });
    app.run(function($rootScope) {
      $rootScope.$on('$stateChangeSuccess', function(e, to) {
        console.log("routed to:");
        console.log(to);
      });
    });
    app.run(function($rootScope) {
      $rootScope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
        console.log("error routing to:");
        console.log(toState);
        console.log(error);
      });
    });
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app').config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function appConfig($stateProvider, $locationProvider, $urlRouterProvider) {
      $locationProvider.hashPrefix('!');
      $urlRouterProvider.otherwise("/events");
      var getProfileRes = ['UserAccess', '$stateParams', '$q', 'currentUser', getProfileData];
      var getCurrentUserRes = ['UserAccess', '$window', '$rootScope', '$q', '$state', fetchCurrentUser];
      $stateProvider.state('wrapper', {templateUrl: "partials/layout/default.layout.html"}).state('login', {
        url: "/login",
        views: {"mainView": {
            templateUrl: "partials/core/login.html",
            controller: 'LoginCtrl as login'
          }}
      }).state('events', {
        parent: 'wrapper',
        url: "/events",
        views: {"mainView": {
            templateUrl: "partials/events/events.list.html",
            controller: 'EventsListCtrl as events'
          }}
      }).state('events.new', {
        parent: 'wrapper',
        url: "/events/new",
        views: {"mainView": {
            templateUrl: "partials/events/events.new.html",
            controller: 'EventsNewCtrl as event'
          }}
      }).state('profile', {
        parent: 'wrapper',
        url: "/profile",
        views: {"mainView": {
            templateUrl: "partials/profile/profile.html",
            controller: 'ProfileCtrl as profile'
          }},
        resolve: {
          currentUser: getCurrentUserRes,
          profileData: getProfileRes
        }
      }).state('profile-other', {
        url: "/profile/:userId",
        views: {"mainView": {
            templateUrl: "partials/profile/profile.html",
            controller: 'ProfileCtrl as profile'
          }},
        resolve: {
          currentUser: getCurrentUserRes,
          profileData: getProfileRes
        }
      });
      function fetchCurrentUser(UserAccess, $window, $rootScope, $q, $state) {
        console.log("entering fetchCurrentUser");
        if (!!$rootScope.currentUser) {
          return $rootScope.currentUser;
        }
        var defer = $q.defer();
        if (!!$window.gapi.auth2 && $window.gapi.auth2.getAuthInstance().isSignedIn.get() == true) {
          console.log("fetching current user");
          UserAccess.createUser().then(function(data) {
            if (!!data) {
              console.log("setting current user");
              $rootScope.currentUser = data;
              $rootScope.isLoggedIn = true;
              defer.resolve(data);
            } else {
              console.error("error fetching current user");
              defer.reject();
              $state.go("events");
            }
          });
        } else {
          defer.reject();
          $state.go("login");
        }
        return defer.promise;
        console.log("not fetching current user");
      }
      function getProfileData(UserAccess, $stateParams, $q, currentUser) {
        if ($stateParams.userId === undefined) {
          console.log("getProfileData returning current user");
          return currentUser;
        }
        console.log("getProfileData fetching userId " + $stateParams.userId);
        return UserAccess.getUser($stateParams.userId);
      }
      return $locationProvider.html5Mode(false);
    }]);
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.core').controller('InputBoxController', ['$scope', '$rootScope', InputBoxCtrl]);
    function InputBoxCtrl($scope, $rootScope) {}
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.core').directive('snagaInputBox', inputBox);
    function inputBox() {
      return {
        restrict: 'E',
        templateUrl: 'partials/core/components/input_box.html',
        controller: 'InputBoxController as ib',
        bindToController: true,
        scope: {
          label: '@',
          model: '='
        }
      };
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module("app.core").service("constants", ["$location", constants]);
    function constants($location) {}
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.core').factory('EventAccess', ['$http', EventAccess]);
    function EventAccess($http, logger) {
      var svc = {
        createEvent: createEvent,
        updateEvent: updateEvent,
        getEvents: getEvents
      };
      return svc;
      function getEvents() {
        return sendReq({
          method: "GET",
          url: "/api/events/"
        });
      }
      function createEvent(body) {
        return sendReq({
          method: "POST",
          url: "/api/events/",
          data: body
        });
      }
      function updateEvent(id, body) {
        return sendReq({
          method: "PUT",
          url: "/api/events/" + id,
          data: body
        });
      }
      function sendReq(req) {
        return $http(req).then(onSuccess, onError);
      }
      function onSuccess(response) {
        return response.data;
      }
      function onError(error) {
        console.log(error);
      }
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.core').factory('UserAccess', ['$http', UserAccess]);
    function UserAccess($http, logger) {
      var svc = {
        createUser: createUser,
        updateUser: updateUser,
        getUser: getUser,
        addGroup: addGroup,
        removeGroup: removeGroup
      };
      return svc;
      function createUser() {
        return sendReq({
          method: "POST",
          url: "/api/users/"
        });
      }
      function updateUser(id, body) {
        return sendReq({
          method: "PUT",
          url: "/api/users/" + id,
          data: body
        });
      }
      function getUser(id) {
        return sendReq({
          method: "GET",
          url: "/api/users/" + id
        });
      }
      function addGroup(id, groupName) {
        return sendReq({
          method: "PUT",
          url: "/api/users/" + id + "/groups",
          data: {
            Action: "add",
            GroupName: groupName
          }
        });
      }
      function removeGroup(id, groupName) {
        return sendReq({
          method: "PUT",
          url: "/api/users/" + id + "/groups",
          data: {
            Action: "remove",
            GroupName: groupName
          }
        });
      }
      function sendReq(req) {
        return $http(req).then(onSuccess, onError);
      }
      function onSuccess(response) {
        return response.data;
      }
      function onError(error) {
        console.log(error);
      }
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module("app.core").factory("authHttpRequestInterceptor", ['$cookieStore', httpRequestIntercept]);
    function httpRequestIntercept($cookieStore) {
      var svc = {request: request};
      return svc;
      function request(config) {
        var token = $cookieStore.get('token');
        if (token != undefined && token.length > 0) {
          config.headers["Auth-Token"] = token;
        }
        return config;
      }
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.core').filter('interpolate', interpolate);
    function interpolate($version) {
      return function(text) {
        return String(text).replace(/\%VERSION\%/mg, $version);
      };
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.core').controller('LoginCtrl', ['$window', '$location', '$state', '$cookieStore', '$rootScope', LoginCtrl]);
    function LoginCtrl($window, $location, $state, $cookieStore, $rootScope) {
      var loginVm = this;
      loginVm.login = login;
      loginVm.logout = logout;
      loginVm.renderLogin = renderLogin;
      loginVm.notRendered = true;
      $rootScope.$watch('isLoggedIn', function(val) {
        loginVm.isLoggedIn = val;
      });
      function renderLogin() {
        console.log("rendering login button");
        $window.gapi.signin2.render('googleSigninBtn', {
          'scope': 'profile',
          'width': 100,
          'height': 40,
          'longtitle': false,
          'theme': 'dark',
          'onsuccess': login,
          'onfailure': loginFail
        });
        loginVm.notRendered = false;
      }
      function loginFail(e) {
        console.log(e);
      }
      function login(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail());
        var id_token = googleUser.getAuthResponse().id_token;
        console.log("ID Token: " + id_token);
        $cookieStore.put('token', id_token);
        $window.gapi.auth2.getAuthInstance().then(function() {
          $rootScope.isLoggedIn = true;
          $rootScope.$apply();
          $state.go("events");
        });
      }
      function logout() {
        var auth2 = $window.gapi.auth2.getAuthInstance();
        auth2.signOut().then(function() {
          $rootScope.isLoggedIn = false;
          $rootScope.$apply();
          console.log('User signed out.');
          $state.go("events");
        });
      }
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.core').factory('$version', version);
    function version(VERSION) {
      return VERSION;
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.events').controller('EventsListCtrl', ['$state', 'EventAccess', EventsListCtrl]);
    function EventsListCtrl($state, EventAccess) {
      var eventsVm = this;
      eventsVm.Create = create;
      eventsVm.Events = [];
      activate();
      function activate() {
        EventAccess.getEvents().then(refreshEvents);
      }
      function create() {
        $state.go("events.new");
      }
      function refreshEvents(data) {
        if (Object.prototype.toString.call(data) === '[object Array]') {
          eventsVm.Events = data;
        }
      }
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.events').controller('EventsNewCtrl', ['$state', EventsNewCtrl]);
    function EventsNewCtrl($state) {
      var eventsVm = this;
      eventsVm.Create = create;
      function create() {
        $state.go("events");
      }
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.layout').controller('AppCtrl', ['$rootScope', AppCtrl]);
    function AppCtrl($rootScope) {
      var appVm = this;
      $rootScope.isLoggedIn = false;
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.layout').directive('appVersion', appVersion);
    function appVersion() {
      return {
        restrict: 'E',
        template: '<span>Snaga Team v{{ "%VERSION%" | interpolate  }}</span>',
        link: link
      };
      function link($scope, $element, $attrs) {}
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.profile').controller('AdminController', ['UserAccess', '$scope', '$rootScope', AdminCtrl]);
    function AdminCtrl(UserAccess, $scope, $rootScope) {
      var adminVm = this;
      adminVm.addAdmin = addAdmin;
      adminVm.removeAdmin = removeAdmin;
      adminVm.currentUser = $rootScope.currentUser;
      adminVm.profileUser = $scope.profileUser;
      adminVm.IsAdmin = adminVm.profileUser.IsAdmin;
      adminVm.IsNotAdmin = !adminVm.profileUser.IsAdmin;
      function addAdmin() {
        UserAccess.addGroup($scope.profileUser.Id, "admin").then(updateData);
      }
      function removeAdmin() {
        UserAccess.removeGroup($scope.profileUser.Id, "admin").then(updateData);
      }
      function updateData(data) {
        var user = data;
        $scope.profileUser = user;
        adminVm.IsAdmin = user.IsAdmin;
        adminVm.IsNotAdmin = !user.IsAdmin;
        if (user.UserId == $rootScope.currentUser.UserId) {
          $rootScope.currentUser = user;
        }
      }
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.profile').directive('snagaAdminSwitch', adminSwitch);
    function adminSwitch() {
      return {
        restrict: 'E',
        templateUrl: 'partials/profile/admin_switch.html',
        controller: 'AdminController as admin',
        scope: {profileUser: '='}
      };
    }
  })();
  return {};
});


$traceurRuntime.ModuleStore.getAnonymousModule(function() {
  "use strict";
  (function() {
    'use strict';
    angular.module('app.profile').controller('ProfileCtrl', ['$window', '$state', 'UserAccess', '$rootScope', 'profileData', '$stateParams', ProfileCtrl]);
    function ProfileCtrl($window, $state, UserAccess, $rootScope, profileData, $stateParams) {
      var profileVm = this;
      profileVm.update = update;
      profileVm.user = {};
      activate(profileData);
      function activate(data) {
        setProfileData(data);
      }
      function update() {
        UserAccess.updateUser(profileVm.user.Id, {
          FirstName: profileVm.user.FirstName,
          LastName: profileVm.user.LastName,
          DisplayName: profileVm.user.DisplayName,
          InGameName: profileVm.user.InGameName,
          Email: profileVm.user.Email
        }).then(setProfileData);
      }
      function setProfileData(data) {
        profileVm.user = data;
        if ($rootScope.currentUser.UserId == data.UserId) {
          $rootScope.currentUser = data;
        }
      }
    }
  })();
  return {};
});



//# sourceMappingURL=app.js.map