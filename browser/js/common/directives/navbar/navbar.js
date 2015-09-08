app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state, ETF) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/navbar/navbar.html',
        link: function (scope) {
            scope.etfFund = 'loading tickers';
            scope.homeSearch = 'Home';
            scope.isLoggedIn = function () {
                return AuthService.isAuthenticated();
            };
            
            var getETF = () => {
                scope.homeSearch = 'Search';
                setUser();
                ETF.getAllTickers().then(function(allTickers){
                    scope.etfFund = undefined;
                    scope.allETF = allTickers;
                });
            }

            scope.goToFund = (etfFund) => {
                if(scope.allETF.indexOf(etfFund) < 0){
                    alert('Ticker does not exist at SPDR')
                }else{
                    $state.go('singleFund',{'ticker': etfFund})
                }
            }

            scope.items = [
                { label: 'My Favorites', state: 'favorites', auth: true },
                { label: 'My Search History', state: 'userHistory', auth: true },
                { label: 'About', state: 'about' },
            ];

            scope.user = null;


            scope.logout = function () {
                AuthService.logout().then(function () {
                   $state.go('home');
                });
            };

            var setUser = function () {
                AuthService.getLoggedInUser().then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.homeSearch = 'Home';
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, getETF);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

        }

    };

});
