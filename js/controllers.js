angular.module('starter.controllers', ['ngSails', 'utility'])

.controller('MapCtrl', function($q, $scope, $state, $ionicModal, $sails, $timeout, PartyService, GlobalService) {
    
    // start to execute MapCtrl
    console.log('begin of MapCtrl');
	  
    // use when getCurrentPosition ok
    $scope.mapIsReady = false;

    initialize();

    function initialize(){

      navigator.geolocation.getCurrentPosition(
          function success(position){

            $scope.mapIsReady = true;
              
              console.log('latitude: ' + position.coords.latitude );
              console.log('longitude: ' + position.coords.longitude );
              console.log('isReady: ' + $scope.mapIsReady);

            $scope.map = {

              center: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },

              options: {
                // disableDefaultUI: true
              },

              zoom: 10,

              events: {
                    tilesloaded: function (map) {
                        $scope.$apply(function () {


                            // $log.info('this is the map instance', map);
                            // var button = document.getElementById("mapRegister");

                            // google.maps.event.addDomListener(button, 'click', function() {
                            //   alert("button hitt..");
                            // });

                            // button.index = 1;
                            // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button); 
                            // console.log('this is the map instance', map);  
                        });
                    }
                }
            };

            $scope.myLocaitionMarker={
              coords: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            };
            

            $scope.$apply();
        }, 
          function fail(err){
            console.log('geolocation not work'+'\n'+err);
            console.log('isReady: ' + $scope.mapIsReady);
        }
        // ,{timeout:10000}
      );
    }

    
    AddPartyMarker();
    function AddPartyMarker(){

      PartyService.getAll($scope).then(function(parties){

        var markers = [];

        _.each(parties, function(party){

              if (party.owner == 'undefined'){
                console.log('undefined owner party id is ');
                console.log(party.id);
              }

              var markerObj = {
                    latitude: party.lat,
                    longitude: party.lng,
                    icon: getFlagIcon(party.owner[0].favoriteTeam.name),
                    onClicked: function(){
                      GlobalService.selected_party = party;
                      // alert('marker ' + GlobalService.global_get_selected_party_id() +' be clicked');
                      CreateModalDialog();
                    }
                };
              markers.push(markerObj);
        });

        console.log(markers);
        $scope.partyMarkers = markers;

      });

    }

    function addClickEventOnMarkers(){
        _.each($scope.partyMarkers, function (marker) {
            marker.closeClick = function () {
                // marker.showWindow = false;
                // $scope.$apply();
            };
            marker.onClicked = function () {
                onMarkerClicked(marker);
            };
        });
    }
    
    var onMarkerClicked = function (marker) {
        $scope.modal.show();
        // console.log(marker.partyInfo);
        // alert(marker.partyInfo);
    };

    function getFlagIcon(team_name){

      if (team_name == 'Spain'){
        return 'images/Spain-32.png';
      }else if (team_name == 'France'){
        return 'images/France-32.png';
      }else if (team_name == 'England'){
        return 'images/England-32.png';
      }else if (team_name == 'Brazil'){
        return 'images/Brazil-32.png';
      }

    }

    function CreateModalDialog(){

      $ionicModal.fromTemplateUrl('modal.html', function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      }, {
        animation: 'slide-in-up',
        focusFirstInput: true
      });

    }



    // $sails.on("message", function (message) {
      
    //   console.log('indside message');
    //   console.log(message);

    //   if (message.verb === "create") {

    //     console.log('inside message / create');

    //     // var markerObj = {
    //     //           latitude: party.party_lat,
    //     //           longitude: party.party_lng,
    //     //           icon: getFlagIcon(party.owner_favorite_team_name),
    //     //           party_id: party.party_id,
    //     //           partyInfo: party,
    //     //           onClicked: function(){
    //     //             GlobalService.global_set_selected_party_id(party.party_id);
    //     //             // alert('marker ' + GlobalService.global_get_selected_party_id() +' be clicked');
    //     //             CreateModalDialog();
    //     //           }
    //     //       };
    //     // $scope.partyMarkers.push(message.data);
    //   }
    // });

  // function addRegisterButtonOnMap(map){
  //   var button = document.getElementById("mapRegister");
  //   google.maps.event.addDomListener(controlUI, 'click', function() {
  //     map.setCenter(chicago)
  //   });
  // }

   // $scope.mapIsReady = true;
   //      $scope.map = {
   //              center: {
   //                latitude: 23.461435499999998,
   //                longitude: 120.4336167
   //              },
   //              options: {
   //                disableDefaultUI: true
   //              },
   //              zoom: 15
   //              // events: {
   //              //     tilesloaded: function (map) {
   //              //         $scope.mapInstance = map;
   //              //         // $scope.$apply(function () {
   //              //         //     $log.info('this is the map instance', map);
   //              //         //     var button = document.getElementById("mapRegister");
   //              //             // google.maps.event.addDomListener(button, 'click', function() {
   //              //             //   alert("button hitt..");
   //              //             // });
   //              //             // button.index = 1;
   //              //             // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(button); 
   //              //             // console.log('this is the map instance', map);  
   //              //         // });
   //              //     }
   //              // }
   //            };

   // // medthod: transition to other state
    // $scope.actionRegister = function(){
    //   $state.transitionTo('tab.register');
    // };
    
    // testPromise();
    // function testPromise(){
    //   console.log("test Promise");
    //   var party_data = PartyService.get_party_data();
    //   console.log(party_data);
    // }

    //add party parkers by http inside controller
    //addPartyMarkers();
    // function addPartyMarkers(){
    //   console.log(PartyService.PartyData);
    //   PartyService.getAll(function(parties){
    //     var dataMarkers = new Array();
    //     var partyCount = 0;
    //     PartyService.PartyData = parties;
    //     console.log(PartyService.PartyData);
    //     parties.forEach(function(party){
    //         var dataMarker = {
    //             latitude: party.party_lat,
    //             longitude: party.party_lng,
    //             icon: getFlagIcon(party.owner_favorite_team_name),
    //             party_id: party.party_id,
    //             partyInfo: party
    //         };
    //         dataMarkers.push(dataMarker);
    //         partyCount++;
    //         if(partyCount == parties.length){
    //           $scope.partyMarkers = dataMarkers;
    //           // $scope.$apply();
    //           addClickEventOnMarkers();
    //         }
    //     });
    //   });
    // }

  // $scope.$on('$viewContentLoaded', function () {
  //   var mapHeight = 500; // or any other calculated value
  //   $("#map-canvas .angular-google-map-container .angular-google-map").height(mapHeight);
  // });

  // var genRandomMarkers = function (numberOfMarkers, scope) {
  //       var markers = [];
  //       for (var i = 0; i < numberOfMarkers; i++) {
  //           markers.push(createRandomMarker(i, scope.map.bounds))
  //       }
  //       scope.map.randomMarkers = markers;
  //   };

  //   var createRandomMarker = function (i, bounds) {
  //       var lat_min = bounds.southwest.latitude,
  //               lat_range = bounds.northeast.latitude - lat_min,
  //               lng_min = bounds.southwest.longitude,
  //               lng_range = bounds.northeast.longitude - lng_min;

  //       var latitude = lat_min + (Math.random() * lat_range);
  //       var longitude = lng_min + (Math.random() * lng_range);
  //       return {
  //           latitude: latitude,
  //           longitude: longitude,
  //           title: 'm' + i
  //       };
  //   };
	
})

.controller('ModalCtrl', function($scope, PartyService, GlobalService) {
    
  var party = GlobalService.selected_party;

  $scope.party_info ={};
  $scope.party_info.game_on_screen = party.game_on_screen.at_team.name + ' vs ' + party.game_on_screen.home_team.name;
  $scope.party_info.party_address = party.address;
  $scope.party_info.owner_name = party.owner[0].name;
  $scope.party_info.owner_email = party.owner[0].email;

  
  $scope.Join_the_party = function() {
    


    $scope.modal.hide();
  };

})

.controller('JoinCtrl', function($scope, $cookies, JoinService) {

  var userId = $cookies.ssdemouserid;
  JoinService.getUserJoins(userId, function(data){
      $scope.joins = data;
  });

})

.controller('JoinDetailCtrl', function($scope, $stateParams, JoinService) {
  // $scope.join = Joins.get($stateParams.joinId);
})

.controller('ShareCtrl', function($scope, $cookies, ShareService) {

  // var userId = $cookies.ssdemouserid;
  // ShareService.getUserShares(userId, function(data){
  //     $scope.shares = data;
  // });

})

.controller('ShareDetailCtrl', function($scope, $stateParams, ShareService) {
  // $scope.share = Shares.get($stateParams.shareId);
})

.controller('RegisterCtrl', function($scope, $http, $cookies, $timeout,$log, $sails, $ionicLoading, utils, TeamService, GameService, UserService, PartyService, GlobalService, OAuthService ) {

  $scope.register = {};
  $scope.new_user = {};
  $scope.teams = [];
  $scope.games = [];
  $scope.not_loggedin = true;

  console.log(GlobalService.currentUser);

  if (GlobalService.currentUser != false){

    var user = GlobalService.currentUser;

    console.log(user);

    $scope.not_loggedin = false;
    $scope.login_user = user.name;

  }

  console.log('inside registerCtrl');
  // $scope.login_user = GlobalService.currentUser.name;
  // $http.get('/auth/loggedin').success().error();

  TeamService.getAll($scope).then(function(models) {
    // $log.log(models);
    $scope.teams = models;
  });

  GameService.getAll($scope).then(function(models) {
    // $log.log(models);
      _.each(models, function(model){
          var id_homeTeam_atTeam = {
            'id' : model.id,
            'home_team' : model.home_team.name,
            'at_team' : model.at_team.name,
            'combines' : model.at_team.name + ' vs. ' + model.home_team.name
          };
          $scope.games.push(id_homeTeam_atTeam);
      });
  });



  $scope.finishGetLocation = true;
  navigator.geolocation.getCurrentPosition(
    function success(position){

      $scope.registerScreen.lat = position.coords.latitude;
      $scope.registerScreen.lng = position.coords.longitude;

      var latlng = position.coords.latitude + ',' + position.coords.longitude;
      var geocoderService = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=' + latlng + '+&sensor=false';
      $http.get(geocoderService)
            .success(function(data, status) {
                console.log(data);
                $scope.registerScreen.address = data.results[0].formatted_address;
                $scope.finishGetLocation = false;
                // $scope.$apply();
            })
            .error(function(data, status) {
              console.log("no data");
            });
    }, 
    function fail(){
      $scope.finishGetLocation = false;
      console.log("geolcation not work");
    });

  $scope.oauth_login = function(provider){

    console.log('github_login');

    // 將此 global variable 設為 false，表示進入登入過程
    GlobalService.check_login_status =false;

    if (provider == 'github'){
      var url = utils.prepareUrl('auth/github');
    }else if(provider == 'facebook'){
      var url = utils.prepareUrl('auth/facebook');
    }

    OAuthService.open_oauthWindow(url);
    // window.open(url,"Login","top=500, left=500, width=400, height=400");

    // $scope.loading = $ionicLoading.show({
    //     content: 'Loading...',
    //   });

  };

  // 在 app.js 的 checkLoggedin 中將GlobalService.check_login_status設為true，在重新進入controller後會執行下面把loading關掉
  // 
  if (GlobalService.check_login_status == true){
    if ($scope.loading != null){
      $scope.loading.hide();
    }
  }

  $scope.registerScreen = function(){

      $scope.loading = $ionicLoading.show({
        content: 'Loading...',
      });

      GlobalService.currentUser.favoriteTeam = $scope.registerScreen.team.id;

      UserService.update(GlobalService.currentUser);

      var partyObj = {
          game_id : $scope.registerScreen.game.id,
          owner_id : GlobalService.currentUser.id,
          party_address : $scope.registerScreen.address,
          party_lat : $scope.registerScreen.lat,
          party_lng : $scope.registerScreen.lng
      };


      var promise = PartyService.create(partyObj);
      promise.then(function(){
        $scope.loading.hide();
      });

        
  };



});
