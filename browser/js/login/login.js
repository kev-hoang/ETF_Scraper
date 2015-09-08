app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, User) {

    $scope.login = {};
    $scope.error = null;
    $scope.signup = {};
    $scope.pwdCheck = undefined;

    $scope.sendLogin = function (loginInfo) {
        $scope.error = null;
        AuthService.login(loginInfo).then(function () {
            $state.go('favorites');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };


    $scope.create = function(signupData) {
        User.create(signupData)
        .then(function(){
            AuthService.getLoggedInUser().then(function(user){
                if (user) $state.go('favorites');
            });
        }).catch(() => {
            $scope.error = 'Email already exists.'
        });
    };

});

app.factory('User', function($http){
    return{
        create: function(data){
            return $http.post('/api/members/signup', data).then((response) => response.data);
        }
    }
})