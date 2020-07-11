'use strict'

var express = require('express');
var app = express();
var bodyparser = require('body-parser');
var routeProduct = require('./route/product.route');
var routeUser = require('./route/user.route');
var routeCategory = require('./route/category.route');
var routeSalescheck = require('./route/saleschek.route');
var routeCartshopping = require('./route/cartshopping.route');

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());


app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

app.use(routeProduct);
app.use(routeUser);
app.use(routeCategory);
app.use(routeSalescheck);
app.use(routeCartshopping);

module.exports = app;