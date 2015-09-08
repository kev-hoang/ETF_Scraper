app.config(function ($stateProvider) {

    $stateProvider.state('singleFund', {
        url: '/fund/{ticker}',
        templateUrl: 'js/singleFund/singleFund.html',
        controller: SingleFundController,
        // The following data.authenticate is read by an event listener
        // that controls access to this state. Refer to app.js.
        data: {
            authenticate: true
        }
    });

});

function SingleFundController($scope, $stateParams, ETF, AuthService, Favs){
    $scope.ready = false
    $scope.ticker = $stateParams.ticker
    AuthService.getLoggedInUser().then(function (user) {
        $scope.user = user
        ETF.getFund({ticker: $scope.ticker, id: user._id})
            .then((data) => {
                console.log(data)
                $scope.data = data

                $scope.dl = data.allHoldingsDL
                $scope.fundAsOf = data.topFund.asOf
                //fund barChart Data
                $scope.topFund = {
                    data: [],
                    labels: []
                }
                data.topFund.table.forEach((e) => {
                    $scope.topFund.data.push(parseFloat(e[1].substring(0, e[1].length-1)).toFixed(2))
                    $scope.topFund.labels.push(e[0])
                })
                //fund pieChart Data
                $scope.fundSector = {
                    data: [],
                    labels: []
                }
                for(var k in data.fundSector.breakdown){
                    $scope.fundSector.data.push(parseFloat(data.fundSector.breakdown[k]).toFixed(2))
                    $scope.fundSector.labels.push(k)
                }

                $scope.indexAsOf = data.topIndex.asOf
                //index barChart Data
                $scope.topIndex = {
                    data: [],
                    labels: []
                }
                data.topIndex.table.forEach((e) => {
                    $scope.topIndex.data.push(parseFloat(e[1].substring(0, e[1].length-1)).toFixed(2))
                    $scope.topIndex.labels.push(e[0])
                })

                //index pieChart Data
                $scope.indexSector = {
                    data: [],
                    labels: []
                }
                for(var l in data.indexSector.breakdown){
                    $scope.indexSector.data.push(parseFloat(data.indexSector.breakdown[l]).toFixed(2))
                    $scope.indexSector.labels.push(l)
                }  
                $scope.countryAsOf = data.fundCountryWeight.asOf
                if($scope.countryAsOf !== ''){
                    //country weight pieChart Data
                    $scope.countryBreakdown = {
                        data: [],
                        labels: []
                    }
                    data.fundCountryWeight.table.forEach((e) => {
                        $scope.countryBreakdown.data.push(parseFloat(e[1].substring(0, e[1].length-1)).toFixed(2))
                        $scope.countryBreakdown.labels.push(e[0])
                    })
                }
                
                $scope.ready = true     
            })
    })

    $scope.addFav = (userid, ticker) => {
        Favs.add(userid, ticker).then(()=>{
            alert(ticker + ' has been added to your favorites.')
        })
    }
}