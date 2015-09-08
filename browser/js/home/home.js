app.controller('HomeController', function($scope, ETF, AuthService, $state){
	$scope.isLoggedIn = () => AuthService.isAuthenticated();
    $scope.ready = false
	$scope.searchFund = undefined;
    if($scope.isLoggedIn()){
        ETF.getSearch().then(function(allSearchText){
            $scope.allETF = [];
            $scope.getTicker = {};
            $scope.checkTicker = allSearchText;
            for(var key in allSearchText){
            	var title = allSearchText[key]
            	$scope.allETF.push(key)
            	$scope.allETF.push(title)
            	$scope.getTicker[title] = key
            }
            $scope.ready = true;
        });
    }

    $scope.search = (searchFund) => {
    	if($scope.checkTicker[searchFund] !== undefined){
        	$state.go('singleFund',{'ticker': searchFund})
    	}else if($scope.getTicker[searchFund] !== undefined){
    		$state.go('singleFund',{'ticker': $scope.getTicker[searchFund]})
    	}else{
    		alert('Ticker does not exist at SPDR')
    	}
    }
})

app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeController'
    });
});
