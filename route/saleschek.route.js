'use strict'

var SalesController = require('../controller/salescheck.controller');
var authentification = require('../middleware/authenticated');
var express = require('express');
var api = express.Router();

api.get('/CreateSalesCheak/:id', authentification.ensureAuth,SalesController.createSalesCheck);
api.get('/listSalesCheak/:id', authentification.ensureAuth,SalesController.listSalesCheck);
api.get('/productSalescheak/:id/:ids', authentification.ensureAuth,SalesController.productSalescheak);
module.exports = api;