// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services','google-maps','ngCookies','ngSails','utility'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // StatusBar.styleDefault();
  });
})

.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.map', {
      url: '/map',
      views: {
        'tab-map': {
          templateUrl: 'templates/tab-map.html',
          controller: 'MapCtrl'
        }
      }
    })
    .state('tab.join', {
      url: '/join',
      views: {
        'tab-join': {
          templateUrl: 'templates/tab-join.html',
          controller: 'JoinCtrl'
        }
      }
    })
    .state('tab.join-detail', {
      url: '/join/:joinId',
      views: {
        'tab-join': {
          templateUrl: 'templates/join-detail.html',
          controller: 'JoinDetailCtrl'
        }
      }
    })
    .state('tab.share', {
      url: '/share',
      views: {
        'tab-share': {
          templateUrl: 'templates/tab-share.html',
          controller: 'ShareCtrl'
        }
      }
    })
    .state('tab.share-detail', {
      url: '/share/:shareId',
      views: {
        'tab-share': {
          templateUrl: 'templates/share-detail.html',
          controller: 'ShareDetailCtrl'
        }
      }
    })
    .state('tab.register', {
      url: '/register',
      views: {
        'tab-register': {
          templateUrl: 'templates/tab-register.html',
          controller: 'RegisterCtrl'
        }
      },
      resolve: {
          loggedin : checkLoggedin
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/map');


  //================================================
    // Check if the user is connected
    //================================================
  function checkLoggedin($q, $timeout, $http, $location, $rootScope, GlobalService, utils){

      //讓重新進入controller後，可以把loading停下來
      GlobalService.check_login_status = true;

      // Initialize a new promise
      var deferred = $q.defer();

      var url = utils.prepareUrl('auth/loggedin');

      // Make an AJAX call to check if the user is logged in
      $http.get(url).success(function(user){
        
        // Authenticated
        if (user !== '0'){
          GlobalService.currentUser = user;
          $timeout(deferred.resolve, 0);
        }

        // Not Authenticated
        else {
          console.log('checkLoggedin no user');
          $timeout(deferred.resolve, 0);        //不傳回這樣進不了controller
        }
      });
      return deferred.promise;
    }
    //================================================
    
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.responseInterceptors.push(function($q, $location) {
      return function(promise) {
        return promise.then(
          // Success: just return the response
          function(response){
            return response;
          }, 
          // Error: check the error status to get only the 401
          function(response) {
            if (response.status === 401)
              $location.url('#/tab/register');
              // $state.transitionTo('tab.register');
            return $q.reject(response);
          }
        );
      }
    });
    //================================================
})

.factory('OAuthService', function($state, $stateParams){

  var win=null;

  function open_oauthWindow(url){
    // var left = (screen.width/2)-(w/2);
    // var top = (screen.height/2)-(h/2);  
    win = window.open(url,"_blank","location=no");
  }

  function oauthCallback(){
    console.log("in OAuth's oauthCallback");
    $state.transitionTo($state.current, $stateParams, {
        reload: true,
        inherit: false,
        notify: true
    });
    win.close();
  }

  return{
    open_oauthWindow : open_oauthWindow,
    oauthCallback: oauthCallback
  };

});


// Global function called back by the OAuth login dialog
function oauthCallback() {
    console.log("in oauthCallback");
    var injector = angular.element(document.getElementById('main')).injector();
    injector.invoke(function (OAuthService) {
        OAuthService.oauthCallback();
    });
}

