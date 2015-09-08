app.factory('ETF', function ($http) {
	var retRes = (response) => response.data

    return {
    	getSearch: function(){
    		return $http.get('/api/etf/search').then(retRes);
    	},
        getAllTickers: function(){
            return $http.get('/api/etf/allTickers').then(retRes);
        },
        getFund: function(data){
        	return $http.post('/api/members/history', data).then(() => {
                return $http.get('/api/etf/fund/'+data.ticker).then(retRes)
            })
        }
    };
});