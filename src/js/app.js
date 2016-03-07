(function() {

	/**
	 * Module definition for Quiescent App
	 */
	 var quiescentApp = angular.module( 'quiescentApp', ['ngSanitize', 'ngRoute', 'ngResource'] );



	/**
	 * Configuration variables for the app
	 */
	var 
		serverPath = 'http://localhost/wordpress/',
		apiPath = 'wp-json/wp/v2/',
		apiUrl = serverPath + apiPath;



	/**
	 * Configuring routes for our app
	 */
	quiescentApp.config( ['$routeProvider', function( $route ) {
		// post listing route
		$route.when( '/posts', {
			templateUrl: 'views/listing.html',
			controller: 'PostListing',
			controllerAs: 'postListing'
		} )

		// single post route
		.when( '/posts/:slug', {
			templateUrl: 'views/single.html',
			controller: 'SinglePost',
			controllerAs: 'singlePost'
		} )

		// author profile route
		.when( '/users/:id', {
			templateUrl: 'views/author.html',
			controller: 'UserListing',
			controllerAs: 'userListing'
		} )

		// category profile route
		.when( '/categories/:id', {
			templateUrl: 'views/category.html',
			controller: 'CategoryListing',
			controllerAs: 'categoryListing'
		} )

		// 404 route
		.otherwise( {
			templateUrl: 'views/404.html'
		} );
	}] );



	/**
	 * Creating a service for Posts
	 */
	quiescentApp.factory( 'Posts', ['$resource', function( $resource ) {
		return $resource( apiUrl + 'posts?slug=:slug' );
	}] );



	/**
	 * Creating a service for Users
	 */
	quiescentApp.factory( 'Users', ['$resource', function( $resource ) {
		return $resource( apiUrl + 'users/:id' );
	}] );



	/**
	 * Creating a service for Categories
	 */
	quiescentApp.factory( 'Categories', ['$resource', function( $resource ) {
		return $resource( apiUrl + 'categories/:id' );
	}] );



	/**
	 * Creating a custom directive for posts listing
	 */
	quiescentApp.directive( 'postListing', ['$routeParams', '$location', 'Posts', function( $routeParams, $location, Posts ) {
		return {
			restrict: 'E',
			scope: {
				postArgs: '='
			},
			templateUrl: 'views/directive-post-listing.html',
			link: function( $scope, $elem, $attr ) {
				// defining variables on the $scope object
				$scope.posts = [];
				$scope.postHeaders = {};
				$scope.currentPage = $routeParams.page ? Math.abs( $routeParams.page ) : 1;
				$scope.nextPage = null;
				$scope.previousPage = null;
				$scope.routeContext = $location.path();

				// preparing query arguments
				var prepareQueryArgs = function() {
					var tempParams = $routeParams;
					delete tempParams.id;
					return angular.merge( {}, $scope.postArgs, tempParams );
				};

				// make the request and query posts
				Posts.query( prepareQueryArgs(), function( data, headers ) {
					$scope.posts = data;
					$scope.postHeaders = headers();
					$scope.previousPage = ( ( $scope.currentPage + 1 ) > $scope.postHeaders['x-wp-totalpages'] ) ? null : ( $scope.currentPage + 1 );
					$scope.nextPage = ( ( $scope.currentPage - 1 ) > 0 ) ? ( $scope.currentPage - 1 ) : null;
				});
				
			}
		};
	}] );



	/**
	 * Controller for Post Listing
	 */
	quiescentApp.controller( 'PostListing', [function() {
		var self = this;
	}] );



	/**
	 * Controller for Single Post
	 */
	quiescentApp.controller( 'SinglePost', ['$routeParams', 'Posts', function( $routeParams, Posts ) {
		var self = this;
		self.postSlug = $routeParams.slug;
		self.post = {};

		Posts.query( {'slug': self.postSlug}, function( data, headers ) {
			self.post = data[0];
		});
	}] );



	/**
	 * Controller for Categories
	 */
	quiescentApp.controller( 'CategoryListing', ['$routeParams', 'Categories', function( $routeParams, Categories ) {
		var self = this;
		self.categoryInfo = {};
		self.categoryId = $routeParams.id;

		Categories.get( {'id': self.categoryId}, function( data, headers ) {
			self.categoryInfo = data;
		});
	}] );



	/**
	 * Controller for Users
	 */
	quiescentApp.controller( 'UserListing', ['$routeParams', 'Users', function( $routeParams, Users ) {
		var self = this;
		self.userInfo = {};
		self.userId = $routeParams.id;

		Users.get( {'id': self.userId}, function( data, headers ) {
			self.userInfo = data;
		});
	}] );



})();

$(document).foundation();