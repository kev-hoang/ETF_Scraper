app.config(function ($stateProvider) {

    $stateProvider.state('userHistory', {
        url: '/history',
        templateUrl: 'js/history/history.html',
        controller: function ($scope, History, AuthService, ETF) {
            $scope.ready = false;
            AuthService.getLoggedInUser().then(function (user) {
                $scope.user = user
                    History.get(user).then(function(history){
                        ETF.getSearch().then(function(searchText){
                            $scope.history = history.map(function(e){
                                if(e.ticker){
                                    return [e.date, e.ticker, searchText[e.ticker.toUpperCase()]]
                                }else{
                                    return [e.date, 'N/A', 'N/A']
                                }
                            })
                            $scope.ready = true;
                        })
                    })
                });

            $scope.clearHistory = (user) => {
                History.clear(user)
            } 
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.factory('History', function($http){
    return {
        get: (user) => {
            return $http.get('/api/members/history/' + user._id).then((response) => response.data)
        },
        clear: (user) => {
            return $http.delete('/api/members/history/' + user._id).then((response) => response.data)
        }
    }
})