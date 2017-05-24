(function () {

	angular.module('qudini.QueueApp')
		.directive('customer', Customer);

	Customer.$inject = ['$http'];

	/**
	* The <customer> directive is responsible for:
	* - serving customer
	* - calculating queued time
	* - removing customer from the queue
	*/
	function Customer($http) {
		return {
			restrict: 'E',
			scope: {
				customer: '=',
				onRemoved: '&',
				onServed: '&'
			},
			templateUrl: '/customer/customer.html',
			link: function (scope) {

				// calculate how long the customer has queued for
				scope.queuedTime = new Date() - new Date(scope.customer.joinedTime);

				scope.serve = function () {
					$http.put('/api/customer/serve', {
						id: scope.customer.id
					}).then(function (res) {
						scope.onServed();
					});
				};
				scope.remove = function () {
					$http({
							url: '/api/customer/remove',
							method: 'DELETE',
							data: {
									id: scope.customer.id
							},
							headers: {
									"Content-Type": "application/json;charset=utf-8"
							}
					}).then(function(res) {
							scope.onRemoved();
					});
				};

			}
		};
	}

})();
