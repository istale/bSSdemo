angular.module('starter.services', ['ngSails', 'utility'])

/**
 * A simple example service that returns some data.
 */
.factory('JoinService', function($sails) {

})

.factory('ShareService', function($sails) {

  
})

.factory('PartyService', function($q, $sails, utils){
	var factory = {};

	factory.getAll = function(){
		var deferred = $q.defer();
		var url = utils.prepareUrl('party/list_for_map');

		$sails.get(url, function(models){
			return deferred.resolve(models);
		});

		return deferred.promise;
	};



	factory.create = function(partyObj){

		var deferred = $q.defer();
		var url = utils.prepareUrl('party/create');

		$sails.post(url, partyObj, function(party){
			if (party !== 'party_already_registered'){
				deferred.resolve(party);
			}else{
				deferred.resolve('party_already_registered');
			}
		});

		return deferred.promise;

	};

	return factory;

})

.factory('TeamService', function($q, $sails, utils){

	var factory = {};

	factory.getAll = function(){
		var deferred = $q.defer();
		var url = utils.prepareUrl('team');

		$sails.get(url, function(models){
			return deferred.resolve(models);
		});

		return deferred.promise;
	};

	return factory;
})

.factory('GameService', function($q, $sails, utils){

	var factory = {};

	factory.getAll = function(){
		var deferred = $q.defer();
		var url = utils.prepareUrl('game');

		$sails.get(url, function(models){
			return deferred.resolve(models);
		});
		
		return deferred.promise;
	};

	return factory;

})

.service('UserService', function($q, $sails){


	this.getAll = function() {
		var deferred = $q.defer();
		var url = utils.prepareUrl('user');

		$sails.get(url, function(models) {
			return deferred.resolve(models);
		});

		return deferred.promise;
	};

	this.getOne = function(id) {
		var deferred = $q.defer();
		var temp_url = 'user/' + id;
		var url = utils.prepareUrl(temp_url);
		

		$sails.get(url, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};

	this.create = function(newModel) {
		var deferred = $q.defer();
		var url = utils.prepareUrl('user/create');

		$sails.post(url, newModel, function(model) {
			return deferred.resolve(model);
		});

		return deferred.promise;
	};

	this.update = function(user){

		var deferred = $q.defer();
		var url = utils.prepareUrl('user/update');

		console.log('inside user update');
		console.log(user);

		$sails.post(url, user, function(model) {
			if (model !== '0'){
				return deferred.resolve(model);
			}else{
				return deferred.reject('update failed !!');
			}
		});

		return deferred.promise;

	}

})

.factory('GlobalService', function(){

	return {
		selected_party : null,
		currentUser: false,
		check_login_status: false
	};

})

;
