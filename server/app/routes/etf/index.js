'use strict';
var router = require('express').Router();
module.exports = router;
var request = require('request-promise');
var $ = require('cheerio');
var xmldoc = require('xmldoc');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

var options = {
        uri: 'https://www.spdrs.com/'
    };

router.get('/allTickers', ensureAuthenticated, function (req, res) {

    request(options.uri + 'product/index.seam')
        .then(function (body) {
            var html = $.load(body.toString())
            var allTickers = []
            html('.fund').each(function(){
                var ticker = html(this).find(html('.f_ticker')).text()
                if(allTickers.indexOf(ticker) === -1){
                    allTickers.push(ticker);
                }
            })
            return allTickers
        })
        .then(function(allTickers){
            res.json(allTickers)
        })
});

router.get('/search', ensureAuthenticated, function (req, res) {
    request(options.uri + 'product/index.seam')
        .then(function (body) {
            var html = $.load(body.toString())
            var allTickers = {}
            html('.fund').each(function(){
                var ticker = html(this).find(html('.f_ticker')).text()
                var title = html(this).find(html('.f_name')).text()
                allTickers[ticker] = title;
            })
            return allTickers
        })
        .then(function(allTickers){
            res.json(allTickers)
        })
});

router.get('/fund/:ticker', ensureAuthenticated, function(req, res){
    var spoof = {};
    request(options.uri + 'product/fund.seam?ticker=' + req.params.ticker)
        .then((body) => {
            return $.load(body.toString())
        })
        //gets info
        .then((html) => {
            spoof.title = html('h1').text().trim()
            return html
        })
        //gets top holdings
        .then((html) => {
            var topFund = html('#FUND_TOP_HOLDINGS')
            spoof.topFund = {
                asOf: '',
                table: []
            }
            spoof.topFund.asOf = topFund.children('.asOf').text().trim()
            topFund.find(html('tr')).each(function(i){
                if(i !== 0){
                    var arr = []
                    html(this).children().each(function(i){
                        arr.push(html(this).text())
                    })
                    spoof.topFund.table.push(arr) 
                }
            })
            spoof.allHoldingsDL = topFund.find(html('a')).attr('href')
            return html
        })
        //gets top index
        .then((html) => {
            var topIndex = html('#INDEX_TOP_TEN_HOLDINGS')
            spoof.topIndex = {
                asOf: '',
                table: []
            }
            spoof.topIndex.asOf = topIndex.children('.asOf').text().trim()
            topIndex.find(html('tr')).each(function(i){
                if(i !== 0){
                    var arr = []
                    html(this).children().each(function(i){
                        arr.push(html(this).text())
                    })
                    spoof.topIndex.table.push(arr)
                }
            })
            return html
        })
        //gets fund sector allocation
        .then((html) => {
            var fundSector = html('#FUND_SECTOR')
            spoof.fundSector = {
                asOf: '',
                breakdown: {}
            }
            spoof.fundSector.asOf = fundSector.children('.asOf').text().trim()
            var legend = new xmldoc.XmlDocument(fundSector.children('#SectorsAllocChart').last().text());
            legend.childNamed('attributes').eachChild((attribute) => {
                spoof.fundSector.breakdown[attribute.childNamed('label').val] = attribute.childNamed('rawValue').val
            })
            return html
        })
        //gets index sector allocation
        .then((html) => {
            var indexSector = html('#INDEX_SECTOR')
            spoof.indexSector = {
                asOf: '',
                breakdown: {}
            }
            spoof.indexSector.asOf = indexSector.children('.asOf').text().trim()
            var legend = new xmldoc.XmlDocument(indexSector.children('#BmarkSectorsAllocChart').last().text());
            legend.childNamed('attributes').eachChild((attribute) => {
                spoof.indexSector.breakdown[attribute.childNamed('label').val] = attribute.childNamed('rawValue').val
            })
            return html
        })
        //gets fund country weights
        .then((html) => {
            var fundCountryWeight = html('#FUND_COUNTRY_WEIGHTS');
            spoof.fundCountryWeight = {
                asOf: '',
                table: []
            }
            spoof.fundCountryWeight.asOf = fundCountryWeight.children('.asOf').text().trim()
            fundCountryWeight.find(html('tr')).each(function(i){
                var arr = []
                html(this).children().each(function(i){
                    arr.push(html(this).text())
                })
                spoof.fundCountryWeight.table.push(arr)
            })
            return html
        })

        //gets fund information
        .then((html) => {
            var fundInfo = html('.fund_information');
            spoof.fundInfo = {
                asOf: '',
                table: []
            }
            spoof.fundInfo.asOf = fundInfo.children('.asOf').text().trim()
            fundInfo.find(html('tr')).each(function(i){
                var arr = []
                html(this).children().each(function(i){
                    if(i !== 1){
                        arr.push(html(this).text())
                    }
                })
                spoof.fundInfo.table.push(arr)
            })
            return html
        })

        //gets Downloadable documents
        .then((html) => {
            var docs = html('.sect');
            spoof.docs = []
            docs.find(html('a')).each(function(i){
                var obj = {}
                var text = html(this).text()
                var link = html(this).attr('href')
                if(text !== '' && link !== 'javascript:void(0);' && link !== '#' && link !== 'javascript:void(0)'){
                    obj.link = 'https://www.spdrs.com'+ link
                    obj.text = text
                    spoof.docs.push(obj)
                }
            })
            return html
        })
        .then(() => res.json(spoof))
})




