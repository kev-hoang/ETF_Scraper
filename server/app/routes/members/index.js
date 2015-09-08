'use strict';
var router = require('express').Router();
module.exports = router;
var _ = require("lodash");
var mongoose = require('mongoose');
var User = mongoose.model('User');

var ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
};

router.post('/signup', function (req, res, next) {
    var {email} = req.body
    User.findOne({email})
    .then((user) => {
        if(user){
            var error = new Error('User Exists');
            error.status = 401;
            return next(error)
        }else{
            User.create(req.body)
                .then((user) => {
                    req.login(user, function () {
                        res.status(201).json(_.omit(user.toJSON(), ['salt', 'password']));
                    });
                })
                .then(null, next);
        }
    })

});

router.get('/history/:id', ensureAuthenticated, function(req, res, next){
    User.findById(req.params.id)
    .then((user) => {
        if(user.history){
            var history = user.history.map((e) => {
                e.date = new Date(Date.parse(e.date)).toLocaleString();
                return e
            })
            res.json(history)
        }else{
            res.json(user)
        }
    })
})

router.delete('/history/:id', ensureAuthenticated, function(req, res, next){
    User.findById(req.params.id)
    .then((user) => {
        user.history.length = 0;
        user.markModified('history')
        user.save().then((user) => {
            res.json(user)
        })
    })
})

router.post('/history', ensureAuthenticated, function(req, res){
    var {id, ticker} = req.body
    User.findById(id)
    .then((user) => {
        user.history.push({ticker})
        user.save().then((user) => {
            res.json(user)
        })
    })
})

router.get('/favorites/:id', ensureAuthenticated, function(req, res, next){
    User.findById(req.params.id)
    .then((user) => {
        res.json(user.favorites)
    })
})

router.delete('/favorites/:id', ensureAuthenticated, function(req, res, next){
    User.findById(req.params.id)
    .then((user) => {
        user.favorites.length = 0;
        user.markModified('favorites')
        user.save().then((user) => {
            res.json(user)
        })
    })
})

router.post('/favorites', ensureAuthenticated, function(req, res){
    var {id, ticker} = req.body
    ticker = ticker.toUpperCase();
    User.findById(id)
    .then((user) => {
        if(user.favorites.indexOf(ticker) < 0){
            user.favorites.push(ticker)
            user.markModified('favorites')
            user.save().then((user) => {
                console.log(user)
                res.json(user)
            })
        }else{
            res.json(user)
        }
    })
})