app.config(function ($stateProvider) {

    $stateProvider.state('favorites', {
        url: '/favorites',
        templateUrl: 'js/favorites/favorites.html',
        controller: function ($scope, AuthService, Favs, $state) {
            $scope.ready = false;
            AuthService.getLoggedInUser().then(function (user) {
                $scope.user = user
                    Favs.get(user).then(function(favorites){
                        $scope.favorites = favorites
                        $scope.ready = true;
                    })
                });

            $scope.clearFavs = (user) => {
                Favs.clear(user)
            }
        },
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

app.factory('Favs', function($http){
    return {
        get: (user) => {
            return $http.get('/api/members/favorites/' + user._id).then((response) => response.data)
        },
        add: (id, ticker) => {
            return $http.post('/api/members/favorites/', {id, ticker}).then((response) => response.data)
        },
        // delete: (user) => {
        //     return $http.put('/api/members/favorites/' + user._id, ).then((response) => response.data)
        // },
        clear: (user) => {
            return $http.delete('/api/members/favorites/' + user._id).then((response) => response.data)
        }
    };
});