angular.module( 'utility.config', ['lodash'])

.service('config', function(lodash) {

	// private vars here if needed

	return {
		siteName: 'Sailng',
		// no trailing slash!
		siteUrl: '/',
		// apiUrl: 'http://icdt-dev.cloudapp.net:1337',
		apiUrl: 'http://icdt-dev.cloudapp.net:1337',

		currentUser: false
	};

});